package osclient

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// Client is an HTTP client for communicating with an OpenSearch cluster.
type Client struct {
	baseURL    *url.URL
	httpClient *http.Client
	username   string
	password   string
}

// Options configures a new Client.
type Options struct {
	URL      string
	Username string
	Password string
	Insecure bool
	CertFile string
	KeyFile  string
	HTTP1    bool
}

// New creates a Client with the given options.
func New(opts Options) (*Client, error) {
	transport := http.DefaultTransport.(*http.Transport).Clone()

	if opts.Insecure {
		transport.TLSClientConfig.InsecureSkipVerify = true
	}

	if opts.HTTP1 {
		transport.TLSNextProto = make(map[string]func(authority string, c *tls.Conn) http.RoundTripper)
		transport.ForceAttemptHTTP2 = false
		transport.TLSClientConfig.NextProtos = []string{"http/1.1"}
	}

	if opts.CertFile != "" && opts.KeyFile != "" {
		certPEM, err := os.ReadFile(opts.CertFile)
		if err != nil {
			return nil, fmt.Errorf("reading client cert: %w", err)
		}
		keyPEM, err := os.ReadFile(opts.KeyFile)
		if err != nil {
			return nil, fmt.Errorf("reading client key: %w", err)
		}
		cert, err := tls.X509KeyPair(certPEM, keyPEM)
		if err != nil {
			return nil, fmt.Errorf("loading client certificate: %w", err)
		}
		transport.TLSClientConfig.Certificates = []tls.Certificate{cert}
	}

	u, err := url.Parse(opts.URL)
	if err != nil {
		return nil, fmt.Errorf("parsing base URL: %w", err)
	}
	if !strings.HasSuffix(u.Path, "/") {
		u.Path += "/"
	}

	return &Client{
		baseURL:  u,
		username: opts.Username,
		password: opts.Password,
		httpClient: &http.Client{
			Transport: transport,
			Timeout:   30 * time.Second,
		},
	}, nil
}

// Get performs a GET request against the given path and returns the response body.
func (c *Client) Get(path string) ([]byte, error) {
	return c.do("GET", path, nil)
}

func (c *Client) do(method, path string, body io.Reader) ([]byte, error) {
	ref, err := url.Parse(strings.TrimPrefix(path, "/"))
	if err != nil {
		return nil, fmt.Errorf("parsing path: %w", err)
	}
	req, err := http.NewRequestWithContext(context.Background(), method, c.baseURL.ResolveReference(ref).String(), body)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	if c.username != "" {
		req.SetBasicAuth(c.username, c.password)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("executing request: %w", err)
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, string(data))
	}

	return data, nil
}

// GetJSON performs a GET and unmarshals the JSON response into v.
func (c *Client) GetJSON(path string, v any) error {
	data, err := c.Get(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, v)
}

// URL returns the base URL of the cluster.
func (c *Client) URL() *url.URL {
	return c.baseURL
}

// SetAuth sets the authentication credentials on a request.
func (c *Client) SetAuth(req *http.Request) {
	if c.username != "" {
		req.SetBasicAuth(c.username, c.password)
	}
}

// Do executes an HTTP request using the client's transport.
func (c *Client) Do(req *http.Request) (*http.Response, error) {
	return c.httpClient.Do(req) //nolint:gosec // URL is intentionally constructed from user-provided cluster address
}

// ClusterInfo holds the identity and version of an OpenSearch cluster.
type ClusterInfo struct {
	Name    string `json:"name"`
	Version struct {
		Number       string `json:"number"`
		Distribution string `json:"distribution"`
	} `json:"version"`
}

// WaitUntilAvailable polls the cluster root endpoint until it responds or maxWait elapses,
// then waits for cluster health to reach green or yellow.
func (c *Client) WaitUntilAvailable(maxWait time.Duration) (*ClusterInfo, error) {
	deadline := time.Now().Add(maxWait)
	var lastErr error

	for time.Now().Before(deadline) {
		var info ClusterInfo
		if err := c.GetJSON("/", &info); err != nil {
			lastErr = err
			time.Sleep(2 * time.Second)
			continue
		}

		if err := c.waitForHealth(deadline); err != nil {
			return nil, err
		}
		return &info, nil
	}

	return nil, fmt.Errorf("cluster not available after %v: %w", maxWait, lastErr)
}

func (c *Client) waitForHealth(deadline time.Time) error {
	for time.Now().Before(deadline) {
		var health struct {
			Status string `json:"status"`
		}
		if err := c.GetJSON("/_cluster/health", &health); err != nil {
			time.Sleep(2 * time.Second)
			continue
		}
		if health.Status == "green" || health.Status == "yellow" {
			return nil
		}
		time.Sleep(2 * time.Second)
	}
	return fmt.Errorf("cluster health did not reach green/yellow before deadline")
}
