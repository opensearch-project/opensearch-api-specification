import OpenApiMerger from 'merger/OpenApiMerger'
import fs from 'fs'

test('merge()', async () => {
  const merger = new OpenApiMerger('./tools/tests/merger/fixtures/spec/')
  merger.merge('./tools/tests/merger/opensearch-openapi.yaml')
  expect(fs.readFileSync('./tools/tests/merger/fixtures/expected.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./tools/tests/merger/opensearch-openapi.yaml', 'utf8'))
  fs.unlinkSync('./tools/tests/merger/opensearch-openapi.yaml')
})

test('merge(x-xyz)', async () => {
  const merger = new OpenApiMerger('./test/merger/fixtures/spec/', { x_include: ['x-xyz'] })
  merger.merge('./test/merger/opensearch-openapi-x-xyz.yaml')
  expect(fs.readFileSync('./test/merger/opensearch-openapi-x-xyz.yaml', 'utf8'))
    .toEqual(fs.readFileSync('./test/merger/fixtures/expected-x-xyz.yaml', 'utf8'))
  fs.unlinkSync('./test/merger/opensearch-openapi-x-xyz.yaml')
})
