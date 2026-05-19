package tester

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"reflect"
	"regexp"
	"slices"
	"strings"
	"time"

	"github.com/brightcove/playback_go-smile/smile"
	"github.com/fxamacker/cbor/v2"
	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/osclient"
)

var pathParamRE = regexp.MustCompile(`\{([^}]+)\}`)

var cborDecMode = func() cbor.DecMode {
	dm, err := cbor.DecOptions{
		DefaultMapType: reflect.TypeFor[map[string]any](),
	}.DecMode()
	if err != nil {
		panic(err)
	}
	return dm
}()

// Executor runs individual chapters against a cluster.
type Executor struct {
	client  *osclient.Client
	outputs *Outputs
}

// NewExecutor creates an executor bound to the given cluster client.
func NewExecutor(client *osclient.Client) *Executor {
	return &Executor{
		client:  client,
		outputs: NewOutputs(),
	}
}

// RunChapter executes a main chapter and returns its result.
func (e *Executor) RunChapter(ch Chapter, clusterVersion, distribution string) ChapterResult {
	if ch.Pending != "" {
		return ChapterResult{
			Title:     ch.Synopsis,
			Operation: ch.Method[0] + " " + ch.Path,
			Path:      ch.Path,
			Method:    ch.Method[0],
			Result:    ResultIgnored,
			Message:   ch.Pending,
		}
	}

	if skip, reason := shouldSkip(ch.Version, ch.Distributions, clusterVersion, distribution); skip {
		return ChapterResult{
			Title:     ch.Synopsis,
			Operation: ch.Method[0] + " " + ch.Path,
			Path:      ch.Path,
			Method:    ch.Method[0],
			Result:    ResultSkipped,
			Message:   reason,
		}
	}

	maxAttempts := 1
	waitMS := 1000
	if ch.Retry != nil {
		maxAttempts = ch.Retry.Count + 1
		if ch.Retry.Wait > 0 {
			waitMS = ch.Retry.Wait
		}
	}

	var result ChapterResult
	for attempt := range maxAttempts {
		result = e.executeChapter(ch)
		if result.Result == ResultPassed || result.Result == ResultSkipped {
			result.Retries = attempt
			return result
		}
		if attempt < maxAttempts-1 {
			time.Sleep(time.Duration(waitMS) * time.Millisecond)
		}
	}
	result.Retries = maxAttempts - 1
	return result
}

// RunSupplement executes a prologue/epilogue step.
func (e *Executor) RunSupplement(s Supplement, clusterVersion, distribution string) ChapterResult {
	if skip, reason := shouldSkip(s.Version, s.Distributions, clusterVersion, distribution); skip {
		return ChapterResult{
			Title:     s.Method[0] + " " + s.Path,
			Operation: s.Method[0] + " " + s.Path,
			Result:    ResultSkipped,
			Message:   reason,
		}
	}

	maxAttempts := 1
	waitMS := 1000
	if s.Retry != nil {
		maxAttempts = s.Retry.Count + 1
		if s.Retry.Wait > 0 {
			waitMS = s.Retry.Wait
		}
	}

	acceptedStatus := s.Status
	if len(acceptedStatus) == 0 {
		acceptedStatus = []int{200, 201}
	}

	var expectedPayload any
	if s.Response != nil {
		expectedPayload = s.Response.Payload
	}

	var result ChapterResult
	for attempt := range maxAttempts {
		result = e.executeSupplement(s.Method[0], s.Path, s.Parameters, s.Request, acceptedStatus, expectedPayload, s.Output, s.ID)
		if result.Result == ResultPassed {
			result.Retries = attempt
			return result
		}
		if attempt < maxAttempts-1 {
			time.Sleep(time.Duration(waitMS) * time.Millisecond)
		}
	}
	result.Retries = maxAttempts - 1
	return result
}

func (e *Executor) executeChapter(ch Chapter) ChapterResult {
	cr := ChapterResult{
		Title:     ch.Synopsis,
		Operation: ch.Method[0] + " " + ch.Path,
		Path:      ch.Path,
		Method:    ch.Method[0],
	}

	resolvedPath, queryParams, err := e.buildRequest(ch.Path, ch.Parameters)
	if err != nil {
		cr.Result = ResultError
		cr.Message = err.Error()
		return cr
	}

	body, contentType, err := e.serializePayload(ch.Request)
	if err != nil {
		cr.Result = ResultError
		cr.Message = err.Error()
		return cr
	}

	status, respHeaders, respBody, err := e.doHTTP(ch.Method[0], resolvedPath, queryParams, body, contentType, ch.Request)
	if err != nil {
		cr.Result = ResultError
		cr.Message = err.Error()
		return cr
	}

	expectedStatus := []int{200}
	if ch.Response != nil && len(ch.Response.Status) > 0 {
		expectedStatus = []int(ch.Response.Status)
	}
	if !slices.Contains(expectedStatus, status) {
		cr.Result = ResultFailed
		cr.Message = fmt.Sprintf("expected status %v, got %d: %s", expectedStatus, status, formatBody(respBody))
		return cr
	}

	if ch.ID != "" && len(ch.Output) > 0 {
		extracted, err := ExtractOutput(ch.Output, respBody, respHeaders)
		if err != nil {
			cr.Result = ResultError
			cr.Message = err.Error()
			return cr
		}
		for name, val := range extracted {
			e.outputs.Set(ch.ID, name, val)
		}
	}

	if ch.Response != nil && ch.Response.Payload != nil {
		resolvedExpected, err := e.outputs.Resolve(ch.Response.Payload)
		if err != nil {
			cr.Result = ResultError
			cr.Message = fmt.Sprintf("resolving expected payload: %v", err)
			return cr
		}
		if err := comparePayload(resolvedExpected, respBody); err != nil {
			cr.Result = ResultFailed
			cr.Message = fmt.Sprintf("%v\nfull response: %s", err, formatBody(respBody))
			return cr
		}
	}

	cr.Result = ResultPassed
	return cr
}

func (e *Executor) executeSupplement(
	method, path string,
	params map[string]any,
	req *Request,
	acceptedStatus []int,
	expectedPayload any,
	output map[string]any,
	id string,
) ChapterResult {
	cr := ChapterResult{
		Title:     method + " " + path,
		Operation: method + " " + path,
	}

	resolvedPath, queryParams, err := e.buildRequest(path, params)
	if err != nil {
		cr.Result = ResultError
		cr.Message = err.Error()
		return cr
	}

	body, contentType, err := e.serializePayload(req)
	if err != nil {
		cr.Result = ResultError
		cr.Message = err.Error()
		return cr
	}

	status, respHeaders, respBody, err := e.doHTTP(method, resolvedPath, queryParams, body, contentType, req)
	if err != nil {
		cr.Result = ResultError
		cr.Message = err.Error()
		return cr
	}

	if !slices.Contains(acceptedStatus, status) {
		cr.Result = ResultError
		cr.Message = fmt.Sprintf("supplement expected status %v, got %d: %s", acceptedStatus, status, formatBody(respBody))
		return cr
	}

	if expectedPayload != nil {
		resolvedExpected, err := e.outputs.Resolve(expectedPayload)
		if err != nil {
			cr.Result = ResultError
			cr.Message = err.Error()
			return cr
		}
		if err := comparePayload(resolvedExpected, respBody); err != nil {
			cr.Result = ResultError
			cr.Message = fmt.Sprintf("%v\nfull response: %s", err, formatBody(respBody))
			return cr
		}
	}

	if id != "" && len(output) > 0 {
		extracted, err := ExtractOutput(output, respBody, respHeaders)
		if err != nil {
			cr.Result = ResultError
			cr.Message = err.Error()
			return cr
		}
		for name, val := range extracted {
			e.outputs.Set(id, name, val)
		}
	}

	cr.Result = ResultPassed
	return cr
}

func (e *Executor) buildRequest(path string, params map[string]any) (string, map[string]string, error) {
	resolvedParams, err := e.resolveParams(params)
	if err != nil {
		return "", nil, err
	}

	resolvedPath := pathParamRE.ReplaceAllStringFunc(path, func(match string) string {
		paramName := match[1 : len(match)-1]
		if val, ok := resolvedParams[paramName]; ok {
			delete(resolvedParams, paramName)
			switch v := val.(type) {
			case []any:
				items := make([]string, len(v))
				for i, item := range v {
					items[i] = fmt.Sprintf("%v", item)
				}
				return strings.Join(items, ",")
			default:
				return fmt.Sprintf("%v", val)
			}
		}
		return match
	})

	queryParams := make(map[string]string, len(resolvedParams))
	for k, v := range resolvedParams {
		switch val := v.(type) {
		case []any:
			items := make([]string, len(val))
			for i, item := range val {
				items[i] = fmt.Sprintf("%v", item)
			}
			queryParams[k] = strings.Join(items, ",")
		default:
			queryParams[k] = fmt.Sprintf("%v", v)
		}
	}

	return resolvedPath, queryParams, nil
}

func (e *Executor) resolveParams(params map[string]any) (map[string]any, error) {
	if len(params) == 0 {
		return nil, nil //nolint:nilnil // nil map is intentional when no params exist
	}
	resolved, err := e.outputs.Resolve(params)
	if err != nil {
		return nil, err
	}
	return resolved.(map[string]any), nil
}

func (e *Executor) serializePayload(req *Request) (io.Reader, string, error) {
	if req == nil || req.Payload == nil {
		return nil, "", nil
	}

	resolved, err := e.outputs.Resolve(req.Payload)
	if err != nil {
		return nil, "", err
	}

	contentType := req.ContentType
	if contentType == "" {
		contentType = "application/json"
	}

	switch contentType {
	case "application/x-ndjson":
		items, ok := resolved.([]any)
		if !ok {
			return nil, "", fmt.Errorf("ndjson payload must be an array")
		}
		var buf bytes.Buffer
		for _, item := range items {
			line, err := json.Marshal(item)
			if err != nil {
				return nil, "", err
			}
			buf.Write(line)
			buf.WriteByte('\n')
		}
		return &buf, contentType, nil
	default:
		data, err := json.Marshal(resolved)
		if err != nil {
			return nil, "", err
		}
		return bytes.NewReader(data), contentType, nil
	}
}

func (e *Executor) doHTTP(
	method, path string,
	queryParams map[string]string,
	body io.Reader,
	contentType string,
	req *Request,
) (int, map[string]string, any, error) {
	fullPath := path
	if len(queryParams) > 0 {
		parts := make([]string, 0, len(queryParams))
		for k, v := range queryParams {
			parts = append(parts, k+"="+v)
		}
		fullPath += "?" + strings.Join(parts, "&")
	}

	ref, err := url.Parse(strings.TrimPrefix(fullPath, "/"))
	if err != nil {
		return 0, nil, nil, fmt.Errorf("parsing request path: %w", err)
	}
	httpReq, err := http.NewRequestWithContext(context.Background(), method, e.client.URL().ResolveReference(ref).String(), body)
	if err != nil {
		return 0, nil, nil, err
	}

	if contentType != "" {
		httpReq.Header.Set("Content-Type", contentType)
	}
	if req != nil {
		for k, v := range req.Headers {
			httpReq.Header.Set(k, v)
		}
	}

	e.client.SetAuth(httpReq)

	resp, err := e.client.Do(httpReq)
	if err != nil {
		return 0, nil, nil, err
	}
	defer resp.Body.Close()

	respData, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, nil, nil, err
	}

	headers := make(map[string]string)
	for k := range resp.Header {
		headers[strings.ToLower(k)] = resp.Header.Get(k)
	}

	respBody := decodeResponseBody(respData, resp.Header.Get("Content-Type"))

	return resp.StatusCode, headers, respBody, nil
}

func decodeResponseBody(data []byte, contentType string) any {
	if len(data) == 0 {
		return nil
	}
	ct := strings.SplitN(contentType, ";", 2)[0]
	switch ct {
	case "application/yaml":
		var v any
		if err := yaml.Unmarshal(data, &v); err == nil {
			return v
		}
	case "application/cbor":
		var v any
		if err := cborDecMode.Unmarshal(data, &v); err == nil {
			return v
		}
	case "application/smile":
		if v, err := smile.DecodeToObject(data); err == nil {
			return v
		}
	default:
		var v any
		dec := json.NewDecoder(bytes.NewReader(data))
		dec.UseNumber()
		if err := dec.Decode(&v); err == nil {
			return v
		}
	}
	return string(data)
}

// formatBody returns a representation of a response body suitable for
// embedding in error messages. JSON-shaped values are pretty-printed; long
// outputs are truncated.
func formatBody(body any) string {
	if body == nil {
		return ""
	}
	const maxLen = 4000
	var s string
	switch v := body.(type) {
	case string:
		s = v
	case []byte:
		s = string(v)
	default:
		b, err := json.MarshalIndent(body, "", "  ")
		if err != nil {
			s = fmt.Sprintf("%v", body)
		} else {
			s = string(b)
		}
	}
	if len(s) > maxLen {
		s = s[:maxLen] + "...(truncated)"
	}
	return s
}
