import {ValidationError} from "../types";
import RootFile from "./components/RootFile";
import NamespacesFolder from "./components/NamespacesFolder";

export default class PathRefsValidator {
    root_file: RootFile;
    namespaces_folder: NamespacesFolder;

    referenced_paths: Record<string, Set<string>> = {}; // file -> paths
    available_paths: Record<string, Set<string>> = {}; // file -> paths

    constructor(root_file: RootFile, namespaces_folder: NamespacesFolder) {
        this.root_file = root_file;
        this.namespaces_folder = namespaces_folder;
        this.#build_referenced_paths();
        this.#build_available_paths();
    }

    #build_referenced_paths() {
        for (const [path, spec] of Object.entries(this.root_file.spec().paths)) {
            const ref = spec!.$ref!;
            const file = ref.split('#')[0];
            if(!this.referenced_paths[file]) this.referenced_paths[file] = new Set();
            this.referenced_paths[file].add(path);
        }
    }

    #build_available_paths() {
        for (const file of this.namespaces_folder.files) {
            this.available_paths[file.file] = new Set(Object.keys(file.spec().paths || {}));
        }
    }

    validate(): ValidationError[] {
        return [
            ...this.validate_unresolved_refs(),
            ...this.validate_unreferenced_paths(),
        ];
    }

    validate_unresolved_refs(): ValidationError[] {
        return Object.entries(this.referenced_paths).flatMap(([ref_file, ref_paths]) => {
            const available = this.available_paths[ref_file];
            if(!available) return {
                file: this.root_file.file,
                location: `Paths: ${[...ref_paths].join(' , ')}`,
                message: `Unresolved path reference: Namespace file ${ref_file} does not exist.`,
            };

            return Array.from(ref_paths).map((path) => {
                if(!available.has(path)) return {
                    file: this.root_file.file,
                    location: `Path: ${path}`,
                    message: `Unresolved path reference: Path ${path} does not exist in namespace file ${ref_file}`,
                };
            }).filter((e) => e) as ValidationError[];
        });
    }

    validate_unreferenced_paths(): ValidationError[] {
        return Object.entries(this.available_paths).flatMap(([ns_file, ns_paths]) => {
            const referenced = this.referenced_paths[ns_file];
            if(!referenced) return {
                file: ns_file,
                message: `Unreferenced paths: No paths are referenced in the root file.`,
            };
            return Array.from(ns_paths).map((path) => {
                if(!referenced || !referenced.has(path)) return {
                    file: ns_file,
                    location: `Path: ${path}`,
                    message: `Unreferenced path: Path ${path} is not referenced in the root file.`,
                };
            }).filter((e) => e) as ValidationError[];
        });
    }
}