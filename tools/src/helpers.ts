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

export function delete_matching_keys(obj: any, condition: (obj: any) => boolean): void {
  for (const key in obj) {
    var item = obj[key]

    if (_.isObject(item)) {
      if (condition(item)) {
        delete obj[key]
      } else {
        delete_matching_keys(item, condition)
        if (_.isArray(item)) {
          obj[key] = _.compact(item)
        }
      }
    }
  }
}

export function find_refs (current: Record<string, any>, root?: Record<string, any>, call_stack: string[] = []): Set<string> {
  var results = new Set<string>()

  if (root === undefined) {
    root = current
    current = current.paths
  }

  if (current?.$ref != null) {
    const ref = current.$ref as string
    results.add(ref)
    const ref_node = resolve_ref(ref, root)
    if (ref_node !== undefined && !call_stack.includes(ref)) {
      call_stack.push(ref)
      find_refs(ref_node, root, call_stack).forEach((ref) => results.add(ref))
    }
  }

  if (_.isObject(current)) {
    _.forEach(current, (v) => {
      find_refs(v as Record<string, any>, root, call_stack).forEach((ref) => results.add(ref));
    })
  }

  return results
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
  const doc = new YAML.Document(content, null, { aliasDuplicateObjects: false })

  YAML.visit(doc, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Scalar(_, node) {
      if (typeof node.value === 'string') {
        const value = node.value.toLowerCase();
        // Ensure "human" boolean string values are quoted as old YAML parsers might coerce them to boolean true/false
        if (value === 'no' || value === 'yes' || value === 'n' || value === 'y' || value === 'off' || value === 'on') {
          node.type = 'QUOTE_SINGLE'
        }
      }
    }
  })

  write_text(file_path, doc.toString({
    lineWidth: 0,
    singleQuote: true
  }))
}

export function to_json(content: any, replacer?: (this: any, key: string, value: any) => any): string {
  return JSON.stringify(content, replacer, 2)
}

export function to_ndjson(content: any[]): string {
  return _.join(_.map(content, JSON.stringify), "\n") + "\n"
}

export function write_json (file_path: string, content: any, replacer?: (this: any, key: string, value: any) => any): void {
  write_text(file_path, to_json(content, replacer))
}

export async function sleep (ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * Returns a string split using a delimiter, but only up to a certain number of times,
 * returning the remainder of the string as the last element if the result.
 *
 * @param str a string
 * @param delim delimiter
 * @param count max number of splits
 * @returns an array of strings
 */
export function split(str: any, delim: string, count: number = 0): string[] {
  if (str === undefined) return []
  const parts = str.split(delim)
  if (count <= 0 || parts.length <= count) return parts
  const result = parts.slice(0, count - 1)
  result.push(parts.slice(count - 1).join(delim))
  return result
}
