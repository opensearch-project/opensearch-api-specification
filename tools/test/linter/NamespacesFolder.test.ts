import NamespacesFolder from "../../linter/components/NamespacesFolder";

test('validate()', () => {
  const validator = new NamespacesFolder('./test/linter/fixtures/folder_validators/namespaces');
  expect(validator.validate()).toEqual([
    {
      file: "namespaces/indices.txt",
      location: "File Extension",
      message: "Invalid file extension. Only '.yaml' files are allowed."
    },
    {
      file: "namespaces/invalid_spec.yaml",
      location: "Operation: GET /{index}/_doc/{id}",
      message: "Missing description property."
    },
    {
      file: "namespaces/invalid_spec.yaml",
      location: "Operation: GET /{index}/_doc/{id}",
      message: "Every parameter must be a reference object to '#/components/parameters/{x-operation-group}::{path|query}.{parameter_name}'."
    },
    {
      file: "namespaces/invalid_spec.yaml",
      location: "Operation: GET /{index}/_doc/{id}",
      message: "Path parameters must match the parameters in the path: {id}, {index}."
    },
    {
      file: "namespaces/invalid_spec.yaml",
      location: "Operation: GET /{index}/_doc/{id}",
      message: "The 200 response must be a reference object to '#/components/responses/invalid_spec.fetch@200'."
    },
    {
      file: "namespaces/invalid_yaml.yaml",
      location: "File Content",
      message: "Unable to read or parse YAML."
    },
    {
      file: "namespaces/",
      location: "Folder",
      message: "Duplicate path '/{index}' found in namespaces: dup_path_a, dup_path_c."
    },
    {
      file: "namespaces/",
      location: "Folder",
      message: "Duplicate path '/{index}/_rollover' found in namespaces: dup_path_a, dup_path_b, dup_path_c."
    }
  ]);
});
