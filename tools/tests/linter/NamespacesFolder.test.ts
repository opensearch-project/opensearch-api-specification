import NamespacesFolder from 'linter/components/NamespacesFolder'

test('validate() - When there invalid files', () => {
  const validator = new NamespacesFolder('./tools/tests/linter/fixtures/folder_validators/namespaces/invalid_files')
  expect(validator.validate()).toEqual([
    {
      file: 'invalid_files/indices.txt',
      location: 'File Extension',
      message: "Invalid file extension. Only '.yaml' files are allowed."
    },
    {
      file: 'invalid_files/invalid_spec.yaml',
      location: 'Operation: GET /{index}/_doc/{id}',
      message: 'Missing description property.'
    },
    {
      file: 'invalid_files/invalid_spec.yaml',
      location: 'Operation: GET /{index}/_doc/{id}',
      message: "Every parameter must be a reference object to '#/components/parameters/{x-operation-group}::{path|query}.{parameter_name}'."
    },
    {
      file: 'invalid_files/invalid_spec.yaml',
      location: 'Operation: GET /{index}/_doc/{id}',
      message: 'Path parameters must match the parameters in the path: {id}, {index}.'
    },
    {
      file: 'invalid_files/invalid_spec.yaml',
      location: 'Operation: GET /{index}/_doc/{id}',
      message: "The 200 response must be a reference object to '#/components/responses/invalid_spec.fetch@200'."
    },
    {
      file: 'invalid_files/invalid_yaml.yaml',
      location: 'File Content',
      message: 'Unable to read or parse YAML.'
    }
  ])
})

test('validate() - When the files are valid but the folder is not', () => {
  const validator = new NamespacesFolder('./tools/tests/linter/fixtures/folder_validators/namespaces/invalid_folder')
  expect(validator.validate()).toEqual([
    {
      file: 'invalid_folder/',
      location: 'Folder',
      message: "Duplicate path '/{index}' found in namespaces: dup_path_a, dup_path_c."
    },
    {
      file: 'invalid_folder/',
      location: 'Folder',
      message: "Duplicate path '/{index}/_rollover' found in namespaces: dup_path_a, dup_path_b, dup_path_c."
    }
  ])
})
