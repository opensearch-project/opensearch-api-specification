/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import _ from 'lodash'
import { OpenAPIV3 } from 'openapi-types'

export const HTTP_METHODS: OpenAPIV3.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)

export function resolve_ref (ref: string, root: Record<string, any>): Record<string, any> | undefined {
  const paths = ref.replace('#/', '').split('/')
  for (const p of paths) {
    root = root[p]
    if (root === undefined) break
  }
  return root
}

export function resolve_obj (obj: Record<string, any> | undefined, root: Record<string, any>): Record<string, any> | undefined {
  if (obj === undefined) return undefined
  if (obj.$ref !== null) return resolve_ref(obj.$ref as string, root)
  return obj
}

export function dig (obj: Record<string, any>, path: string[], root: Record<string, any>): any {
  let value = obj
  for (const p of path) {
    value = resolve_obj(value, root)?.[p]
    if (value === undefined) break
  }
  return value
}

export function sort_by_keys (obj: Record<string, any>, priorities: string[] = []): void {
  const orders = _.fromPairs(priorities.map((k, i) => [k, i + 1]))
  const sorted = _.entries(obj).sort((a, b) => {
    const order_a = orders[a[0]]
    const order_b = orders[b[0]]
    if (order_a != null && order_b != null) return order_a - order_b
    if (order_a != null) return 1
    if (order_b != null) return -1
    return a[0].localeCompare(b[0])
  })
  sorted.forEach(([k, v]) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete obj[k]
    obj[k] = v
  })
}

export function sort_array_by_keys (values: any[], priorities: string[] = []): string[] {
  const orders = _.fromPairs(priorities.map((k, i) => [k, i + 1]))
  return _.clone(values).sort((a, b) => {
    const order_a = orders[a]
    const order_b = orders[b]
    if (order_a != null && order_b != null) return order_a - order_b
    if (order_a != null) return 1
    if (order_b != null) return -1
    return a.localeCompare(b)
  })
}

export function ensure_parent_dir (file_path: string): void {
  fs.mkdirSync(path.dirname(file_path), { recursive: true })
}

export function write_text (file_path: string, text: string): void {
  ensure_parent_dir(file_path)
  fs.writeFileSync(file_path, text)
}

export function read_yaml<T = Record<string, any>> (file_path: string, exclude_schema: boolean = false): T {
  const doc = YAML.parse(fs.readFileSync(file_path, 'utf8'))
  if (typeof doc === 'object' && exclude_schema) delete doc.$schema
  return doc
}

export function write_yaml (file_path: string, content: any): void {
  write_text(file_path, YAML.stringify(
    content,
    {
      lineWidth: 0,
      singleQuote: true,
      aliasDuplicateObjects: false
    }))
}

export function write_json (file_path: string, content: any, replacer?: (this: any, key: string, value: any) => any): void {
  write_text(file_path, JSON.stringify(content, replacer, 2))
}

export async function sleep (ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms))
}
