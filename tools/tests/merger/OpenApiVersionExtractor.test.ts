/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import OpenApiMerger from 'merger/OpenApiMerger'
import OpenApiVersionExtractor from 'merger/OpenApiVersionExtractor'
import fs from 'fs'
import tmp from 'tmp'

describe('extract() from a merged API spec', () => {
  const merger = new OpenApiMerger('tools/tests/merger/fixtures/specs/opensearch')

  describe('1.3', () => {
    const extractor = new OpenApiVersionExtractor(merger.spec(), '1.3', 'ignore')

    describe('write_to', () => {
      let temp: tmp.DirResult;
      let filename: string;

      beforeEach(() => {
        temp = tmp.dirSync()
        filename = `${temp.name}/opensearch-openapi.yaml`
      })

      afterEach(() => {
        fs.unlinkSync(filename)
        temp.removeCallback()
      })

      test('writes a spec', () => {
        extractor.write_to(filename)
        expect(fs.readFileSync('./tools/tests/merger/fixtures/extractor/opensearch/expected_1.3.yaml', 'utf8'))
          .toEqual(fs.readFileSync(filename, 'utf8'))
      })
    })

    test('has matching responses', () => {
      const spec = extractor.extract()
      expect(_.keys(spec.paths?.['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', '503', 'removed-2.0', 'removed-2.0-refs', 'added-1.3-removed-2.0', 'distributed-excluded-amazon-serverless'
      ])
    })
  })

  describe('2.0', () => {
    const extractor = new OpenApiVersionExtractor(merger.spec(), '2.0', 'ignore')

    test('has matching responses', () => {
      const spec = extractor.extract()
      expect(_.keys(spec.paths?.['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', '503', 'added-2.0', 'removed-2.0-refs', 'distributed-excluded-amazon-serverless'
      ])
    })

    describe('write_to()', () => {
      let temp: tmp.DirResult;
      let filename: string;

      beforeEach(() => {
        temp = tmp.dirSync()
        filename = `${temp.name}/opensearch-openapi.yaml`
      })

      afterEach(() => {
        fs.unlinkSync(filename)
        temp.removeCallback()
      })

      test('writes a spec', () => {
        extractor.write_to(filename)
        expect(fs.readFileSync('./tools/tests/merger/fixtures/extractor/opensearch/expected_2.0.yaml', 'utf8'))
          .toEqual(fs.readFileSync(filename, 'utf8'))
      })
    })
  })

  describe('2.1', () => {
    const extractor = new OpenApiVersionExtractor(merger.spec(), '2.1', 'oracle-managed')

    test('has matching responses', () => {
      const spec = extractor.extract()
      expect(_.keys(spec.paths?.['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', '503', 'added-2.0', 'removed-2.0-refs', 'added-2.1', 'distributed-excluded-amazon-serverless'
      ])
    })
  })
})
