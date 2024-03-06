ARG OPENSEARCH_VERSION=2.12.0
FROM opensearchproject/opensearch:${OPENSEARCH_VERSION}
ARG OPENSEARCH_VERSION
RUN /usr/share/opensearch/bin/opensearch-plugin \
    install \
    --batch \
    https://github.com/dblock/opensearch-api/releases/download/v${OPENSEARCH_VERSION}/opensearch-api-${OPENSEARCH_VERSION}.0.zip
