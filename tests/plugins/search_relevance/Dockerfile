ARG OPENSEARCH_DOCKER_HUB_PROJECT
ARG OPENSEARCH_VERSION
ARG OPENSEARCH_DOCKER_REF

FROM ${OPENSEARCH_DOCKER_HUB_PROJECT}/opensearch:${OPENSEARCH_VERSION}${OPENSEARCH_DOCKER_REF}

ADD --chmod=444 https://o19s-public-datasets.s3.amazonaws.com/opensearch-search-relevance-3.1.0.0-SNAPSHOT.zip  /tmp/opensearch-search-relevance-3.1.0.0-SNAPSHOT.zip
RUN /usr/share/opensearch/bin/opensearch-plugin install --batch file:/tmp/opensearch-search-relevance-3.1.0.0-SNAPSHOT.zip
