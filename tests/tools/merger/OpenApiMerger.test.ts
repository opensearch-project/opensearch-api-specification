import OpenApiMerger from '../../../tools/merger/OpenApiMerger'
import fs from 'fs'

test('merge()', async () => {
  const merger = new OpenApiMerger('./tests/tools/merger/fixtures/spec/')
  merger.merge('./tests/tools/merger/opensearch-openapi.yaml')
  expect(fs.readFileSync('./tests/tools/merger/fixtures/expected.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./tests/tools/merger/opensearch-openapi.yaml', 'utf8'))
  fs.unlinkSync('./tests/tools/merger/opensearch-openapi.yaml')
})
