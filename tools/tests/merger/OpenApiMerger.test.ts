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

describe('OpenApiMerger', () => {
  var merger: OpenApiMerger

  describe('defaults', () => {
    beforeEach(() => {
      merger = new OpenApiMerger('./tools/tests/merger/fixtures/spec/')
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
      afterAll(() => {
        fs.unlinkSync('./tools/tests/merger/opensearch-openapi.yaml')
      })

      test('writes a spec', () => {
        merger.write_to('./tools/tests/merger/opensearch-openapi.yaml')
        expect(fs.readFileSync('./tools/tests/merger/fixtures/expected_2.0.yaml', 'utf8'))
          .toEqual(fs.readFileSync('./tools/tests/merger/opensearch-openapi.yaml', 'utf8'))
      })
    })
  })

  describe('1.3', () => {
    beforeEach(() => {
      merger = new OpenApiMerger('./tools/tests/merger/fixtures/spec/', '1.3')
    })

    test('writes a spec', () => {
      merger.write_to('./tools/tests/merger/opensearch-openapi.yaml')
      expect(fs.readFileSync('./tools/tests/merger/fixtures/expected_1.3.yaml', 'utf8'))
        .toEqual(fs.readFileSync('./tools/tests/merger/opensearch-openapi.yaml', 'utf8'))
    })
  })
})
