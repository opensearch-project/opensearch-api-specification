import { ValidationError } from "../../../types";
export default class ValidatorBase {
    file: string;
    location: string | undefined;

    constructor(file: string, location?: string) {
        this.file = file;
        this.location = location;
    }

    error(message: string, location = this.location, file = this.file): ValidationError {
        return { file, location, message };
    }

    validate(): ValidationError[] {
        throw new Error('Method not implemented.');
    }
}