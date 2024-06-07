/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import _ from 'lodash'
import { read_yaml } from '../helpers'

export default class GlobalParamsGenerator {
  global_params: Record<string, OpenAPIV3.ParameterObject>

  constructor (root_path: string) {
    const file_path = root_path + '/_global_parameters.yaml'
    const spec: OpenAPIV3.Document = read_yaml(file_path)
    this.global_params = this.create_global_params(spec)
  }

  generate (spec: Record<string, any>): void {
    spec.components.parameters = { ...this.global_params, ...spec.components.parameters }

    const global_param_refs = Object.keys(this.global_params).map(param => ({ $ref: `#/components/parameters/${param}` }))
    Object.entries(spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, operation]) => {
        const params = operation.parameters ?? []
        operation.parameters = [...params, ...Object.values(global_param_refs)]
      })
    })
  }

  create_global_params (spec: OpenAPIV3.Document): Record<string, OpenAPIV3.ParameterObject> {
    const params = (spec.components?.parameters ?? {}) as Record<string, OpenAPIV3.ParameterObject>
    _.entries(params).forEach(([original_key, param]) => {
      const global_key = `_global::${param.in}.${param.name}`
      _.set(param, 'x-global', true)
      _.unset(params, original_key)
      params[global_key] = param
    })
    return params
  }
}
