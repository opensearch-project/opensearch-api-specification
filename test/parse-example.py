import json
import os

def parse_example():
    # Checking URL endpoint in OpenAPI json file.
    for endpoint in openapi_data['paths'].keys():
        # Checking URL method in OpenAPI json file.
        for method in openapi_data['paths'][endpoint].keys():
            # Checking OperationId and title in OpenAPI json file and forming
            # operation name.
            title = openapi_data['info']['title']
            op_id = openapi_data['paths'][endpoint][method]['operationId']
            op_name = title + "#" + op_id
            # OperationName in Model json file.
            if op_name in model_data['shapes'].keys():
                # Checking traits exists in Model json file for a
                # OperationName.
                if 'traits' in model_data['shapes'][op_name].keys():
                    # Checking examples exists in Model json file for a
                    # OperationName.
                    if 'smithy.api#examples' in model_data['shapes'][op_name]['traits'].keys():
                        op_examples = model_data['shapes'][op_name]['traits']['smithy.api#examples']
                        for example in op_examples:
                            # Adding examples for Input params
                            if 'input' in example:
                                for key in example['input']:
                                    for param in openapi_data['paths'][endpoint][method]['parameters']:
                                        if key == param['name']:
                                            param['example'] = example['input'][key]
                            # Adding examples for Output params
                            if 'output' in example:
                                op_out_name = op_id + 'ResponseContent'
                                if op_out_name in openapi_data['components']['schemas'].keys():
                                    openapi_data['components']['schemas'][op_out_name]['example'] = example['output']


# Opening OpenAPI JSON file for checking operation ID.
openapi_file_obj = open(
    "build/smithyprojections/opensearch-api-specification-1/source/openapi/OpenSearch.openapi.json",
    mode='r',
    encoding='utf-8')
openapi_data = json.load(openapi_file_obj)

# Opening Model JSON file for checking examples.
model_file_obj = open(
    "build/smithyprojections/opensearch-api-specification-1/source/model/model.json",
    mode='r',
    encoding='utf-8')
model_data = json.load(model_file_obj)

# Creating new JSON file for copying existing OpenAPI data and adding examples.
model_openapi_file_obj = open(
    "build/smithyprojections/opensearch-api-specification-1/source/openapi/model.openapi.json",
    mode='w',
    encoding='utf-8')

# calling parse function.
parse_example()

# Coverting python dictionary to JSON object.
json_data = json.dumps(openapi_data, indent=1)
model_openapi_file_obj.write(json_data)

# Closing all files
openapi_file_obj.close()
model_file_obj.close()
model_openapi_file_obj.close()

# Coverting JSON file to yaml file.
os.system("openapi-format build/smithyprojections/opensearch-api-specification-1/source/openapi/model.openapi.json -o build/smithyprojections/opensearch-api-specification-1/source/openapi/model.openapi.yaml --no-sort")

