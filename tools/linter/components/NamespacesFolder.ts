import NamespaceFile from "./NamespaceFile";
import {ValidationError} from "../../types";
import FolderValidator from "./base/FolderValidator";

export default class NamespacesFolder extends FolderValidator<NamespaceFile> {
    constructor(folder_path: string) {
        super(folder_path, NamespaceFile);
    }

    validate_folder(): ValidationError[] {
        return this.validate_duplicate_paths();
    }

    validate_duplicate_paths(): ValidationError[] {
        const paths: { [path: string]: string[] } = {};
        for (const file of this.files) {
            if(!file._spec?.paths) continue;
            Object.keys(file.spec().paths).sort().forEach((path) => {
                if(paths[path]) paths[path].push(file.namespace);
                else paths[path] = [file.namespace];
            });
        }
        return Object.entries(paths).map(([path, namespaces]) => {
            if(namespaces.length > 1)
                return this.error(`Duplicate path '${path}' found in namespaces: ${namespaces.sort().join(', ')}.`);
        }).filter((e) => e) as ValidationError[];
    }
}