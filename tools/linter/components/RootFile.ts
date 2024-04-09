import {ValidationError} from "../../types";
import FileValidator from "./base/FileValidator";

export default class RootFile extends FileValidator {
    constructor(file_path: string) {
        super(file_path);
        this.file = file_path.split('/').pop()!;
    }

    validate_file(): ValidationError[] {
        return this.validate_paths();
    }

    validate_paths(): ValidationError[] {
        return Object.entries(this.spec().paths).map(([path, spec]) => {
            if(!spec?.$ref)
                return this.error(`Every path must be a reference object to a path in a namespace file`, `Path: ${path}`);
        }).filter((e) => e) as ValidationError[];
    }
}