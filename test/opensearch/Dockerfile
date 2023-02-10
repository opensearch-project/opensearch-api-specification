FROM opensearchproject/opensearch:latest

USER root
RUN mkdir -p /mnt/snapshots && chown -R opensearch:opensearch /mnt/snapshots

USER opensearch
VOLUME /mnt/snapshots