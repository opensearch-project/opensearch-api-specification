/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import NamespaceFile from './NamespaceFile'
import { type ValidationError } from 'types'
import FolderValidator from './base/FolderValidator'
import _ from 'lodash'

export default class NamespacesFolder extends FolderValidator<NamespaceFile> {
  constructor (folder_path: string) {
    super(folder_path, NamespaceFile)
  }

  validate_folder (): ValidationError[] {
    return this.validate_duplicate_paths()
  }

  validate_duplicate_paths (): ValidationError[] {
    const paths: Record<string, [{ path: string, namespace: string }]> = {}
    for (const file of this.files) {
      if (file.spec().paths == null) continue
      Object.keys(file.spec().paths).sort().forEach((path) => {
        const normalized_path = path.replaceAll(/\{[^}]+}/g, '{}')
        const path_entry = {
          path,
          namespace: file.namespace
        }
        if (paths[normalized_path] == null) {
          paths[normalized_path] = [path_entry]
        } else {
          paths[normalized_path].push(path_entry)
        }
      })
    }
    return Object.entries(paths).map(([_normalized_path, namespaces]) => {
      if (namespaces.length > 1) {
        const dup_paths = _.uniq(_.map(namespaces, (entry) => { return `'${entry.path}'` }))
        const dup_namespaces = _.uniq(_.map(namespaces, (entry) => entry.namespace))
        return this.error(`Duplicate path${dup_paths.length > 1 ? 's' : ''} ${_.join(dup_paths, ', ')} found in namespace${dup_namespaces.length > 1 ? 's' : ''}: ${_.join(dup_namespaces, ', ')}.`)
      }
    }).filter((e) => e) as ValidationError[]
  }
}
