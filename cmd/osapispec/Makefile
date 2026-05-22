BINARY := osapispec
GOFLAGS ?=
GOLANGCI_LINT_VERSION := v2.1.6

.PHONY: build test lint lint.local clean

build:  ## Build the osapispec binary
	go build $(GOFLAGS) -o $(BINARY) .

test:  ## Run all tests
	go test ./... -count=1

lint.local:  ## Run golangci-lint locally
	golangci-lint run --timeout=5m ./...

lint: lint.local  ## Alias for lint.local

lint.fix:  ## Run golangci-lint with auto-fix
	golangci-lint run --fix --timeout=5m ./...

clean:  ## Remove build artifacts
	rm -f $(BINARY)

help:  ## Display help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_][a-zA-Z0-9._-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
