import {OperationSpec, ValidationError} from "../types";

export default class OperationValidator {
    readonly GROUP_REGEX = /^([a-z]+[a-z_]*[a-z]+\.)?([a-z]+[a-z_]*[a-z]+)$/;

    spec: OperationSpec;
    namespace: string;
    group: string;

    errors: string[] = [];

    constructor(namespace: string, spec: OperationSpec) {
        this.spec = spec;
        this.namespace = namespace;
        this.group = spec['x-operation-group'];
    }

    validate(): void {
        if(this.validate_group())
            this.validate_operation_id();
    }

    validate_group(): true | void {
        if(!this.group || this.group === '')
            this.errors.push(`Missing "x-operation-group" property`);
        else if(!this.group.match(this.GROUP_REGEX))
            this.errors.push(`Invalid operation group "${this.group}". Must match regex: ${this.GROUP_REGEX.source}`);
        else {
            let [_, namespace] = this.group.split('.').reverse();
            namespace = namespace || '_core';
            if(this.namespace !== namespace)
                if(this.namespace === '_core')
                    this.errors.push(`Invalid operation group "${this.group}". "${namespace}" namespace detected. ` +
                        `Only "_core" namespace is allowed in this file. Note that _core namespace is omitted in operation group`);
                else
                    this.errors.push(`Invalid operation group "${this.group}". "${namespace}" namespace detected. ` +
                        `Only "${this.namespace}" namespace is allowed in this file"`);
            else return true;
        }
    }

    validate_operation_id(): void {
        const id = this.spec.operationId;
        const operationId_regex = new RegExp(`^${this.group.replace('.','\\.')}\\.[0-9]+$`);
        if(!id || id === '')
            this.errors.push(`Missing "operationId" property`);
        else if(!id.match(operationId_regex))
            this.errors.push(`Invalid operationId "${id}". Must be in <x-operation-group>.<number> format`);
    }
}