package tester

import (
	"encoding/json"
	"fmt"
	"strings"
)

// comparePayload checks that all expected fields exist in the actual response
// with matching values. Extra fields in the actual response are allowed.
func comparePayload(expected, actual any) error {
	return compareAt("", expected, actual)
}

func compareAt(path string, expected, actual any) error {
	if expected == nil {
		return nil
	}

	switch exp := expected.(type) {
	case map[string]any:
		act, ok := actual.(map[string]any)
		if !ok {
			return fmt.Errorf("at %s: expected object, got %T", pathOrRoot(path), actual)
		}
		for k, v := range exp {
			childPath := path + "." + k
			if path == "" {
				childPath = k
			}
			actVal, exists := act[k]
			if !exists {
				return fmt.Errorf("at %s: missing expected field", childPath)
			}
			if err := compareAt(childPath, v, actVal); err != nil {
				return err
			}
		}
	case []any:
		act, ok := actual.([]any)
		if !ok {
			return fmt.Errorf("at %s: expected array, got %T", pathOrRoot(path), actual)
		}
		if len(act) < len(exp) {
			return fmt.Errorf("at %s: expected array length >= %d, got %d", pathOrRoot(path), len(exp), len(act))
		}
		for i, v := range exp {
			childPath := fmt.Sprintf("%s[%d]", path, i)
			if err := compareAt(childPath, v, act[i]); err != nil {
				return err
			}
		}
	default:
		if !valuesEqual(expected, actual) {
			return fmt.Errorf("at %s: expected %v (%T), got %v (%T)", pathOrRoot(path), expected, expected, actual, actual)
		}
	}
	return nil
}

// valuesEqual compares scalar values with numeric type coercion.
func valuesEqual(a, b any) bool {
	if na, ok := toFloat64(a); ok {
		if nb, ok := toFloat64(b); ok {
			return na == nb
		}
	}
	return fmt.Sprintf("%v", a) == fmt.Sprintf("%v", b)
}

func toFloat64(v any) (float64, bool) {
	switch n := v.(type) {
	case json.Number:
		f, err := n.Float64()
		return f, err == nil
	case int:
		return float64(n), true
	case int64:
		return float64(n), true
	case uint64:
		return float64(n), true
	case float64:
		return n, true
	case float32:
		return float64(n), true
	}
	return 0, false
}

func pathOrRoot(path string) string {
	if path == "" {
		return "$"
	}
	return strings.TrimPrefix(path, ".")
}
