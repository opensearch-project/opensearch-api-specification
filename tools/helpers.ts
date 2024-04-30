import fs from 'fs'
import YAML from 'yaml'
import _ from 'lodash'

export function resolveRef (ref: string, root: Record<string, any>): Record<string, any> | undefined {
  const paths = ref.replace('#/', '').split('/')
  for (const p of paths) {
    root = root[p]
    if (root === undefined) break
  }
  return root
}

export function resolveObj (obj: Record<string, any> | undefined, root: Record<string, any>) {
  if (obj === undefined) return undefined
  if (obj.$ref) return resolveRef(obj.$ref, root)
  return obj
}

export function dig (obj: Record<string, any>, path: string[], root: Record<string, any>): any {
  let value = obj
  for (const p of path) {
    value = resolveObj(value, root)?.[p]
    if (value === undefined) break
  }
  return value
}

export function sortByKey (obj: Record<string, any>, priorities: string[] = []) {
  const orders = _.fromPairs(priorities.map((k, i) => [k, i + 1]))
  const sorted = _.entries(obj).sort((a, b) => {
    const order_a = orders[a[0]]
    const order_b = orders[b[0]]
    if (order_a && order_b) return order_a - order_b
    if (order_a) return 1
    if (order_b) return -1
    return a[0].localeCompare(b[0])
  })
  sorted.forEach(([k, v]) => {
    delete obj[k]
    obj[k] = v
  })
}

export function write2file (file_path: string, content: Record<string, any>): void {
  fs.writeFileSync(file_path, quoteRefs(YAML.stringify(removeAnchors(content), { lineWidth: 0, singleQuote: true })))
}

function quoteRefs (str: string): string {
  return str.split('\n').map((line) => {
    if (line.includes('$ref')) {
      const [key, value] = line.split(': ')
      if (!value.startsWith("'")) line = `${key}: '${value}'`
    }
    return line
  }).join('\n')
}

function removeAnchors (content: Record<string, any>): Record<string, any> {
  const replacer = (key: string, value: any) => key === '$anchor' ? undefined : value
  return JSON.parse(JSON.stringify(content, replacer))
}
