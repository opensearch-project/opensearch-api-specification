import { schema } from './factories/schema'

test('validate_name()', () => {
  expect(schema('invalid_name').validate_name()).toEqual({
    file: '_common.yaml',
    location: '#/components/schemas/invalid_name',
    message: "Invalid schema name 'invalid_name'. Only alphanumeric characters are allowed."
  })
  expect(schema('Invalid.Name').validate_name()).toBeDefined()

  expect(schema('ValidName1').validate_name()).toBeUndefined()
  expect(schema('Valid1Name').validate_name()).toBeUndefined()
  expect(schema('uint').validate_name()).toBeUndefined()
})
