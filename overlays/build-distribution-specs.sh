#!/usr/bin/env bash
#
# Build the per-distribution OpenAPI specs from the merged base + overlays.
#
# Produces, under the output dir (default: build/):
#   opensearch-openapi-<dist>.yaml for each <overlays>/<dist>/ subfolder
# The merged base opensearch-openapi.yaml is itself the OSS spec, so no separate
# OSS copy is produced.
#
# Discovers distributions by scanning for immediate subfolders of the overlays
# directory, so adding a new overlays/<dist>/ folder needs no change here.
# Within a distribution folder, overlays are applied one at a time in filename
# order, so the numeric prefix fixes the order: 0-*-block (the API-surface
# filter) first, then 1-*-extensions (additions).
#
# Prerequisites: the merged base spec must already exist (run `npm run merge`),
# and the `speakeasy` CLI must be on PATH.
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
if ! command -v speakeasy >/dev/null 2>&1; then
  echo "error: speakeasy CLI not found on PATH" >&2
  exit 1
fi
mkdir -p "$OUT_DIR"

# Remove any prior distribution outputs so a later wildcard picks up only what
# this run produces (the merged base opensearch-openapi.yaml has no suffix and
# is left untouched).
rm -f "$OUT_DIR"/opensearch-openapi-*.yaml

for dist_dir in "$OVERLAYS_DIR"/*/; do
  [ -d "$dist_dir" ] || continue
  dist="$(basename "$dist_dir")"
  cur="$BASE_SPEC"
  for ov in $(ls "${dist_dir}"*.overlay.yaml 2>/dev/null | sort); do
    echo "Applying overlay: $ov"
    tmp="$(mktemp)"
    speakeasy overlay apply --schema "$cur" --overlay "$ov" > "$tmp"
    cur="$tmp"
  done
  cp "$cur" "$OUT_DIR/opensearch-openapi-${dist}.yaml"
  echo "  -> $OUT_DIR/opensearch-openapi-${dist}.yaml"
done
