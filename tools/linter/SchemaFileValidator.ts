import {ValidationError} from "../types";

export default class SchemaFileValidator {
    file_path: string;
    errors: ValidationError[] = [];

    constructor(file_path: string) {
        this.file_path = file_path;
    }

    validate(): void {

    }
}