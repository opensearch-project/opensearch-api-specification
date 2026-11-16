#!/usr/bin/env bash
#
# Build the per-distribution OpenAPI specs from the merged base + overlays.
#
# Produces, under the output dir (default: build/):
#   opensearch-openapi-<dist>.yaml       for each <overlays>/<dist>/ subfolder
#   opensearch-openapi-<dist>-docs.yaml  the Scalar render target for every
#     distribution incl. oss (YAML/JSON-in + inject client examples via
#     docs/enrich.ts, output kept as YAML -- Scalar's `sources[].url` loads
#     either JSON or YAML directly)
# The merged base opensearch-openapi.yaml is itself the OSS spec, so no separate
# OSS .yaml copy is produced (but oss IS enriched into a -docs.yaml).
#
# Discovers distributions by scanning for immediate subfolders of the overlays
# directory, so adding a new overlays/<dist>/ folder needs no change here.
# Within a distribution folder, overlays are applied one at a time in filename
# order, so the numeric prefix fixes the order: 0-*-block (the API-surface
# filter) first, then 1-*-extensions (additions).
#
# Prerequisites: the merged base spec must already exist (run `npm run merge`),
# and node deps installed (`npm ci`).
#
# Usage:
#   overlays/build-distribution-specs.sh [BASE_SPEC] [OUT_DIR] [OVERLAYS_DIR]
# Defaults (resolved relative to the repo root, so it runs from any CWD):
#   BASE_SPEC=<repo>/build/opensearch-openapi.yaml
#   OUT_DIR=<repo>/build
#   OVERLAYS_DIR=<this script's own directory>
set -euo pipefail

# This script lives in the overlays directory; the repo root is its parent.
OVERLAYS_DEFAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$OVERLAYS_DEFAULT")"

BASE_SPEC="${1:-$REPO_ROOT/build/opensearch-openapi.yaml}"
OUT_DIR="${2:-$REPO_ROOT/build}"
OVERLAYS_DIR="${3:-$OVERLAYS_DEFAULT}"

if [ ! -f "$BASE_SPEC" ]; then
  echo "error: base spec not found: $BASE_SPEC (run 'npm run merge' first)" >&2
  exit 1
fi
# Use the openapi-overlaykit CLI from node_modules (no global install needed).
OVERLAYKIT="$REPO_ROOT/node_modules/.bin/openapi-overlaykit"
if [ ! -x "$OVERLAYKIT" ]; then
  echo "error: openapi-overlaykit not found at $OVERLAYKIT (run 'npm ci')" >&2
  exit 1
fi
mkdir -p "$OUT_DIR"

# Docs enricher dir (docs/ next to the repo root).
DOCS_DIR="$REPO_ROOT/docs"

# Turn a distribution YAML into the Scalar render target
# ($OUT_DIR/opensearch-openapi-<dist>-docs.yaml).
#
# Default enrichment: docs/enrich.ts (parses YAML/JSON in, injects
# x-codeSamples, writes YAML out since the target ends in .yaml).
# A distribution can OVERRIDE this by providing overlays/<dist>/enrich.sh; when
# present it is invoked instead with: <dist> <src.yaml> <out_dir> <docs_dir>,
# and is responsible for writing opensearch-openapi-<dist>-docs.yaml. Use this
# only when a distribution genuinely needs different processing (e.g. AOSS
# SigV4 client examples); otherwise the shared default keeps zero duplication.
enrich_dist() {
  local dist="$1" src="$2"
  local override="$OVERLAYS_DIR/$dist/enrich.sh"
  if [ -f "$override" ]; then
    echo "Enriching $dist via override: $override"
    bash "$override" "$dist" "$src" "$OUT_DIR" "$DOCS_DIR"
    return
  fi
  local docs_target="$OUT_DIR/opensearch-openapi-${dist}-docs.yaml"
  (cd "$REPO_ROOT" && npm run --silent docs:enrich -- "$src" "$docs_target")
}

# Remove any prior distribution outputs so a later wildcard picks up only what
# this run produces (the merged base opensearch-openapi.yaml has no suffix and
# is left untouched).
rm -f "$OUT_DIR"/opensearch-openapi-*.yaml

# OSS is the merged base itself (no overlay folder): enrich it directly.
enrich_dist "oss" "$BASE_SPEC"

for dist_dir in "$OVERLAYS_DIR"/*/; do
  [ -d "$dist_dir" ] || continue
  dist="$(basename "$dist_dir")"
  cur="$BASE_SPEC"
  for ov in $(ls "${dist_dir}"*.overlay.yaml 2>/dev/null | sort); do
    echo "Applying overlay: $ov"
    tmp="$(mktemp)"
    # single quotes + no line wrapping keeps the YAML style stable (and close to
    # the previously published artifacts); content is unaffected either way.
    "$OVERLAYKIT" --openapi "$cur" --overlay "$ov" --output "$tmp" --format yaml \
      --yaml-quote single --yaml-line-width 0
    cur="$tmp"
  done
  cp "$cur" "$OUT_DIR/opensearch-openapi-${dist}.yaml"
  # mktemp files are mode 0600 and cp keeps that, which breaks the Pages tar
  # step ("Permission denied"). Make the published spec world-readable.
  chmod 0644 "$OUT_DIR/opensearch-openapi-${dist}.yaml"
  echo "  -> $OUT_DIR/opensearch-openapi-${dist}.yaml"
  enrich_dist "$dist" "$OUT_DIR/opensearch-openapi-${dist}.yaml"
done
