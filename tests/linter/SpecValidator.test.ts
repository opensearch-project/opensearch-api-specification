import SpecValidator from 'linter/SpecValidator'

test('validate()', () => {
  const validator = new SpecValidator('./tests/linter/fixtures/empty')
  expect(validator.validate()).toEqual([])

  validator.namespaces_folder.validate = jest.fn().mockReturnValue([{ file: 'namespaces/', message: 'namespace error' }])
  validator.schemas_folder.validate = jest.fn().mockReturnValue([{ file: 'schemas/', message: 'schema error' }])
  validator.schema_refs_validator.validate = jest.fn().mockReturnValue([{ file: 'schema_refs', message: 'schema refs error' }])

  expect(validator.validate()).toEqual([
    { file: 'namespaces/', message: 'namespace error' },
    { file: 'schemas/', message: 'schema error' }
  ])

  validator.namespaces_folder.validate = jest.fn().mockReturnValue([])
  validator.schemas_folder.validate = jest.fn().mockReturnValue([])

  expect(validator.validate()).toEqual([
    { file: 'schema_refs', message: 'schema refs error' }
  ])
})
