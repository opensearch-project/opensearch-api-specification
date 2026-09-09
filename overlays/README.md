# OpenAPI Overlays

This directory contains [OpenAPI Overlay](https://spec.openapis.org/overlay/latest.html) files that describe distribution-specific API surface differences. Each file targets a specific OpenSearch distribution and lists the operations that are not available on that distribution.

## What are Overlays?

The [OpenAPI Overlay Specification](https://spec.openapis.org/overlay/latest.html) is an official companion spec from the OpenAPI Initiative. It defines a document format for information that augments an existing OpenAPI description yet remains separate from it. An Overlay contains an ordered list of actions (using RFC 9535 JSONPath targeting) that `update` or `remove` elements in a target OpenAPI document.

## Files

| File | Distribution | Description |
|------|-------------|-------------|
| `amazon-managed.overlay.yaml` | Amazon OpenSearch Service | Operations excluded from managed AOS domains |
| `amazon-serverless.overlay.yaml` | Amazon OpenSearch Serverless | Operations excluded from AOSS collections |

## CI Validation

The `validate-overlays` workflow runs on every pull request. It:

1. Merges the spec (`npm run merge`)
2. Applies each overlay using the [speakeasy overlay CLI](https://github.com/speakeasy-api/speakeasy)
3. Validates each filtered spec is a valid OpenAPI document

This catches overlay targets that reference renamed or removed paths.

## Usage

### Producing a distribution-filtered spec locally

```bash
npm run merge

speakeasy overlay apply \
  --schema build/opensearch-openapi.yaml \
  --overlay overlays/amazon-managed.overlay.yaml \
  > build/opensearch-openapi-amazon-managed.yaml
```

Install the speakeasy CLI (prebuilt binary, no Go required) from
https://github.com/speakeasy-api/speakeasy/releases — download the archive for
your platform and put the `speakeasy` binary on your `PATH`. CI pins a specific
release (see `.github/workflows/validate-overlays.yml`).

## Adding Your Distribution's Overlay

If you maintain an OpenSearch distribution with a different API surface:

1. Create `overlays/<your-distribution>.overlay.yaml`
2. Use the existing files as a template
3. List the operations to remove using JSONPath targets:
   - `$.paths['/<path>']` removes an entire path (all methods)
   - `$.paths['/<path>'].<method>` removes a single method
4. Submit a pull request — CI will validate the overlay automatically

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
