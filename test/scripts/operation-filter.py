# NOTE:
# The OpenAPI smithy dependency currently does not support parsing
# examples from smithy models into an OpenAPI specs file. We can remove
# the script for manually parsing examples from json to openapi file once
# this dependency is supported.

import argparse
import shutil
import json
import os


class OperationFilter:
    def __init__(self, operations, output):
        self.operations = operations
        self.output = output

    def filter_operation(self):
        # Creating a copy of opensearch.smithy file for altering operations.
        original = r'../../model/opensearch.smithy'
        target = r'opensearch_temp.smithy'

        shutil.copyfile(original, target)

        command = 'sed "s/operations:.*$/operations: [' + self.operations + \
            ']/" opensearch_temp.smithy > ../../model/opensearch.smithy'
        os.system(command)

        # Changing current directory for building model.
        os.chdir('../../')
        os.system('gradle build')

        # Back to current folder.
        os.chdir('test/scripts/')

        # Replacing opensearch.smithy file with original content.
        shutil.copyfile(target, original)

        # Removing temporary file.
        os.remove("opensearch_temp.smithy")

    def parse_example(self,openapi_data, model_data):
        dict = {}
        # Parsing examples corresponding to operation-ids from Model json file.
        for operation in model_data['shapes'].keys():
            # Checking operation-ids in Model json file.
            if model_data['shapes'][operation]['type'] == 'operation':
                if 'traits' in model_data['shapes'][operation].keys():
                    # Checking examples for operation-id
                    if 'smithy.api#examples' in model_data['shapes'][operation]['traits'].keys():
                        # Storing operation-id and examples in a dictionary.
                        dict[operation] = model_data['shapes'][operation]['traits']['smithy.api#examples']

        # Checking URL endpoint in OpenAPI json file.
        for endpoint in openapi_data['paths'].keys():
            # Checking URL method in OpenAPI json file.
            for method in openapi_data['paths'][endpoint].keys():
                # Checking OperationId and title in OpenAPI json file and forming
                # operation name.
                title = openapi_data['info']['title']
                op_id = openapi_data['paths'][endpoint][method]['operationId']
                op_name = title + "#" + op_id
                if op_name in dict.keys():
                    print(op_name)
                    print(dict[op_name])
                    for example in dict[op_name]:
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


# Parsing command line arguments:
parser = argparse.ArgumentParser()

# Operation Agrument is required to specify operation-id's to be filtered out.
parser.add_argument('--operation', type=str, required=True)
parser.add_argument('--output', type=str, required=True)
args = parser.parse_args()

# Checking values for Arguments.
obj = OperationFilter(args.operation, args.output)

# Building smithy models as per user mentioned operation.
obj.filter_operation()

# Opening OpenAPI JSON file for checking operation ID.
openapi_file_obj = open(
    "../../build/smithyprojections/opensearch-api-specification/source/openapi/OpenSearch.openapi.json",
    mode='r',
    encoding='utf-8')
openapi_data = json.load(openapi_file_obj)

# Opening Model JSON file for checking examples.
model_file_obj = open(
    "../../build/smithyprojections/opensearch-api-specification/source/model/model.json",
    mode='r',
    encoding='utf-8')
model_data = json.load(model_file_obj)

# calling parse function.
obj.parse_example(openapi_data, model_data)

# Creating new JSON file for copying existing OpenAPI data and adding examples.
model_openapi_file_obj = open(
    args.output + "/model.openapi.json",
    mode='w',
    encoding='utf-8')

# Coverting python dictionary to JSON object.
json_data = json.dumps(openapi_data, indent=1)
model_openapi_file_obj.write(json_data)

# Closing all files
openapi_file_obj.close()
model_file_obj.close()
model_openapi_file_obj.close()

