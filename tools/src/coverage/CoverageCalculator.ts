/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import { HTTP_METHODS, read_yaml, write_json } from '../../helpers'

export default class CoverageCalculator {
  private readonly _cluster_spec: OpenAPIV3.Document
  private readonly _input_spec: OpenAPIV3.Document
  private readonly _output_path: string

  constructor (cluster_spec_path: string, input_spec_path: string, output_path: string) {
    this._cluster_spec = read_yaml(cluster_spec_path)
    this._input_spec = read_yaml(input_spec_path)
    this._output_path = output_path
  }

  calculate (): void {
    type Endpoints = Record<string, Set<OpenAPIV3.HttpMethods>>
    const collect = (document: OpenAPIV3.Document): Endpoints =>
      Object.fromEntries(
        Object.entries(document.paths)
          .map(([path, path_item]): [string, Set<OpenAPIV3.HttpMethods>] => {
            // Sanitize path params to ignore naming of params in route templates
            path = path.replaceAll(/\{[^}]+}/g, '{}')
            if (path_item == null) return [path, new Set()]
            return [path, new Set(HTTP_METHODS.filter(method => path_item[method] != null))]
          })
      )
    const count = (endpoints: Endpoints): number =>
      Object.values(endpoints).map(methods => methods.size).reduce((acc, v) => acc + v, 0)
    const prune = (endpoints: Endpoints): Endpoints =>
      Object.fromEntries(Object.entries(endpoints).filter(([_, methods]) => methods.size > 0))

    const uncovered = collect(this._cluster_spec)
    const specified_but_not_provided = collect(this._input_spec)
    const covered: Endpoints = {}

    for (const [path, methods] of Object.entries(uncovered)) {
      if (specified_but_not_provided[path] === undefined) continue

      for (const method of [...methods]) {
        if (!specified_but_not_provided[path].delete(method)) continue

        if (covered[path] === undefined) covered[path] = new Set()
        covered[path].add(method)
        uncovered[path].delete(method)
      }
    }

    const uncovered_count = count(uncovered)
    const covered_count = count(covered)
    const total_count = uncovered_count + covered_count

    write_json(
      this._output_path,
      {
        $description: {
          uncovered: 'Endpoints provided by the OpenSearch cluster but DO NOT exist in the specification',
          covered: 'Endpoints both provided by the OpenSearch cluster and exist in the specification',
          specified_but_not_provided: 'Endpoints NOT provided by the OpenSearch cluster but exist in the specification'
        },
        counts: {
          uncovered: uncovered_count,
          uncovered_pct: Math.round(uncovered_count / total_count * 100 * 100) / 100,
          covered: covered_count,
          covered_pct: Math.round(covered_count / total_count * 100 * 100) / 100,
          specified_but_not_provided: count(specified_but_not_provided)
        },
        endpoints: {
          uncovered: prune(uncovered),
          covered: prune(covered),
          specified_but_not_provided: prune(specified_but_not_provided)
        }
      },
      (_, value) => {
        if (value instanceof Set) return [...value]
        return value
      })
  }
}
