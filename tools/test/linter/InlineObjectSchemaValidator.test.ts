import SchemasFolder from '../../linter/components/SchemasFolder'
import NamespacesFolder from '../../linter/components/NamespacesFolder'
import InlineObjectSchemaValidator from '../../linter/InlineObjectSchemaValidator'

test('validate()', () => {
  const root_folder = './test/linter/fixtures/inline_object_schema_validator'
  const namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`)
  const schemas_folder = new SchemasFolder(`${root_folder}/schemas`)
  const validator = new InlineObjectSchemaValidator(namespaces_folder, schemas_folder)
  expect(validator.validate()).toEqual([
    {
      file: 'namespaces/ops.yaml',
      location: '#/paths/~1the~1path/post/parameters/3/schema',
      message: 'object schemas should be defined out-of-line via a $ref'
    },
    {
      file: 'namespaces/ops.yaml',
      location: '#/paths/~1the~1path/post/requestBody/content/application~1json/schema/items',
      message: 'object schemas should be defined out-of-line via a $ref'
    },
    {
      file: 'namespaces/ops.yaml',
      location: '#/paths/~1the~1path/post/responses/200/content/application~1json/schema/properties/inline_object_as_a_property_is_not_ok',
      message: 'object schemas should be defined out-of-line via a $ref'
    },
    {
      file: 'schemas/schemas.yaml',
      location: '#/components/schemas/additionalProperties_with_object_value_schema_can_not_be_inline/additionalProperties',
      message: 'object schemas should be defined out-of-line via a $ref'
    }
  ])
})
