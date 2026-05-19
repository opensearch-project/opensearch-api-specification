// Package tester runs YAML test stories against a live OpenSearch cluster.
package tester

// Story represents a parsed test story YAML file.
type Story struct {
	Schema        string         `yaml:"$schema"`
	Description   string         `yaml:"description"`
	Version       string         `yaml:"version"`
	Distributions *Distributions `yaml:"distributions"`
	Prologues     []Supplement   `yaml:"prologues"`
	Epilogues     []Supplement   `yaml:"epilogues"`
	Chapters      []Chapter      `yaml:"chapters"`
}

// Distributions controls which cluster distributions a story runs on.
type Distributions struct {
	Included []string `yaml:"included"`
	Excluded []string `yaml:"excluded"`
}

// Chapter is a main test step with synopsis and response expectations.
type Chapter struct {
	Synopsis      string         `yaml:"synopsis"`
	ID            string         `yaml:"id"`
	Path          string         `yaml:"path"`
	Method        StringOrList   `yaml:"method"`
	Version       string         `yaml:"version"`
	Distributions *Distributions `yaml:"distributions"`
	Pending       string         `yaml:"pending"`
	Parameters    map[string]any `yaml:"parameters"`
	Request       *Request       `yaml:"request"`
	Response      *Response      `yaml:"response"`
	Output        map[string]any `yaml:"output"`
	Retry         *Retry         `yaml:"retry"`
	Warnings      map[string]any `yaml:"warnings"`
}

// Supplement is a prologue or epilogue step with relaxed validation.
type Supplement struct {
	ID            string         `yaml:"id"`
	Path          string         `yaml:"path"`
	Method        StringOrList   `yaml:"method"`
	Version       string         `yaml:"version"`
	Distributions *Distributions `yaml:"distributions"`
	Parameters    map[string]any `yaml:"parameters"`
	Request       *Request       `yaml:"request"`
	Response      *Response      `yaml:"response"`
	Output        map[string]any `yaml:"output"`
	Retry         *Retry         `yaml:"retry"`
	Status        []int          `yaml:"status"`
	Warnings      map[string]any `yaml:"warnings"`
}

// Request describes the HTTP request body and content type.
type Request struct {
	ContentType string            `yaml:"content_type"`
	Headers     map[string]string `yaml:"headers"`
	Payload     any               `yaml:"payload"`
}

// Response describes expected HTTP response fields.
type Response struct {
	Status      IntOrList `yaml:"status"`
	ContentType string    `yaml:"content_type"`
	Payload     any       `yaml:"payload"`
}

// Retry configures retry attempts for a chapter.
type Retry struct {
	Count int `yaml:"count"`
	Wait  int `yaml:"wait"`
}

// Result is the outcome of evaluating a chapter or story.
type Result int

const (
	// ResultPassed indicates all validations succeeded.
	ResultPassed Result = iota
	// ResultFailed indicates a schema or body mismatch.
	ResultFailed
	// ResultError indicates an HTTP or validation error.
	ResultError
	// ResultSkipped indicates the chapter was skipped by version or distribution constraint.
	ResultSkipped
	// ResultIgnored indicates the chapter was marked as pending.
	ResultIgnored
)

// String returns the human-readable name of a result.
func (r Result) String() string {
	switch r {
	case ResultPassed:
		return "PASSED"
	case ResultFailed:
		return "FAILED"
	case ResultError:
		return "ERROR"
	case ResultSkipped:
		return "SKIPPED"
	case ResultIgnored:
		return "IGNORED"
	default:
		return "UNKNOWN"
	}
}

// StoryResult holds the evaluation outcome for one story file.
type StoryResult struct {
	Result      Result
	DisplayPath string
	Description string
	Prologues   []ChapterResult
	Chapters    []ChapterResult
	Epilogues   []ChapterResult
	Message     string
}

// ChapterResult holds the outcome of one chapter execution.
type ChapterResult struct {
	Title     string
	Operation string
	Path      string
	Method    string
	Result    Result
	Retries   int
	Message   string
}

// OpRef identifies a single API operation by path and method.
type OpRef struct {
	Path   string `json:"path"`
	Method string `json:"method"`
}

// CoverageOutput is the JSON structure written by the -coverage flag.
type CoverageOutput struct {
	Stories             []string `json:"stories"`
	Operations          []OpRef  `json:"operations"`
	EvaluatedOperations []OpRef  `json:"evaluated_operations"`
}
