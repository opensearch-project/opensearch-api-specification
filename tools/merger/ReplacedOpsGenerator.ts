import {OperationSpec, ReplacedOperationMap} from "../types";
import YAML from "yaml";
import fs from "fs";
import _ from "lodash";

export default class ReplacedOpsGenerator {
    file_path: string;
    replaced_ops: ReplacedOperationMap;

    constructor(root_path: string) {
        this.file_path = root_path + '/_replaced_operations.yaml';
        this.replaced_ops = YAML.parse(fs.readFileSync(this.file_path, 'utf8'));
    }

    generate(spec: Record<string, any>): void {
        for(const [path, { replaced_by, operations }] of _.entries(this.replaced_ops)) {
            const regex = this.path_to_regex(replaced_by);
            const operation_keys = operations.map(op => op.toLowerCase());
            const replaced_path = this.copy_params(replaced_by, path);
            const path_entry = _.entries(spec.paths).find(([path, _]) => regex.test(path));
            if(!path_entry) console.log(`Path not found: ${replaced_by}`);
            else spec.paths[replaced_path] = this.path_object(path_entry[1] as any, operation_keys);
        }
    }

    path_object(obj: Record<string, any>, keys: string[]): Record<string, any> {
        const cloned_obj = _.cloneDeep(_.pick(obj, keys));
        for(const key in cloned_obj) {
            const operation = cloned_obj[key] as OperationSpec;
            operation.operationId = operation.operationId + '_replaced';
            operation.deprecated = true;
            operation['x-ignorable'] = true;
        }
        return cloned_obj;
    }

    path_to_regex(path: string): RegExp {
        const source = '^' + path.replace(/\{.+?}/g, '\\{.+?\\}').replace(/\//g, '\\/') + '$';
        return new RegExp(source, 'g');
    }

    copy_params(source: string, target: string): string {
        const target_parts = target.split('/');
        const target_params = target_parts.filter(part => part.startsWith('{'));
        const source_params = source.split('/').filter(part => part.startsWith('{')).reverse();
        if(target_params.length !== source_params.length)
            throw new Error('Mismatched parameters in source and target paths: ' + source + ' -> ' + target);
        return target_parts.map((part) => part.startsWith('{') ? source_params.pop()! : part).join('/');
    }
}