ARG OPENSEARCH_DOCKER_HUB_PROJECT
ARG OPENSEARCH_VERSION
ARG OPENSEARCH_DOCKER_REF

FROM ${OPENSEARCH_DOCKER_HUB_PROJECT}/opensearch:${OPENSEARCH_VERSION}${OPENSEARCH_DOCKER_REF}
ARG OPENSEARCH_VERSION

# Download xq tool for parsing XML
RUN XQ_VERSION=1.3.0 && \
    XQ_ARCH=$([[ $(uname -p) == 'aarch64' ]] && echo 'arm64' || echo 'amd64') && \
    XQ_TAR_GZ=xq_${XQ_VERSION}_linux_${XQ_ARCH}.tar.gz && \
    curl -sSLO https://github.com/sibprogrammer/xq/releases/download/v${XQ_VERSION}/${XQ_TAR_GZ} && \
    tar -xzf ${XQ_TAR_GZ} xq && \
    rm ${XQ_TAR_GZ}

# Install snapshot version of the ingestion-fs plugin
RUN PLUGIN_NAME=ingestion-fs && \
    PLUGIN_DIR="${PWD}/plugins/${PLUGIN_NAME}" && \
    SNAPSHOT_VERSION="${OPENSEARCH_VERSION}-SNAPSHOT" && \
    MAVEN_SNAPSHOT_BASE_URL="https://ci.opensearch.org/ci/dbc/snapshots/maven/org/opensearch/plugin/${PLUGIN_NAME}/${SNAPSHOT_VERSION}" && \
    SNAPSHOT_BUILD=$(curl -s "${MAVEN_SNAPSHOT_BASE_URL}/maven-metadata.xml" | ./xq -x 'metadata/versioning/snapshotVersions/snapshotVersion[extension="jar" and not(./classifier)]/value') && \
    mkdir -p ${PLUGIN_DIR} && \
    curl -sSL -o "${PLUGIN_DIR}/${PLUGIN_NAME}-${SNAPSHOT_VERSION}.jar" "${MAVEN_SNAPSHOT_BASE_URL}/${PLUGIN_NAME}-${SNAPSHOT_BUILD}.jar" && \
    echo -e "\
name=${PLUGIN_NAME}\n\
version=${SNAPSHOT_VERSION}\n\
description=Pull-based ingestion plugin to read from local files for testing\n\
classname=org.opensearch.plugin.ingestion.fs.FilePlugin\n\
java.version=21\n\
opensearch.version=${OPENSEARCH_VERSION}\n\
custom.foldername=\n\
extended.plugins=\n\
has.native.controller=false\
" > ${PLUGIN_DIR}/plugin-descriptor.properties
