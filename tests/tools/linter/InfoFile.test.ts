import InfoFile from '../../../tools/linter/components/InfoFile'

test('validate()', () => {
  const validator = new InfoFile('./tests/tools/linter/fixtures/_info.yaml')
  expect(validator.validate()).toEqual([
    {
      file: 'fixtures/_info.yaml',
      location: '$schema',
      message: 'JSON Schema is required but not found in this file.'
    }
  ])
})
