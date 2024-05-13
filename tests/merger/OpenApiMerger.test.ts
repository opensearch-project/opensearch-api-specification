import OpenApiMerger from 'merger/OpenApiMerger'
import fs from 'fs'

test('merge()', async () => {
  const merger = new OpenApiMerger('./tests/merger/fixtures/spec/')
  merger.merge('./tests/merger/opensearch-openapi.yaml')
  expect(fs.readFileSync('./tests/merger/fixtures/expected.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./tests/merger/opensearch-openapi.yaml', 'utf8'))
  fs.unlinkSync('./tests/merger/opensearch-openapi.yaml')
})
