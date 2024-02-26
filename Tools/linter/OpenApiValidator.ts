import fs from 'fs';
import SwaggerParser from "@apidevtools/swagger-parser";
export default class OpenApiValidator {
    private SPEC_EXT = '.yaml';
    static async validate(root_folder: string = '../spec/') {
        const validator = new OpenApiValidator();

        await validator.validate_spec('../OpenSearch.openapi.yaml');
        // validator.validate_folder(root_folder);
    }

    validate_folder(folder: string): void {
        this.#spec_files(folder).forEach(this.validate_spec);
    }

    async validate_spec(path: string): Promise<void> {
        await SwaggerParser.validate(path)
    }

    #spec_files(folder: string): string[] {
        return fs.readdirSync(folder).flatMap(file => {
            const path = folder + file;
            if(file.endsWith(this.SPEC_EXT)) return path;
            if(fs.lstatSync(path).isDirectory()) return this.#spec_files(path + '/');
            return [];
        });
    }
}