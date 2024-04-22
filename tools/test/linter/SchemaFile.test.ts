import {mocked_schema_file, schema_file} from "./factories/schema_file";

test('validate_category()', () => {
  const validator = schema_file('_common.empty.yaml');

  expect(validator.validate_category()).toBeUndefined();
  expect(validator.validate_category('_common')).toBeUndefined();
  expect(validator.validate_category('cat._common')).toBeUndefined();
  expect(validator.validate_category('cat.valid_name')).toBeUndefined();
  expect(validator.validate_category('cat._invalid_name')).toEqual({
    file: "schemas/_common.empty.yaml",
    location: "File Name",
    message: "Invalid category name 'cat._invalid_name'. '_invalid_name' does not match regex: /^[a-z]+[a-z_]*[a-z]+$/."
  });
  expect(validator.validate_category('invalid_regex')).toEqual({
    file: "schemas/_common.empty.yaml",
    location: "File Name",
    message: "Invalid category name 'invalid_regex'. Must match regex: /^[a-z_]+\\.[a-z_]+$/."
  });
});

test('validate()', () => {
  const invalid_category = mocked_schema_file({returned_values: { validate_category: 'Invalid Category'}, schema_errors: [['Invalid Schema']]});
  expect(invalid_category.validate()).toEqual(['Invalid Category']);

  const invalid_schema = mocked_schema_file({schema_errors: [['Error 1', 'Error 2']]});
  expect(invalid_schema.validate()).toEqual(['Error 1', 'Error 2']);

  const valid = mocked_schema_file({schema_errors: [[]]});
  expect(valid.validate()).toEqual([]);
});