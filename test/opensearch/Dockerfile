FROM opensearchproject/opensearch:2.11.1

USER root
RUN mkdir -p /mnt/snapshots && chown -R opensearch:opensearch /mnt/snapshots

USER opensearch
VOLUME /mnt/snapshots
