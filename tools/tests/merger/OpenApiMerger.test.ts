/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import OpenApiMerger from 'merger/OpenApiMerger'
import fs from 'fs'
import tmp from 'tmp'

describe('OpenApiMerger', () => {
  var merger: OpenApiMerger

  describe('defaults', () => {
    beforeEach(() => {
      merger = new OpenApiMerger('./tools/tests/merger/fixtures/specs/animals')
    })

    describe('merge()', () => {
      test('is not required', () => {
        expect(merger.spec()).toBeDefined()
      })

      test('merges spec', () => {
        expect(merger.spec()).toBeDefined()
      })
    })

    describe('write_to()', () => {
      var temp: tmp.DirResult
      var filename: string

      beforeEach(() => {
        temp = tmp.dirSync()
        filename = `${temp.name}/opensearch-openapi.yaml`
      })

      afterEach(() => {
        fs.unlinkSync(filename)
        temp.removeCallback()
      })

      test('writes a spec', () => {
        merger.write_to(filename)
        expect(fs.readFileSync('./tools/tests/merger/fixtures/merger/animals/expected.yaml', 'utf8'))
          .toEqual(fs.readFileSync(filename, 'utf8'))
      })
    })
  })
})
