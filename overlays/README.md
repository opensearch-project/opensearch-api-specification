# OpenAPI Overlays

This directory contains [OpenAPI Overlay](https://spec.openapis.org/overlay/latest.html) files that describe distribution-specific API surface differences. Each distribution has its own subfolder listing the operations it does not offer (and any operations it adds).

## What are Overlays?

The [OpenAPI Overlay Specification](https://spec.openapis.org/overlay/latest.html) is an official companion spec from the OpenAPI Initiative. It defines a document format for information that augments an existing OpenAPI description yet remains separate from it. An Overlay contains an ordered list of actions (using RFC 9535 JSONPath targeting) that `update` or `remove` elements in a target OpenAPI document.

## Layout

Overlays are grouped per distribution. Within a folder they are applied **in filename order**, so a numeric prefix fixes the order:

| File pattern | Role |
|---|---|
| `0-*-block.overlay.yaml` | The API-surface filter — removes the paths/methods the distribution does not expose. Applied **first**. |
| `1-*-extensions.overlay.yaml` | Distribution-specific additions and schema tweaks (new paths, added/removed fields). Applied **after** the block. |

```
overlays/
├── aos/
│   ├── 0-amazon-managed-block.overlay.yaml   # AOS API-surface filter
│   └── 1-aos-extensions.overlay.yaml         # AOS-only endpoints (UltraWarm, Cold tier, ...)
└── aoss/
    ├── 0-amazon-serverless-block.overlay.yaml  # AOSS API-surface filter
    └── 1-aoss-extensions.overlay.yaml          # AOSS additions + schema tweaks
```

## Distribution specs

Applying the overlays produces two per-distribution specs (the merged base
`build/opensearch-openapi.yaml` is itself the OSS spec):

| Spec | Source |
|---|---|
| `build/opensearch-openapi-aos.yaml` | Base + `overlays/aos/` (block, then extensions). |
| `build/opensearch-openapi-aoss.yaml` | Base + `overlays/aoss/` (block, then extensions). |

## CI Validation

The `validate-overlays` workflow runs on every pull request. It:

1. Merges the spec (`npm run merge`).
2. Runs `overlays/build-distribution-specs.sh`, which for each `overlays/<dist>/` folder applies its overlays in filename order (`0-*-block`, then `1-*-extensions`) **one overlay at a time** with the [speakeasy overlay CLI](https://github.com/speakeasy-api/speakeasy), producing `build/opensearch-openapi-<dist>.yaml`.
3. Validates the specs are valid OpenAPI documents.

This catches overlay targets that reference renamed or removed paths.

## Usage

### Producing the distribution specs locally

```bash
npm run merge                          # build build/opensearch-openapi.yaml
overlays/build-distribution-specs.sh      # -> build/opensearch-openapi-{oss,aos,aoss}.yaml
```

`overlays/build-distribution-specs.sh` is the canonical build — the CI workflow
calls the same script, so the two cannot drift. It takes optional
`BASE_SPEC OUT_DIR OVERLAYS_DIR` arguments (defaults
`build/opensearch-openapi.yaml build overlays`). Under the hood it applies each
folder's overlays one at a time, e.g. for AOS:

```bash
speakeasy overlay apply \
  --schema build/opensearch-openapi.yaml \
  --overlay overlays/aos/0-amazon-managed-block.overlay.yaml \
  > build/_aos-blocked.yaml
speakeasy overlay apply \
  --schema build/_aos-blocked.yaml \
  --overlay overlays/aos/1-aos-extensions.overlay.yaml \
  > build/opensearch-openapi-aos.yaml
```

Install the speakeasy CLI (prebuilt binary, no Go required) from
https://github.com/speakeasy-api/speakeasy/releases — download the archive for
your platform and put the `speakeasy` binary on your `PATH`. CI pins a specific
release (see `.github/workflows/validate-overlays.yml`).

## Adding Your Distribution's Overlay

If you maintain an OpenSearch distribution with a different API surface:

1. Create `overlays/<your-distribution>/0-<your-distribution>-block.overlay.yaml`.
2. List the operations to remove using JSONPath targets:
   - `$.paths['/<path>']` removes an entire path (all methods)
   - `$.paths['/<path>'].<method>` removes a single method
3. Optionally add a `1-<your-distribution>-extensions.overlay.yaml` for paths or fields your distribution adds.
4. Submit a pull request — CI will validate the overlays automatically.

## Overlay Format

```yaml
overlay: 1.0.0
info:
  title: <Distribution Name> - API Surface Overlay
  version: YYYY.MM.DD
actions:
  - target: "$.paths['/_plugins/_security/authinfo']"
    remove: true
  - target: "$.paths['/_settings'].get"
    remove: true
```

## Background

This approach was proposed in [#1183](https://github.com/opensearch-project/opensearch-api-specification/issues/1183) to replace the inline `x-distributions-excluded` annotations with a standard, scalable mechanism. See the issue for full rationale and migration plan.
