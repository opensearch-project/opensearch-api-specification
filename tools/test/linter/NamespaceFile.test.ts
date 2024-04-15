import {mocked_namespace_file, namespace_file} from "./factories/namespace_file";


test('constructor()', () => {
    const file = namespace_file('empty.yaml');
    expect(file.file).toBe('namespaces/empty.yaml');
    expect(file.namespace).toBe('empty');
    expect(file.operation_groups()).toEqual([]);
});

test('validate_name()', () => {
    const ns_file = mocked_namespace_file({});

    expect(ns_file.validate_name('_core')).toBeUndefined();
    expect(ns_file.validate_name('indices')).toBeUndefined();
    expect(ns_file.validate_name('_cat')).toEqual({
        file: 'namespaces/indices.yaml',
        location: 'File Name',
        message: `Invalid namespace name '_cat'. Must match regex: /^[a-z]+[a-z_]*[a-z]+$/.`
    });
});

test('validate_schemas()', () => {
    const with_schemas = mocked_namespace_file({spec: {components: {schemas: {}}}});
    expect(with_schemas.validate_schemas()).toEqual({
        file: `namespaces/indices.yaml`,
        location: `#/components/schemas`,
        message: `components/schemas is not allowed in namespace files`
    });

    const no_schemas = mocked_namespace_file({spec: {components: {}}});
    expect(no_schemas.validate_schemas()).toBeUndefined();
});

test('validate_unresolved_refs()', () => {
    const validator = namespace_file('invalid_components.yaml');
    expect(validator.validate_unresolved_refs()).toEqual([
        {
            file: `namespaces/invalid_components.yaml`,
            location: `#/components/responses/indices.create@200`,
            message: `Unresolved reference: #/components/responses/indices.create@200`
        },
        {
            file: `namespaces/invalid_components.yaml`,
            location: `#/components/parameters/indices.create::query.pretty`,
            message: `Unresolved reference: #/components/parameters/indices.create::query.pretty`
        }
    ]);
});

test('validate_unused_refs()', () => {
    const validator = namespace_file('invalid_components.yaml');
    expect(validator.validate_unused_refs()).toEqual([
        {
            file: `namespaces/invalid_components.yaml`,
            location: `#/components/requestBodies/indices.create`,
            message: `Unused requestBodies component: indices.create`
        },
        {
            file: `namespaces/invalid_components.yaml`,
            location: `#/components/parameters/indices.create::query.h`,
            message: `Unused parameters component: indices.create::query.h`
        }
    ]);
});

test('validate_parameter_refs()', () => {
   const validator = namespace_file('invalid_components.yaml');
    expect(validator.validate_parameter_refs()).toEqual([
        {
            file: "namespaces/invalid_components.yaml",
            location: "#/components/parameters/#indices.create::query.ExpandWildcards",
            message: "Invalid parameter name 'ExpandWildcards'. A parameter's name can only contain lower-cased alphanumerics, underscores, and periods."
        },
        {
            file: "namespaces/invalid_components.yaml",
            location: "#/components/parameters/#indices.create::query.h",
            message: "Parameter component 'indices.create::query.h' must be named 'indices.create::query.v' since it is a query parameter named 'v'."
        }
    ]);
});

test('validate()', () => {
    const invalid_name = mocked_namespace_file({returned_values: {validate_name: 'Invalid Name'}, groups_errors: [['group error']]});
    expect(invalid_name.validate()).toEqual(['Invalid Name']);

    const invalid_groups = mocked_namespace_file({returned_values: { validate_schemas: 'Invalid schemas' }, groups_errors: [['error']]});
    expect(invalid_groups.validate()).toEqual(['error']);

    const typical = mocked_namespace_file({returned_values: {
            validate_schemas: 'schemas error',
            validate_unresolved_refs: ['unresolved'],
            validate_unused_refs: ['unused'],
            validate_parameter_refs: ['parameter']}});
    expect(typical.validate()).toEqual(['schemas error', 'unresolved', 'unused', 'parameter']);

    const valid = mocked_namespace_file({groups_errors: [[], []]});
    expect(valid.validate()).toEqual([]);
});