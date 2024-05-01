import SupersededOperationsFile from '../../linter/components/SupersededOperationsFile'

test('validate()', () => {
  const validator = new SupersededOperationsFile('./test/linter/fixtures/_superseded_operations.yaml')
  expect(validator.validate()).toEqual([
    {
      file: 'fixtures/_superseded_operations.yaml',
      message: "File content does not match JSON schema found in '../json_schemas/_superseded_operations.yaml':\n [\n  {\n    \"instancePath\": \"/~1hello~1world/operations/1\",\n    \"schemaPath\": \"#/patternProperties/%5E~1/properties/operations/items/enum\",\n    \"keyword\": \"enum\",\n    \"params\": {\n      \"allowedValues\": [\n        \"GET\",\n        \"POST\",\n        \"PUT\",\n        \"DELETE\",\n        \"HEAD\",\n        \"OPTIONS\",\n        \"PATCH\"\n      ]\n    },\n    \"message\": \"must be equal to one of the allowed values\"\n  }\n]"
    }
  ])
})
