<img src="https://opensearch.org/assets/img/opensearch-logo-themed.svg" height="64px" alt="OpenSearch logo">

## OpenSearch API Specification

[![Code Covergage](https://codecov.io/github/opensearch-project/opensearch-api-specification/graph/badge.svg?token=TO9YMAKSHH)](https://codecov.io/github/opensearch-project/opensearch-api-specification)
[![Test Tools (Unit)](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/test-tools-unit.yml/badge.svg)](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/test-tools-unit.yml)
[![Test Tools (Integration)](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/test-tools-integ.yml/badge.svg)](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/test-tools-integ.yml)
[![Test Spec](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/test-spec.yml/badge.svg)](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/test-spec.yml)
[![Validate Spec](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/validate-spec.yml/badge.svg)](https://github.com/opensearch-project/opensearch-api-specification/actions/workflows/validate-spec.yml)

- [OpenSearch API Specification](#opensearch-api-specification)
- [Welcome!](#welcome)
  - [OpenSearch API Source of Truth](#opensearch-api-source-of-truth)
  - [Working in this Repo](#working-in-this-repo)
- [Project Resources](#project-resources)
- [Code of Conduct](#code-of-conduct)
- [Security](#security)
- [License](#license)
- [Copyright](#copyright)

## Welcome!

The `opensearch-api-specification` is an open source, community-driven collection of API model specifications for [OpenSearch](https://github.com/opensearch-project/OpenSearch) APIs. The API models are written in OpenAPI format and are used to generate client libraries and documentation. You can find the latest release of the API specification [here](https://github.com/opensearch-project/opensearch-api-specification/releases).

### OpenSearch API Source of Truth

This repo aims to be the complete source of truth for OpenSearch and OpenSearch Dashboards REST APIs, including plugins. To be the source of truth, this repo [accurately represents APIs in YAML](spec/), and [publishes](https://github.com/opensearch-project/opensearch-api-specification/releases) a single-file OpenAPI 3.1.0 spec. The latter is used to [generate OpenSearch language clients](https://github.com/opensearch-project/opensearch-clients/issues/19), [generate mechanical parts of the OpenSearch documentation](https://github.com/opensearch-project/documentation-website/issues/7700), and will be used to [generate the OpenSearch server API itself](https://github.com/opensearch-project/OpenSearch/issues/3090).

### Working in this Repo

Because of our legacy, the specification is produced by reading the [OpenSearch documentation](https://opensearch.org/docs/latest/) and reverse-engineering code. Thus, a good place to start contributing to this repo is to [identify a missing API and to add it](https://github.com/opensearch-project/opensearch-api-specification/issues/168) by following the [developer guide](DEVELOPER_GUIDE.md). This repo also contains a set of [test tools](TESTING_GUIDE.md) that ensure the correctness of this API and infrastructure that evaluates the gap between the OpenSearch server and this API spec by comparing REST routes registered in a running OpenSearch to the list of the APIs in this repo. You can see the latest API and test coverage numbers in the comments automatically added to any [recently merged pull requests](https://github.com/opensearch-project/opensearch-api-specification/pulls?q=is%3Apr+is%3Aclosed).

## Project Resources

* [Current Release](https://github.com/opensearch-project/opensearch-api-specification/releases/download/main-latest/opensearch-openapi.yaml)
* [Developer Guide](DEVELOPER_GUIDE.md).
* [Client Generator Guide](CLIENT_GENERATOR_GUIDE.md).
* [Spec Publishing Guide](PUBLISHING_GUIDE.md).
* [Project Website](https://opensearch.org/)
* [API Playground](https://opensearch-project.github.io/opensearch-api-specification/)
* [Downloads](https://opensearch.org/downloads.html)
* [Documentation](https://opensearch.org/docs/)
* Need help? Try [Forums](https://forum.opensearch.org/)
* [Project Principles](https://opensearch.org/#principles)
* [Contributing Guidelines](CONTRIBUTING.md)

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](CODE_OF_CONDUCT.md). For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq), or contact [opensource-codeofconduct@amazon.com](mailto:opensource-codeofconduct@amazon.com) with any additional questions or comments.

## Security

If you discover a potential security issue in this project we ask that you notify OpenSearch Security directly via email to security@opensearch.org. Please do **not** create a public GitHub issue.

## License

This project is licensed under the [Apache v2.0 License](LICENSE.txt).

## Copyright

Copyright OpenSearch Contributors. See [NOTICE](NOTICE.txt) for details.
