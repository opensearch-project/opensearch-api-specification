import NamespacesFolder from "./components/NamespacesFolder";
import SchemasFolder from "./components/SchemasFolder";
import {ValidationError} from "../types";

export default class SchemaRefsValidator {
  namespaces_folder: NamespacesFolder;
  schemas_folder: SchemasFolder;

  referenced_schemas: Record<string, Set<string>> = {}; // file -> schemas
  available_schemas: Record<string, Set<string>> = {}; // file -> schemas

  constructor(namespaces_folder: NamespacesFolder, schemas_folder: SchemasFolder) {
    this.namespaces_folder = namespaces_folder;
    this.schemas_folder = schemas_folder;
    this.#find_refs_in_namespaces_folder();
    this.#find_refs_in_schemas_folder();
    this.#build_available_schemas();
  }

  #find_refs_in_namespaces_folder() {
    const search = (obj: Record<string, any>) => {
      const ref = obj.$ref;
      if(ref) {
        const file = ref.split('#')[0].replace("../", "");
        const name = ref.split('/').pop();
        if(!this.referenced_schemas[file]) this.referenced_schemas[file] = new Set();
        this.referenced_schemas[file].add(name);
      }
      for (const key in obj)
        if(typeof obj[key] === 'object') search(obj[key]);
    };

    this.namespaces_folder.files.forEach((file) => { search(file.spec().components || {}) });
  }

  #find_refs_in_schemas_folder() {
    const search = (obj: Record<string, any>, ref_file: string) => {
      const ref = obj.$ref;
      if(ref) {
        const file = ref.startsWith('#') ? ref_file : `schemas/${ref.split('#')[0]}`;
        const name = ref.split('/').pop();
        if(!this.referenced_schemas[file]) this.referenced_schemas[file] = new Set();
        this.referenced_schemas[file].add(name);
      }
      for (const key in obj)
        if(typeof obj[key] === 'object') search(obj[key], ref_file);
    }

    this.schemas_folder.files.forEach((file) => { search(file.spec().components?.schemas  || {}, file.file) });
  }

  #build_available_schemas() {
    this.schemas_folder.files.forEach((file) => {
      this.available_schemas[file.file] = new Set(Object.keys(file.spec().components?.schemas || {}));
    });
  }

  validate(): ValidationError[] {
    return [
      ...this.validate_unresolved_refs(),
      ...this.validate_unreferenced_schemas(),
    ];
  }

  validate_unresolved_refs(): ValidationError[] {
    return Object.entries(this.referenced_schemas).flatMap(([ref_file, ref_schemas]) => {
      const available = this.available_schemas[ref_file];
      if(!available) return {
        file: this.namespaces_folder.file,
        message: `Unresolved schema reference: Schema file ${ref_file} is referenced but does not exist.`,
      };

      return Array.from(ref_schemas).map((schema) => {
        if(!available.has(schema)) return {
          file: ref_file,
          location: `#/components/schemas/${schema}`,
          message: `Unresolved schema reference: Schema ${schema} is referenced but does not exist.`,
        };
      }).filter((e) => e) as ValidationError[];
    });
  }

  validate_unreferenced_schemas(): ValidationError[] {
    return Object.entries(this.available_schemas).flatMap(([file, schemas]) => {
      const referenced = this.referenced_schemas[file];
      if(!referenced) return {
        file: file,
        message: `Unreferenced schema: Schema file ${file} is not referenced anywhere.`,
      };

      return Array.from(schemas).map((schema) => {
        if(!referenced.has(schema)) return {
          file: file,
          location: `#/components/schemas/${schema}`,
          message: `Unreferenced schema: Schema ${schema} is not referenced anywhere.`,
        };
      }).filter((e) => e) as ValidationError[];
    });
  }
}