# Build the opensearch-api plugin from vendored source (coverage/opensearch-api-plugin)
# against the target OpenSearch version, then install it into the matching image.
#
# The plugin (originally github.com/dblock/opensearch-api) is vendored here rather
# than downloaded as a release asset: upstream publishes only a 2.12.0 release, so
# building from source is the only way to track current OpenSearch (3.x) lines.
ARG OPENSEARCH_VERSION=3.8.0

# --- Stage 1: build the plugin zip -------------------------------------------
FROM eclipse-temurin:21-jdk AS plugin-builder
ARG OPENSEARCH_VERSION
WORKDIR /plugin
COPY opensearch-api-plugin/ ./
# Produce a release (non-SNAPSHOT) build pinned to the target OpenSearch version.
# Output: build/distributions/opensearch-api-${OPENSEARCH_VERSION}.0.zip
RUN ./gradlew --no-daemon \
    -Dopensearch.version=${OPENSEARCH_VERSION} \
    -Dbuild.snapshot=false \
    assemble

# --- Stage 2: install the plugin into OpenSearch -----------------------------
FROM opensearchproject/opensearch:${OPENSEARCH_VERSION}
ARG OPENSEARCH_VERSION
COPY --from=plugin-builder \
    /plugin/build/distributions/opensearch-api-${OPENSEARCH_VERSION}.0.zip \
    /tmp/opensearch-api.zip
# The OpenSearch image runs as a non-root user that cannot delete the root-owned
# COPY'd zip, so no cleanup rm here; this throwaway coverage image is discarded
# after the API dump.
RUN /usr/share/opensearch/bin/opensearch-plugin install --batch file:///tmp/opensearch-api.zip
