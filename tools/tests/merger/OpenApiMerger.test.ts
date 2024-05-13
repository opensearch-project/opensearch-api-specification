import OpenApiMerger from 'merger/OpenApiMerger'
import fs from 'fs'
import { LogLevel } from '../../src/Logger'

test('merge()', async () => {
  const merger = new OpenApiMerger('./tools/tests/merger/fixtures/spec/', LogLevel.error)
  merger.merge('./tools/tests/merger/opensearch-openapi.yaml')
  expect(fs.readFileSync('./tools/tests/merger/fixtures/expected.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./tools/tests/merger/opensearch-openapi.yaml', 'utf8'))
  fs.unlinkSync('./tools/tests/merger/opensearch-openapi.yaml')
})
