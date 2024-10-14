ARG OPENSEARCH_DOCKER_HUB_PROJECT
ARG OPENSEARCH_VERSION
ARG OPENSEARCH_DOCKER_REF

FROM ${OPENSEARCH_DOCKER_HUB_PROJECT}/opensearch:${OPENSEARCH_VERSION}${OPENSEARCH_DOCKER_REF}

# when updating, get the latest/corresponding stable URL with
# curl -v https://ci.opensearch.org/ci/dbc/distribution-build-opensearch/2.18.0/latest/linux/x64/tar/builds/opensearch/core-plugins/analysis-phonenumber-2.18.0.zip
RUN ./bin/opensearch-plugin install https://ci.opensearch.org/ci/dbc/distribution-build-opensearch/2.18.0/10380/linux/x64/tar/builds/opensearch/core-plugins/analysis-phonenumber-2.18.0.zip
