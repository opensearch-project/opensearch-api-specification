package tester

import (
	"fmt"
	"regexp"
	"slices"
	"strconv"
	"strings"
)

var outputRefRE = regexp.MustCompile(`\$\{([^.}]+)\.([^}]+)\}`)

// Outputs stores extracted output values from chapters keyed by chapter ID.
type Outputs struct {
	values map[string]map[string]any
}

// NewOutputs creates an empty output store.
func NewOutputs() *Outputs {
	return &Outputs{values: make(map[string]map[string]any)}
}

// Set stores an extracted output value for a chapter.
func (o *Outputs) Set(chapterID, name string, value any) {
	if o.values[chapterID] == nil {
		o.values[chapterID] = make(map[string]any)
	}
	o.values[chapterID][name] = value
}

// Get retrieves an output value by chapter ID and name.
func (o *Outputs) Get(chapterID, name string) (any, bool) {
	m, ok := o.values[chapterID]
	if !ok {
		return nil, false
	}
	v, ok := m[name]
	return v, ok
}

// Resolve resolves output references in a value. If the entire value is a single
// reference like "${id.name}", it returns the raw typed value. If the reference is
// embedded in a larger string, it performs string interpolation.
func (o *Outputs) Resolve(v any) (any, error) {
	switch val := v.(type) {
	case string:
		return o.resolveString(val)
	case map[string]any:
		resolved := make(map[string]any, len(val))
		for k, item := range val {
			rk, err := o.resolveString(k)
			if err != nil {
				return nil, err
			}
			resolvedKey := fmt.Sprintf("%v", rk)
			r, err := o.Resolve(item)
			if err != nil {
				return nil, err
			}
			resolved[resolvedKey] = r
		}
		return resolved, nil
	case []any:
		resolved := make([]any, len(val))
		for i, item := range val {
			r, err := o.Resolve(item)
			if err != nil {
				return nil, err
			}
			resolved[i] = r
		}
		return resolved, nil
	default:
		return v, nil
	}
}

func (o *Outputs) resolveString(s string) (any, error) {
	matches := outputRefRE.FindAllStringSubmatchIndex(s, -1)
	if len(matches) == 0 {
		return s, nil
	}

	// If the entire string is a single reference, return the typed value.
	if len(matches) == 1 && matches[0][0] == 0 && matches[0][1] == len(s) {
		chapterID := s[matches[0][2]:matches[0][3]]
		name := s[matches[0][4]:matches[0][5]]
		val, ok := o.Get(chapterID, name)
		if !ok {
			return nil, fmt.Errorf("unresolved output reference: ${%s.%s}", chapterID, name)
		}
		return val, nil
	}

	// Otherwise do string interpolation.
	result := s
	for _, v := range slices.Backward(matches) {
		m := v
		chapterID := s[m[2]:m[3]]
		name := s[m[4]:m[5]]
		val, ok := o.Get(chapterID, name)
		if !ok {
			return nil, fmt.Errorf("unresolved output reference: ${%s.%s}", chapterID, name)
		}
		result = result[:m[0]] + fmt.Sprintf("%v", val) + result[m[1]:]
	}
	return result, nil
}

// ExtractOutput extracts output values from a response body using dot-path notation.
// Output definitions can be either a simple string path (e.g., "payload.field") or
// a map with "path" and optional "default" keys.
// Returns an error if a payload-based path resolves to nil with no default — this
// indicates the response isn't ready yet (e.g., the field hasn't been populated),
// and the caller should treat it like a failed assertion to trigger retry.
func ExtractOutput(outputDef map[string]any, payload any, headers map[string]string) (map[string]any, error) {
	if len(outputDef) == 0 {
		return nil, nil //nolint:nilnil // nil map is intentional when no outputs defined
	}
	result := make(map[string]any, len(outputDef))
	for name, pathDef := range outputDef {
		var path string
		var defaultVal any
		switch v := pathDef.(type) {
		case string:
			path = v
		case map[string]any:
			path, _ = v["path"].(string)
			defaultVal = v["default"]
		}
		if path == "" {
			continue
		}
		val := extractByPath(path, payload, headers)
		if val == nil && defaultVal != nil {
			val = defaultVal
		}
		if val == nil && (path == "payload" || strings.HasPrefix(path, "payload")) {
			return nil, fmt.Errorf("expected non-nil value at %q", path)
		}
		result[name] = val
	}
	return result, nil
}

func extractByPath(path string, payload any, headers map[string]string) any {
	switch {
	case path == "payload":
		return payload
	case strings.HasPrefix(path, "payload."):
		return navigatePath(payload, strings.TrimPrefix(path, "payload."))
	case strings.HasPrefix(path, "payload["):
		return navigatePath(payload, strings.TrimPrefix(path, "payload"))
	case path == "headers":
		return nil
	case strings.HasPrefix(path, "headers."):
		return headers[strings.TrimPrefix(path, "headers.")]
	default:
		return navigatePath(payload, path)
	}
}

var pathSegRE = regexp.MustCompile(`([^.\[\]]+)|\[(\d+)\]`)

func navigatePath(data any, path string) any {
	if path == "" {
		return data
	}
	current := data
	for _, match := range pathSegRE.FindAllStringSubmatch(path, -1) {
		if match[1] != "" {
			m, ok := current.(map[string]any)
			if !ok {
				return nil
			}
			current = m[match[1]]
		} else if match[2] != "" {
			arr, ok := current.([]any)
			if !ok {
				return nil
			}
			idx, err := strconv.Atoi(match[2])
			if err != nil || idx >= len(arr) {
				return nil
			}
			current = arr[idx]
		}
	}
	return current
}
