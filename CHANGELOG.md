# CHANGELOG

Inspired from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]

### Added

- Added CHANGELOG ([#309](https://github.com/opensearch-project/opensearch-api-specification/pull/309))
- Added a spec test framework ([#299](https://github.com/opensearch-project/opensearch-api-specification/pull/299))
- Added tests for the framework ([#310](https://github.com/opensearch-project/opensearch-api-specification/pull/310))
- Added workflow to determine API changes ([#297](https://github.com/opensearch-project/opensearch-api-specification/pull/297))
- Added link checking ([#269](https://github.com/opensearch-project/opensearch-api-specification/pull/269))
- Added API coverage ([#210](https://github.com/opensearch-project/opensearch-api-specification/pull/210))
- Added license headers to TypeScript code ([#311](https://github.com/opensearch-project/opensearch-api-specification/pull/311))
- Added `npm run test:spec -- --dry-run --verbose` ([#303](https://github.com/opensearch-project/opensearch-api-specification/pull/303))
- Added `npm run test:unit` and `test:integ` ([#320](https://github.com/opensearch-project/opensearch-api-specification/pull/320))
- Added code coverage to tools' tests ([#323](https://github.com/opensearch-project/opensearch-api-specification/pull/323))
- Added a YAML linter ([#312](https://github.com/opensearch-project/opensearch-api-specification/pull/312))
- Added linter to validate order of spec operations ([#325](https://github.com/opensearch-project/opensearch-api-specification/pull/326)) ([#326](https://github.com/opensearch-project/opensearch-api-specification/pull/326))
- Added support to read outputs from requests in tests([#324](https://github.com/opensearch-project/opensearch-api-specification/pull/324))
- Added `eslint-plugin-eslint-comments` ([#333](https://github.com/opensearch-project/opensearch-api-specification/pull/333))
- Added `distribution` field to `OpenSearchVersionInfo` ([#336](https://github.com/opensearch-project/opensearch-api-specification/pull/336)) 
- Added `created_time` and `last_updated_time` to `ml.get_model_group@200` ([#342](https://github.com/opensearch-project/opensearch-api-specification/pull/342))
- Added spellcheck linter ([#341](https://github.com/opensearch-project/opensearch-api-specification/pull/341))
- Added tests for response payload ([#347](https://github.com/opensearch-project/opensearch-api-specification/pull/347))

### Changed

- Replaced Smithy with a native OpenAPI spec ([#189](https://github.com/opensearch-project/opensearch-api-specification/issues/189))
- Refactored spec tester internals to improve reusability ([#302](https://github.com/opensearch-project/opensearch-api-specification/pull/302))
- Renamed `main` release tag to `main-latest` ([#321](https://github.com/opensearch-project/opensearch-api-specification/pull/321))
- Replaced usages of `Opensearch` with `OpenSearch` ([#335](https://github.com/opensearch-project/opensearch-api-specification/pull/335))

### Deprecated

### Removed

### Fixed

- Fixed GitHub pages ([#215](https://github.com/opensearch-project/opensearch-api-specification/pull/215))
- Fixed missing 201 response in `/{index}/_doc/{id}` ([#331](https://github.com/opensearch-project/opensearch-api-specification/pull/331))
- Fixed `SlowlogThresholds` ([#341](https://github.com/opensearch-project/opensearch-api-specification/pull/341))
- Fixed `from_address` in notifications ([#341](https://github.com/opensearch-project/opensearch-api-specification/pull/341))
- Fixed `pages_processed` in rollups ([#341](https://github.com/opensearch-project/opensearch-api-specification/pull/341))

### Security

[Unreleased]: https://github.com/opensearch-project/opensearch-api-specification/commits/main/
