import {ValidationError} from "../types";
import fs from "fs";
import _ from "lodash";
import RootFileValidator from "./RootFileValidator";
import NamespaceFileValidator from "./NamespaceFileValidator";
import FileStructureValidator from "./FileStructureValidator";
import SchemaFileValidator from "./SchemaFileValidator";
import MergedSpecValidator from "./MergedSpecValidator";

export default class OpenSearchSpecLinter {
    readonly ROOT_NAME = 'OpenSearch.openapi.yaml'
    root_folder: string;
    errors: ValidationError[] = [];

    constructor(root_folder: string) {
        this.root_folder = root_folder;
    }

    validate(): void {
        this.validate_file_structure();
        this.validate_root_file();
        this.validate_namespace_files();
        this.validate_schema_files();
        this.validate_merged_spec();
    }

    validate_file_structure(): void {
        const validator = new FileStructureValidator(this.root_folder, this.ROOT_NAME);
        validator.validate();
        this.errors.push(...validator.errors);
    }

    validate_root_file(): void {
        const validator = new RootFileValidator(this.root_folder, this.ROOT_NAME);
        validator.validate();
        this.errors.push(...validator.errors);
    }

    validate_namespace_files(): void {
        const folder = this.root_folder + '/namespaces';
        const namespace_files = fs.readdirSync(folder);
        _.each(namespace_files, (file) => {
            if(!file.endsWith('.yaml')) return;
            const validator = new NamespaceFileValidator(folder + file);
            validator.validate();
            this.errors.push(...validator.errors);
        });
    }

    validate_schema_files(): void {
        const folder = this.root_folder + '/schemas';
        const schema_files = fs.readdirSync(folder);
        _.each(schema_files, (file) => {
            if(!file.endsWith('.yaml')) return;
            const validator = new SchemaFileValidator(folder + file);
            validator.validate();
            this.errors.push(...validator.errors);
        });
    }

    validate_merged_spec(): void {
        const validator = new MergedSpecValidator(this.root_folder, this.ROOT_NAME);
        validator.validate();
        this.errors.push(...validator.errors);
    }
}