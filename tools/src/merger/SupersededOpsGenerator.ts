import { type OperationSpec, type SupersededOperationMap } from 'types'
import _ from 'lodash'
import { read_yaml } from '../../helpers'
import { Logger, LogLevel } from '../Logger'

export default class SupersededOpsGenerator {
  logger: Logger
  superseded_ops: SupersededOperationMap

  constructor (root_path: string, logger: Logger | undefined) {
    this.logger = logger ?? new Logger(LogLevel.warn)
    const file_path = root_path + '/_superseded_operations.yaml'
    this.superseded_ops = read_yaml(file_path) as SupersededOperationMap
    delete this.superseded_ops.$schema
  }

  generate (spec: Record<string, any>): void {
    for (const [path, { superseded_by, operations }] of _.entries(this.superseded_ops)) {
      const regex = this.path_to_regex(superseded_by)
      const operation_keys = operations.map(op => op.toLowerCase())
      const superseded_path = this.copy_params(superseded_by, path)
      const path_entry = _.entries(spec.paths as Document).find(([path, _]) => regex.test(path))
      if (path_entry != null) spec.paths[superseded_path] = this.path_object(path_entry[1], operation_keys)
      else this.logger.warn(`Path not found: ${superseded_by}`)
    }
  }

  path_object (obj: any, keys: string[]): Record<string, any> {
    const cloned_obj = _.cloneDeep(_.pick(obj, keys))
    for (const key in cloned_obj) {
      const operation = cloned_obj[key] as OperationSpec
      operation.operationId = operation.operationId + '_superseded'
      operation.deprecated = true
      operation['x-ignorable'] = true
    }
    return cloned_obj
  }

  path_to_regex (path: string): RegExp {
    const source = '^' + path.replace(/\{.+?}/g, '\\{.+?\\}').replace(/\//g, '\\/') + '$'
    return new RegExp(source, 'g')
  }

  copy_params (source: string, target: string): string {
    const target_parts = target.split('/')
    const target_params = target_parts.filter(part => part.startsWith('{'))
    const source_params = source.split('/').filter(part => part.startsWith('{')).reverse()
    if (target_params.length !== source_params.length) { throw new Error('Mismatched parameters in source and target paths: ' + source + ' -> ' + target) }
    return target_parts.map((part) => part.startsWith('{') ? source_params.pop() : part).join('/')
  }
}
