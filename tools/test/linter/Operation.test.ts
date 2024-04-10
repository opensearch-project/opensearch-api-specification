import {mocked_operation, operation} from "./factories/operation";

test('validate_group()', () => {
    const no_group = operation({'x-operation-group': ''});
    expect(no_group.validate_group()).toEqual({
        file: 'namespaces/indices.yaml',
        location: `Operation: POST /{index}/something/{abc_xyz}`,
        message: `Missing x-operation-group property`,
    });

    const invalid_group = operation({'x-operation-group': 'indices_'});
    expect(invalid_group.validate_group())
        .toEqual(invalid_group.error(`Invalid x-operation-group 'indices_'. Must match regex: ^([a-z]+[a-z_]*[a-z]+\\.)?([a-z]+[a-z_]*[a-z]+)$`));

    const invalid_action = operation({'x-operation-group': 'indices.create.index'});
    expect(invalid_action.validate_group())
        .toEqual(invalid_action.error(`Invalid x-operation-group 'indices.create.index'. Must match regex: ^([a-z]+[a-z_]*[a-z]+\\.)?([a-z]+[a-z_]*[a-z]+)$`));

    const valid_group = operation({'x-operation-group': 'indices.create'});
    expect(valid_group.validate_group())
        .toBeUndefined();
});

test('validate_namespace()', () => {
    const valid_core = operation({'x-operation-group': 'search'}, '_core.yaml');
    expect(valid_core.validate_namespace())
        .toBeUndefined();

    const valid_non_core = operation({'x-operation-group': 'indices._create'}, 'indices.yaml');
    expect(valid_non_core.validate_namespace())
        .toBeUndefined();

    const non_omitted_core = operation({'x-operation-group': '_core.search'}, '_core.yaml');
    expect(non_omitted_core.validate_namespace())
        .toEqual(non_omitted_core.error(`Invalid x-operation-group '_core.search'. '_core' namespace must be omitted in x-operation-group`));

    const unmatched_namespace = operation({'x-operation-group': 'indices.create'}, 'cat.yaml');
    expect(unmatched_namespace.validate_namespace())
        .toEqual(unmatched_namespace.error(`Invalid x-operation-group 'indices.create'. 'indices' namespace detected. Only 'cat' namespace is allowed in this file`));
});

test('validate_operationId()', () => {
    const no_id = operation({'x-operation-group': 'indices.create'});
    expect(no_id.validate_operationId())
        .toEqual(no_id.error(`Missing operationId property`));

    const invalid_id = operation({'x-operation-group': 'indices.create', operationId: 'create_index'});
    expect(invalid_id.validate_operationId())
        .toEqual(invalid_id.error(`Invalid operationId 'create_index'. Must be in {x-operation-group}.{number} format`));

    const valid_id = operation({'x-operation-group': 'indices.create', operationId: 'indices.create.1'});
    expect(valid_id.validate_operationId())
        .toBeUndefined();
});

test('validate_description()', () => {
    const no_description = operation({'x-operation-group': 'indices.create'});
    expect(no_description.validate_description())
        .toEqual(no_description.error(`Missing description property`));

    const valid_description = operation({'x-operation-group': 'indices.create', description: 'This is a description'});
    expect(valid_description.validate_description())
        .toBeUndefined();
});

test('validate_requestBody()', () => {
    const no_body = operation({'x-operation-group': 'indices.create'});
    expect(no_body.validate_requestBody())
        .toBeUndefined();

    const valid_body = operation({'x-operation-group': 'indices.create', requestBody: {$ref: '#/components/requestBodies/indices.create'}});
    expect(valid_body.validate_requestBody())
        .toBeUndefined();

    const invalid_body = operation({'x-operation-group': 'indices.create', requestBody: {$ref: '#/components/requestBodies/indices.create.1'}});
    expect(invalid_body.validate_requestBody())
        .toEqual(invalid_body.error(`The requestBody must be a reference object to '#/components/requestBodies/indices.create'`));
});

test('validate_response()', () => {
    const no_responses = operation({responses: {}});
    expect(no_responses.validate_responses()).toEqual([no_responses.error(`Missing responses property`)]);

    const invalid_responses = operation({'x-operation-group': 'cat.info', responses: {
        '200': {$ref: '#/components/responses/cat.info'},
        '500': {$ref: '#/components/responses/cat.info@500'},
        '400': {$ref: '#/components/responses/cat.info:bad_request'},
    }});
    expect(invalid_responses.validate_responses()).toEqual([
        invalid_responses.error(`The 200 response must be a reference object to '#/components/responses/cat.info@200'`),
        invalid_responses.error(`The 400 response must be a reference object to '#/components/responses/cat.info@400'`),]);

    const valid_responses = operation({'x-operation-group': 'cat.info', responses: {'200': {$ref: '#/components/responses/cat.info@200'}}});
    expect(valid_responses.validate_responses())
        .toEqual([]);
});

test('validate_parameters()', () => {
    const no_parameters = operation({'x-operation-group': 'indices.create'});
    expect(no_parameters.validate_parameters())
        .toBeUndefined();

    const valid_parameters = operation({'x-operation-group': 'indices.create', parameters: [{$ref: '#/components/parameters/indices.create::path.request_timeout'}]});
    expect(valid_parameters.validate_parameters())
        .toBeUndefined();

    const invalid_parameters = operation({'x-operation-group': 'indices.create', parameters: [
        {$ref: '#/components/parameters/indices.create::path.index'},
        {$ref: '#/components/parameters/indices.create::timeout'},
        {$ref: '#/components/parameters/indices.create::query:pretty'},
    ]});
    expect(invalid_parameters.validate_parameters())
        .toEqual(invalid_parameters.error(`Every parameter must be a reference object to '#/components/parameters/{x-operation-group}::{path|query}.{parameter_name}'`));
});

test('validate_path_parameters()', () => {
    const invalid_path_params = operation({parameters: [{$ref: '#/components/parameters/indices.create::path.index'}]});
    expect(invalid_path_params.validate_path_parameters())
        .toEqual(invalid_path_params.error(`Path parameters must match the parameters in the path: {abc_xyz}, {index}`));

    const valid_path_params = operation({parameters: [
        {$ref: '#/components/parameters/indices.create::path.index'},
        {$ref: '#/components/parameters/indices.create::path.abc_xyz'} ]});
    expect(valid_path_params.validate_path_parameters())
        .toBeUndefined();
});

test('validate()', () => {
    const invalid_group = mocked_operation({validate_group: 'Invalid group', validate_namespace: 'Invalid namespace'});
    expect(invalid_group.validate())
        .toEqual(['Invalid group']);

    const invalid_namespace = mocked_operation({validate_group: undefined, validate_namespace: 'Invalid namespace', validate_operationId: 'Invalid operationId'});
    expect(invalid_namespace.validate())
        .toEqual(['Invalid namespace']);

    const typical_invalid = mocked_operation({
        validate_group: undefined, validate_namespace: undefined,
        validate_operationId: 'Invalid operationId', validate_description: 'Invalid description', validate_requestBody: 'Invalid requestBody',
        validate_responses: ['Invalid response 1', 'Invalid response 2'],
        validate_parameters: 'Invalid parameters', validate_path_parameters: 'Invalid path parameters' });
    expect(typical_invalid.validate())
        .toEqual(['Invalid operationId', 'Invalid description', 'Invalid requestBody',
            'Invalid parameters', 'Invalid path parameters', 'Invalid response 1', 'Invalid response 2']);

    const valid = mocked_operation({ validate_responses: [] });
    expect(valid.validate())
        .toEqual([]);
});