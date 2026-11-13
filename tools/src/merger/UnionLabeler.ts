/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import UnionClassifier from './UnionClassifier'

export interface UnionLabels {
  counts: Record<string, number>
  unclassified: string[]
}

// Writes the classification of every oneOf/anyOf in a bundled spec as vendor extensions, so that client generators
// read it instead of each re-implementing the classifier:
// - x-union-kind: the kind of union (see UnionClassifier)
// - x-variant-keys: for containers, the property that selects each branch, in branch order
// Unions that cannot be classified are left unlabeled and reported. Running it again replaces earlier labels.
export default class UnionLabeler {
  label (spec: Record<string, any>): UnionLabels {
    const classifier = new UnionClassifier((spec.components?.schemas ?? {}) as Record<string, any>)
    const result: UnionLabels = { counts: {}, unclassified: [] }
    // Classify everything first, then write the labels, so that labels never change the input of a classification.
    const labels: Array<{ node: Record<string, any>, kind: string, variant_keys?: string[] }> = []

    const visit = (node: any, location: string, all_of_siblings?: any[]): void => {
      if (Array.isArray(node)) {
        node.forEach((item, index) => { visit(item, `${location}/${index}`) })
        return
      }
      if (!_.isPlainObject(node)) return

      if (node.oneOf !== undefined || node.anyOf !== undefined) {
        // Labels from an earlier run may be stale (e.g. after the version extractor removed branches).
        delete node['x-union-kind']
        delete node['x-variant-keys']
        const object_part = all_of_siblings === undefined ? undefined : this.object_part(classifier, node, all_of_siblings)
        const { kind, variant_keys } = classifier.classify(node as Record<string, any>, object_part)
        if (kind === undefined) {
          result.unclassified.push(location)
        } else {
          labels.push({ node, kind, variant_keys })
          result.counts[kind] = (result.counts[kind] ?? 0) + 1
        }
      }

      for (const [key, value] of Object.entries(node as Record<string, any>)) {
        const child = `${location}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`
        if (key === 'allOf' && Array.isArray(value)) value.forEach((member, index) => { visit(member, `${child}/${index}`, value) })
        else visit(value, child)
      }
    }

    visit(spec.components, '#/components')
    visit(spec.paths, '#/paths')
    for (const { node, kind, variant_keys } of labels) {
      node['x-union-kind'] = kind
      if (variant_keys !== undefined) node['x-variant-keys'] = variant_keys
    }
    return result
  }

  // The properties of the allOf members next to a union member: what a presence constraint may require.
  object_part (classifier: UnionClassifier, union: any, siblings: any[]): { properties: Record<string, any> } {
    const properties: Record<string, any> = {}
    for (const sibling of siblings) {
      if (sibling === union || sibling.oneOf !== undefined || sibling.anyOf !== undefined) continue
      Object.assign(properties, classifier.resolve(sibling).properties)
    }
    return { properties }
  }
}
