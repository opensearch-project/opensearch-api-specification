import sys

from openapi_spec_validator import validate
from openapi_spec_validator.readers import read_from_filename
from openapi_spec_validator.validation.exceptions import OpenAPIValidationError

if len(sys.argv) < 2:
    print("syntax: validate.py [spec]")
    exit(1)

spec = sys.argv[1]
print(f'Validating {spec} ...')

spec_dict, base_uri = read_from_filename(spec)

try:
    validate(spec_dict)
except OpenAPIValidationError as err:
    print(err)
    exit(2)
