import yaml from "yaml";
import fs from "fs";
import {OpenAPIV3} from "openapi-types";
import _ from "lodash";
import {OperationSpec, ValidationError} from "../types";
import OperationValidator from "./OperationValidator";

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

export default class NamespaceFileValidator {
    readonly NAME_REGEX = /^[a-z]+[a-z_]*[a-z]+$/;

    spec: OpenAPIV3.Document;
    namespace: string;
    file_path: string;
    errors: ValidationError[] = [];

    constructor(file_path: string) {
        this.file_path = file_path;
        this.namespace = file_path.match(/namespaces\/(.*)\.yaml/)![1];
        this.spec = yaml.parse(fs.readFileSync(file_path, 'utf8')) as OpenAPIV3.Document;
    }

    validate(): void {
        this.validate_name();
        this.validate_operations();
    }

    #add_error(message: string, location?: string): void {
        this.errors.push({ file: `namespaces/${this.namespace}.yaml`, location, message });
    }

    validate_name(name = this.namespace): NamespaceFileValidator {
        if(name === '_core') return this;
        if(!name.match(this.NAME_REGEX))
            this.#add_error(`Invalid namespace name "${name}". Must match regex: ${this.NAME_REGEX.source}`, 'File Name');
        return this;
    }

    validate_operations(): NamespaceFileValidator {
        _.entries(this.spec.paths).forEach(([path, ops]) => {
            _.entries(_.pick(ops, HTTP_METHODS))
                .forEach(([verb, op]) => {
                    const location = `Operation: ${verb.toUpperCase()} ${path}`;
                    const validator = new OperationValidator(this.namespace, op as OperationSpec);
                    validator.validate();
                    validator.errors.forEach((error) => this.#add_error(error, location));
                });
        });
        return this;
    }
}