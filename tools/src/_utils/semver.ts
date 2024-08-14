/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import * as semver from 'semver'

export function coerce(version?: string): undefined | string {
  if (version === undefined) return undefined
  return semver.coerce(version)?.toString() ?? version
}

export function satisfies(version: string | semver.SemVer | undefined, range: string): boolean {
  if (version === undefined || version === '') return true
  if (semver.validRange(range) == null) throw `Invalid semver ${range}.`
  return semver.satisfies(version, range)
}
