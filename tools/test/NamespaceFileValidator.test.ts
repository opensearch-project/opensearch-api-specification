import NamespaceFileValidator from "../linter/NamespaceFileValidator";


function validator(fixture_name: string = '_empty'): NamespaceFileValidator {
    return new NamespaceFileValidator(`./test/fixtures/invalid_spec/namespaces/${fixture_name}.yaml`);
}

test('validate_name', () => {
    expect(validator('_empty').validate_name().errors).toEqual([{
        file: 'namespaces/_empty.yaml',
        location: 'File Name',
        message: 'Invalid namespace name "_empty". Must match regex: ^[a-z]+[a-z_]*[a-z]+$'
    }]);

    expect(validator().validate_name('indices').errors).toEqual([]);
    expect(validator('_core').validate_name().errors).toEqual([]);
});

test('validate_operations', () => {
    expect(validator('_core').validate_operations().errors).toEqual([
        {
            file: 'namespaces/_core.yaml',
            location: 'Operation: PUT /_bulk',
            message: 'Invalid operation group "document.bulk". "document" namespace detected. Only "_core" namespace is allowed in this file. Note that _core namespace is omitted in operation group'
        },
        {
            file: "namespaces/_core.yaml",
            location: "Operation: POST /_bulk",
            message: 'Invalid operation group "bulk_". Must match regex: ^([a-z]+[a-z_]*[a-z]+\\.)?([a-z]+[a-z_]*[a-z]+)$'
        },
        {
            file: 'namespaces/_core.yaml',
            location: 'Operation: PUT /{index}/_bulk',
            message: 'Invalid operationId "bulk-10". Must be in <x-operation-group>.<number> format'
        },
    ]);
})