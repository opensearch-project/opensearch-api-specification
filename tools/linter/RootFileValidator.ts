import {ValidationError} from "../types";

export default class RootFileValidator {
    root_folder: string;
    errors: ValidationError[] = [];

    constructor(root_folder: string, root_name: string) {
        this.root_folder = root_folder;
    }

    validate(): void {

    }
}