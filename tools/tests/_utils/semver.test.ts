/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import * as semver from "../../src/_utils/semver";

describe('coerce', () => {
  it ('null', () => {
    expect(semver.coerce('')).toEqual('')
    expect(semver.coerce('1.2.3')).toEqual('1.2.3')
    expect(semver.coerce('1.2')).toEqual('1.2.0')
    expect(semver.coerce('1')).toEqual('1.0.0')
  })
});

describe('satisfies', () => {
  it ('defaults', () => {
    expect(semver.satisfies('', '>= 1.3 < 99.0')).toBe(true)
  })

  it ('semver', () => {
    expect(semver.satisfies(semver.coerce('2.17.0'), '>= 1.3 < 99.0')).toBe(true)
  })

  it ('~', () => {
    expect(semver.satisfies('2.17.0', '~> 2.x')).toBe(true)
    expect(semver.satisfies('2.17.0', '~> 2.17.0')).toBe(true)
    expect(semver.satisfies('2.17.0', '~> 1.x')).toBe(false)
    expect(semver.satisfies('2.17.0', '~> 2.17.0')).toBe(true)
    expect(semver.satisfies('2.17.0', '~> 2.18')).toBe(false)
  })

  it ('> <', () => {
    expect(semver.satisfies('2.17.0', '> 2.999.0')).toBe(false)
    expect(semver.satisfies('2.17.0', '< 3.0')).toBe(true)
    expect(semver.satisfies('2.17.0', '>= 1.3 < 99.0')).toBe(true)
  })

  it ('ranges', () => {
    expect(semver.satisfies('2.17.0', '>= 1.3 < 99.0')).toBe(true)
  })

  it ('invalid', () => {
    expect(() => { semver.satisfies('1.2.3', '>= 1, < 2') }).toThrow('Invalid semver >= 1, < 2.')
  })
});
