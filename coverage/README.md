### API Coverage

Builds the OpenAPI spec, and uses the vendored `opensearch-api` plugin (in
[`opensearch-api-plugin/`](./opensearch-api-plugin), originally from
[dblock/opensearch-api](https://github.com/dblock/opensearch-api)) together with
this repo's [coverage tool](../DEVELOPER_GUIDE.md#coverage) to show the
differences between the live cluster's REST API and the specification.

The [`Dockerfile`](./Dockerfile) is a two-stage build: it compiles the vendored
plugin from source against the target OpenSearch version and installs it into the
matching `opensearchproject/opensearch` image. The plugin exposes `GET
/_plugins/api`, which the `dump-cluster-spec` tool calls to obtain the cluster's
actual API surface.

The plugin is vendored (rather than downloaded as a release asset) because
upstream publishes only a `2.12.0` release; building from source is the only way
to track current OpenSearch (3.x) lines.

#### Bumping the OpenSearch version

Set the `OPENSEARCH_VERSION` build arg in [`Dockerfile`](./Dockerfile) (default
`3.8.0`). Both build stages consume it: stage 1 passes it to Gradle as
`-Dopensearch.version`, and stage 2 uses it as the base image tag. No plugin
source change is normally required.

API coverage is run on all pull requests via the [Analyze PR Changes workflow](../.github/workflows/analyze-pr-changes.yml).
