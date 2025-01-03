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
import { is_ref, SpecificationContext } from "../_utils";
import { SchemaVisitor } from "../_utils/SpecificationVisitor";

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
    const ref_rewriter = new SchemaVisitor((_, schema) => {
      if (!is_ref(schema)) return

      if (schema.$ref.startsWith('schemas/')) {
        schema.$ref = schema.$ref.replace('schemas/', '#/components/schemas/').replace('.yaml#/components/schemas/', ':')
      }
    })

    const ctx = new SpecificationContext('_global_parameters.yaml').child('components').child('parameters')

    const params = (spec.components?.parameters ?? {}) as Record<string, OpenAPIV3.ParameterObject>
    _.entries(params).forEach(([original_key, param]) => {
      const global_key = `_global::${param.in}.${param.name}`
      _.set(param, 'x-global', true)
      _.unset(params, original_key)

      if (param.schema != null) {
        ref_rewriter.visit_schema(ctx.child(original_key).child('schema'), param.schema)
      }

      params[global_key] = param
    })

    return params
  }
}
