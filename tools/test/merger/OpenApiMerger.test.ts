import OpenApiMerger from '../../merger/OpenApiMerger'
import fs from 'fs'

test('merge()', async () => {
  const merger = new OpenApiMerger('./test/merger/fixtures/spec/opensearch-openapi.yaml')
  merger.merge('./test/merger/opensearch-openapi.yaml')
  expect(fs.readFileSync('./test/merger/fixtures/expected.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./test/merger/opensearch-openapi.yaml', 'utf8'))
  fs.unlinkSync('./test/merger/opensearch-openapi.yaml')
})
