- [Overview](#overview)
- [Branching](#branching)
  - [Release Branching](#release-branching)
  - [Feature Branches](#feature-branches)
- [Release Labels](#release-labels)
- [Releasing](#releasing)

## Overview

This document explains the release strategy for opensearch-api-specification.

## Versioning

At this time this project follows minor semantic versioning, i.e. a breaking change is an increment from 0.1.0 to 0.2.0 and a non-breaking change is an increment from 0.1.0 to 0.1.1. A version 1.0 of the API specification will be released when the spec is known to be complete against any current version of OpenSearch.

## Branching

Given the early release stages of this repo we only maintain a **main** branch where all merges take place and code moves fast.

# Releasing

A release can be done by any [maintainer](MAINTAINERS.md).

1. Check out the [upstream repo](https://github.com/opensearch-project/opensearch-api-specification) and ensure the repo is up-to-date with `git pull origin main` and that you do not have any local changes.
2. Create a tag, e.g. `git tag v0.1.0`, and push it to GitHub with `git push origin --tags`.
3. The [release workflow](.github/workflows/release.yml) will be automatically kicked off, a draft release, and a pull request that increments the version in [spec/_info.yaml](spec/_info.yaml) will be created.
4. Verify and release the draft.
5. Approve, and merge the version increment pull request.
