import FileValidator from "./base/FileValidator";
import ajv from "ajv";
import fs from "fs";
import YAML from "yaml";
import {ValidationError} from "../../types";

export default class SupersededOperationsFile extends FileValidator {
  JSON_SCHEMA_PATH = '../json_schemas/_superseded_operations.yaml';
  constructor(file_path: string) {
    super(file_path);
  }

  validate(): ValidationError[] {
    return [
      this.validate_json_schema()
    ].filter(e => e) as ValidationError[]
  }

  validate_json_schema(): ValidationError | undefined {
    const schema = YAML.parse(fs.readFileSync(this.JSON_SCHEMA_PATH, 'utf8'));
    const validator = (new ajv()).compile(schema);
    if (!validator(this.spec())) {
      return this.error(`File content does not match JSON schema found in '${this.JSON_SCHEMA_PATH}':\n ${JSON.stringify(validator.errors, null, 2)}`);
    }
  }
}