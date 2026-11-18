#!/usr/bin/env bash
#
# AOSS override for overlays/build-distribution-specs.sh's enrich_dist step.
#
# Amazon OpenSearch Serverless (AOSS) has no basic-auth surface -- it only
# accepts AWS SigV4-signed requests. The shared default (docs/enrich.ts with
# no flags) renders username/password samples that simply do not work against
# an AOSS collection, so this override calls the same script with
# --auth=sigv4 instead of duplicating the enrichment logic.
#
# Invoked by build-distribution-specs.sh as:
#   overlays/aoss/enrich.sh <dist> <src.yaml> <out_dir> <docs_dir>
set -euo pipefail

DIST="$1"
SRC="$2"
OUT_DIR="$3"
DOCS_DIR="$4"

REPO_ROOT="$(cd "$DOCS_DIR/.." && pwd)"
DOCS_TARGET="$OUT_DIR/opensearch-openapi-${DIST}-docs.yaml"

echo "Enriching $DIST with SigV4 client examples (AOSS has no basic-auth surface)"
(cd "$REPO_ROOT" && npm run --silent docs:enrich -- "$SRC" "$DOCS_TARGET" --auth=sigv4)
