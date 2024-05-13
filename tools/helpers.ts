import fs from 'fs'
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
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete obj[k]
    obj[k] = v
  })
}

export function read_yaml (file_path: string, exclude_schema: boolean = false): Record<string, any> {
  const doc = YAML.parse(fs.readFileSync(file_path, 'utf8'))
  if (exclude_schema) delete doc.$schema
  return doc
}

export function write_yaml (file_path: string, content: Record<string, any>): void {
  fs.writeFileSync(file_path, quote_refs(YAML.stringify(remove_anchors(content), { lineWidth: 0, singleQuote: true })))
}

function quote_refs (str: string): string {
  return str.split('\n').map((line) => {
    if (line.includes('$ref')) {
      const [key, value] = line.split(': ')
      if (!value.startsWith("'")) line = `${key}: '${value}'`
    }
    return line
  }).join('\n')
}

function remove_anchors (content: Record<string, any>): Record<string, any> {
  const replacer = (key: string, value: any): any => key === '$anchor' ? undefined : value
  return JSON.parse(JSON.stringify(content, replacer))
}
