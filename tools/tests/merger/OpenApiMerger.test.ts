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
import { Logger } from '../../src/Logger'

test('merge()', () => {
  const merger = new OpenApiMerger('./tools/tests/merger/fixtures/spec/', new Logger())
  merger.merge('./tools/tests/merger/opensearch-openapi.yaml')
  expect(fs.readFileSync('./tools/tests/merger/fixtures/expected.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./tools/tests/merger/opensearch-openapi.yaml', 'utf8'))
  fs.unlinkSync('./tools/tests/merger/opensearch-openapi.yaml')
})
