package tester

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/merger"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/osclient"
	"github.com/opensearch-project/opensearch-api-specification/cmd/osapispec/internal/spec"
)

// Run is the entry point for the "test" subcommand.
func Run(args []string) {
	fs := flag.NewFlagSet("test", flag.ExitOnError)
	testsPath := fs.String("tests", "tests", "Path to the test stories directory")
	url := fs.String("url", "https://localhost:9200", "OpenSearch cluster URL")
	username := fs.String("username", "admin", "Username for authentication")
	password := fs.String("password", "", "Password for authentication")
	insecure := fs.Bool("insecure", false, "Disable TLS certificate verification")
	certFile := fs.String("cert", "", "Path to client TLS certificate (PEM)")
	keyFile := fs.String("key", "", "Path to client TLS key (PEM)")
	http1 := fs.Bool("http1", false, "Force HTTP/1.1 (disable HTTP/2 ALPN negotiation)")
	versionFlag := fs.String("version", "", "OpenSearch version (overrides cluster-reported version)")
	coveragePath := fs.String("coverage", "", "Path to write test coverage JSON")
	logPath := fs.String("log", "", "Path to write test execution log")
	verbose := fs.Bool("verbose", false, "Print details for each chapter")
	specPath := fs.String("spec", "", "Path to the spec source directory (used to populate the operations list in coverage output)")

	if err := fs.Parse(args); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	var output io.Writer = os.Stdout
	var logFile *os.File
	if *logPath != "" {
		if err := os.MkdirAll(filepath.Dir(*logPath), 0o755); err != nil {
			fmt.Fprintf(os.Stderr, "error creating log directory: %v\n", err)
			os.Exit(1)
		}
		var err error
		logFile, err = os.Create(*logPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating log file: %v\n", err)
			os.Exit(1)
		}
		output = io.MultiWriter(os.Stdout, logFile)
	}

	client, err := osclient.New(osclient.Options{
		URL:      *url,
		Username: *username,
		Password: *password,
		Insecure: *insecure,
		CertFile: *certFile,
		KeyFile:  *keyFile,
		HTTP1:    *http1,
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	info, err := client.WaitUntilAvailable(120 * time.Second)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	fmt.Fprintf(output, "Connected to %s (OpenSearch %s)\n", info.Name, info.Version.Number)

	clusterVersion := info.Version.Number
	if *versionFlag != "" {
		clusterVersion = *versionFlag
	}

	stories, err := discoverStories(*testsPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error discovering stories: %v\n", err)
		os.Exit(1)
	}

	if len(stories) == 0 {
		fmt.Fprintf(os.Stderr, "no test stories found in %s\n", *testsPath)
		os.Exit(1)
	}

	fmt.Fprintf(output, "Found %d test stories\n\n", len(stories))

	var (
		passed            int
		failed            int
		skipped           int
		errored           int
		storyPaths        = make([]string, 0, len(stories))
		evaluatedOps      []OpRef
		evaluatedOpsDedup = make(map[OpRef]bool)
	)

	// Coverage tracks every discovered story file so merge-coverage doesn't
	// flag stories as "unused" when early-termination skips them after a failure.
	for _, sf := range stories {
		storyPaths = append(storyPaths, sf.fullPath)
	}

	for i, sf := range stories {
		result := runStory(sf, client, clusterVersion, info.Version.Distribution, *verbose, output)
		for _, ch := range result.Chapters {
			if ch.Result == ResultPassed || ch.Result == ResultFailed {
				op := OpRef{Path: ch.Path, Method: ch.Method}
				if op.Path != "" && op.Method != "" && !evaluatedOpsDedup[op] {
					evaluatedOpsDedup[op] = true
					evaluatedOps = append(evaluatedOps, op)
				}
			}
		}
		switch result.Result {
		case ResultPassed:
			passed++
			fmt.Fprintf(output, "  PASS  %s (%d/%d)\n", sf.displayPath, i+1, len(stories))
		case ResultSkipped:
			skipped++
			fmt.Fprintf(output, "  SKIP  %s (%s)\n", sf.displayPath, result.Message)
		case ResultFailed:
			failed++
			fmt.Fprintf(output, "  FAIL  %s: %s\n", sf.displayPath, result.Message)
		case ResultError:
			errored++
			fmt.Fprintf(output, "  ERROR %s: %s\n", sf.displayPath, result.Message)
		case ResultIgnored:
			skipped++
		}
		if failed+errored > 0 {
			break
		}
	}

	fmt.Fprintf(output, "\nResults: %d passed, %d failed, %d errors, %d skipped (total: %d)\n",
		passed, failed, errored, skipped, len(stories))

	//nolint:nestif // coverage path will be refactored by spec operations work
	if *coveragePath != "" {
		var allOps []OpRef
		if *specPath != "" {
			ops, err := loadSpecOperations(*specPath)
			if err != nil {
				fmt.Fprintf(os.Stderr, "error loading spec operations: %v\n", err)
			} else {
				allOps = ops
			}
		}
		if err := writeCoverage(*coveragePath, storyPaths, allOps, evaluatedOps); err != nil {
			fmt.Fprintf(os.Stderr, "error writing coverage: %v\n", err)
		}
	}

	if logFile != nil {
		logFile.Close()
	}

	if failed+errored > 0 {
		os.Exit(1)
	}
}

type storyFile struct {
	fullPath    string
	displayPath string
}

func discoverStories(root string) ([]storyFile, error) {
	var stories []storyFile

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		name := info.Name()
		if strings.HasPrefix(name, ".") {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		if info.IsDir() {
			return nil
		}

		if !strings.HasSuffix(name, ".yaml") && !strings.HasSuffix(name, ".yml") {
			return nil
		}

		if name == "docker-compose.yml" || name == "Dockerfile" {
			return nil
		}

		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		abs, err := filepath.Abs(path)
		if err != nil {
			return err
		}
		stories = append(stories, storyFile{
			fullPath:    abs,
			displayPath: rel,
		})
		return nil
	})
	if err != nil {
		return nil, err
	}

	sort.Slice(stories, func(i, j int) bool {
		di := strings.Count(stories[i].displayPath, string(filepath.Separator))
		dj := strings.Count(stories[j].displayPath, string(filepath.Separator))
		if di != dj {
			return di < dj
		}
		return stories[i].displayPath < stories[j].displayPath
	})

	return stories, nil
}

func runStory(
	sf storyFile,
	client *osclient.Client,
	clusterVersion, distribution string,
	verbose bool,
	output io.Writer,
) StoryResult {
	data, err := os.ReadFile(sf.fullPath)
	if err != nil {
		return StoryResult{
			Result:      ResultError,
			DisplayPath: sf.displayPath,
			Message:     err.Error(),
		}
	}

	var story Story
	if err := yaml.Unmarshal(data, &story); err != nil {
		return StoryResult{
			Result:      ResultError,
			DisplayPath: sf.displayPath,
			Message:     fmt.Sprintf("parse error: %v", err),
		}
	}

	if skip, reason := shouldSkip(story.Version, story.Distributions, clusterVersion, distribution); skip {
		return StoryResult{
			Result:      ResultSkipped,
			DisplayPath: sf.displayPath,
			Description: story.Description,
			Message:     reason,
		}
	}

	exec := NewExecutor(client)
	result := StoryResult{
		DisplayPath: sf.displayPath,
		Description: story.Description,
	}

	expandedChapters := expandChapters(story.Chapters)

	// Run prologues
	for _, p := range story.Prologues {
		for _, method := range p.Method {
			s := p
			s.Method = StringOrList{method}
			cr := exec.RunSupplement(s, clusterVersion, distribution)
			result.Prologues = append(result.Prologues, cr)
			if verbose && cr.Result != ResultPassed {
				fmt.Fprintf(output, "    prologue %s: %s\n", cr.Operation, cr.Message)
			}
			if cr.Result == ResultError {
				result.Result = ResultError
				result.Message = fmt.Sprintf("prologue failed: %s", cr.Message)
				runEpilogues(exec, story.Epilogues, clusterVersion, distribution, &result, verbose, output)
				return result
			}
		}
	}

	// Run chapters
	hasFailure := false
	for _, ch := range expandedChapters {
		cr := exec.RunChapter(ch, clusterVersion, distribution)
		result.Chapters = append(result.Chapters, cr)
		if verbose {
			printChapterResult(cr, output)
		}
		if cr.Result == ResultFailed || cr.Result == ResultError {
			hasFailure = true
			if result.Message == "" {
				result.Message = fmt.Sprintf("%s: %s", cr.Title, cr.Message)
			}
		}
	}

	// Run epilogues (always, regardless of failures)
	runEpilogues(exec, story.Epilogues, clusterVersion, distribution, &result, verbose, output)

	result.Result = determineOverallResult(hasFailure, result.Chapters)
	return result
}

func printChapterResult(cr ChapterResult, output io.Writer) {
	switch cr.Result {
	case ResultPassed:
		fmt.Fprintf(output, "    + %s\n", cr.Title)
	case ResultFailed:
		fmt.Fprintf(output, "    x %s: %s\n", cr.Title, cr.Message)
	case ResultError:
		fmt.Fprintf(output, "    ! %s: %s\n", cr.Title, cr.Message)
	case ResultSkipped:
		fmt.Fprintf(output, "    - %s (skipped)\n", cr.Title)
	case ResultIgnored:
		fmt.Fprintf(output, "    ~ %s (pending)\n", cr.Title)
	}
}

func determineOverallResult(hasFailure bool, chapters []ChapterResult) Result {
	if hasFailure {
		for _, cr := range chapters {
			if cr.Result == ResultError {
				return ResultError
			}
		}
		return ResultFailed
	}

	allSkipped := true
	for _, cr := range chapters {
		if cr.Result != ResultSkipped && cr.Result != ResultIgnored {
			allSkipped = false
			break
		}
	}
	if allSkipped && len(chapters) > 0 {
		return ResultSkipped
	}
	return ResultPassed
}

func runEpilogues(
	exec *Executor,
	epilogues []Supplement,
	clusterVersion, distribution string,
	result *StoryResult,
	verbose bool,
	output io.Writer,
) {
	for _, ep := range epilogues {
		for _, method := range ep.Method {
			s := ep
			s.Method = StringOrList{method}
			cr := exec.RunSupplement(s, clusterVersion, distribution)
			result.Epilogues = append(result.Epilogues, cr)
			if verbose && cr.Result != ResultPassed {
				fmt.Fprintf(output, "    epilogue %s: %s\n", cr.Operation, cr.Message)
			}
		}
	}
}

// expandChapters splits multi-method chapters into individual chapters.
func expandChapters(chapters []Chapter) []Chapter {
	var expanded []Chapter
	for _, ch := range chapters {
		if len(ch.Method) <= 1 {
			expanded = append(expanded, ch)
			continue
		}
		for _, method := range ch.Method {
			dup := ch
			dup.Method = StringOrList{method}
			dup.Synopsis = fmt.Sprintf("%s [%s]", ch.Synopsis, method)
			expanded = append(expanded, dup)
		}
	}
	return expanded
}

func loadSpecOperations(specRoot string) ([]OpRef, error) {
	m, err := merger.NewMerger(specRoot)
	if err != nil {
		return nil, err
	}
	merged, err := m.Merge()
	if err != nil {
		return nil, err
	}
	root := merged
	if merged.Kind == yaml.DocumentNode && len(merged.Content) > 0 {
		root = merged.Content[0]
	}
	paths := spec.GetPath(root, spec.KeyPaths)
	if paths == nil {
		return []OpRef{}, nil
	}
	var ops []OpRef
	spec.ForEachKV(paths, func(path string, pathItem *yaml.Node) {
		spec.ForEachKV(pathItem, func(key string, _ *yaml.Node) {
			method := strings.ToUpper(key)
			if httpMethodSet[method] {
				ops = append(ops, OpRef{Path: path, Method: method})
			}
		})
	})
	return ops, nil
}

func writeCoverage(path string, stories []string, operations, evaluated []OpRef) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	if stories == nil {
		stories = []string{}
	}
	if operations == nil {
		operations = []OpRef{}
	}
	if evaluated == nil {
		evaluated = []OpRef{}
	}
	out := CoverageOutput{
		Stories:             stories,
		Operations:          operations,
		EvaluatedOperations: evaluated,
	}
	data, err := json.MarshalIndent(out, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, append(data, '\n'), 0o600)
}

var httpMethodSet = map[string]bool{
	http.MethodGet:     true,
	http.MethodPut:     true,
	http.MethodPost:    true,
	http.MethodDelete:  true,
	http.MethodPatch:   true,
	http.MethodHead:    true,
	http.MethodOptions: true,
}
