import {OpenAPIV3} from "openapi-types";
import {OperationSpec, ValidationError} from "../../types";
import OperationGroup from "./OperationGroup";
import _ from "lodash";
import Operation from "./Operation";
import {resolve} from "../../helpers"
import FileValidator from "./base/FileValidator";

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const NAME_REGEX = /^[a-z]+[a-z_]*[a-z]+$/;

export default class NamespaceFile extends FileValidator {
  namespace: string;
  _operation_groups: OperationGroup[] | undefined;
  _refs: Set<string> | undefined;

  constructor(file_path: string) {
    super(file_path);
    this.namespace = file_path.split('/').slice(-1)[0].replace('.yaml', '');
  }

  validate_file(): ValidationError[] {
    const name_error = this.validate_name();
    if(name_error) return [name_error];
    const group_errors = this.operation_groups().flatMap((group) => group.validate());
    if(group_errors.length > 0) return group_errors;

    return [
      this.validate_schemas(),
      ...this.validate_unresolved_refs(),
      ...this.validate_unused_refs(),
      ...this.validate_parameter_refs(),
    ].filter((e) => e) as ValidationError[]
  }

  operation_groups(): OperationGroup[] {
    if(this._operation_groups) return this._operation_groups;
    const ops: Operation[] = _.entries(this.spec().paths).flatMap(([path, ops]) => {
      return _.entries(_.pick(ops, HTTP_METHODS)).map(([verb, op]) => {
        return new Operation(this.file, path, verb, op as OperationSpec);
      });
    });

    return this._operation_groups = _.entries(_.groupBy(ops, (op) => op.group)).map(([group, ops]) => {
      return new OperationGroup(this.file, group, ops);
    });
  }

  refs(): Set<string> {
    if(this._refs) return this._refs;
    this._refs = new Set<string>();
    const find_refs = (obj: Record<string, any>) => {
      if(obj.$ref) this._refs!.add(obj.$ref);
      _.values(obj).forEach((value) => { if(typeof value === 'object') find_refs(value); });
    }
    find_refs(this.spec().paths || {});
    return this._refs;
  }

  validate_name(name = this.namespace): ValidationError | void {
    if(name === '_core') return;
    if(!name.match(NAME_REGEX))
      return this.error(`Invalid namespace name '${name}'. Must match regex: /${NAME_REGEX.source}/.`, 'File Name');
    return;
  }

  validate_schemas(): ValidationError | void {
    if(this.spec().components?.schemas)
      return this.error(`components/schemas is not allowed in namespace files`, '#/components/schemas');
  }

  validate_unresolved_refs(): ValidationError[] {
    return Array.from(this.refs()).map((ref) => {
      if(resolve(ref, this.spec()) === undefined) return this.error(`Unresolved reference: ${ref}`, ref);
    }).filter((e) => e) as ValidationError[];
  }

  validate_unused_refs(): ValidationError[] {
    return _.entries(this.spec().components || {}).flatMap(([type, collection]) => {
      return _.keys(collection).map((name) => {
        if (!this.refs().has(`#/components/${type}/${name}`))
          return this.error(`Unused ${type} component: ${name}`, `#/components/${type}/${name}`);
      })
    }).filter((e) => e) as ValidationError[];
  }

  validate_parameter_refs(): ValidationError[] {
    const parameters = this.spec().components?.parameters as Record<string, OpenAPIV3.ParameterObject>
    if(!parameters) return [];
    return _.entries(parameters).map(([name, p]) => {
      const group = name.split('::')[0];
      const expected = `${group}::${p.in}.${p.name}`;
      if(name !== expected)
        return this.error(
          `Parameter component '${name}' must be named '${expected}' since it is a ${p.in} parameter named '${p.name}'.`,
          `#/components/parameters/#${name}`);
      if(!p.name.match(/^[a-z0-9._]+$/))
        return this.error(
          `Invalid parameter name '${p.name}'. A parameter's name can only contain lower-cased alphanumerics, underscores, and periods.`,
          `#/components/parameters/#${name}`);
    }).filter((e) => e) as ValidationError[];
  }
}