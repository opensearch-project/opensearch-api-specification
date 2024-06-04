/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import SchemaFile from './SchemaFile'
import FolderValidator from './base/FolderValidator'
import { type ValidationError } from 'types'

export default class SchemasFolder extends FolderValidator<SchemaFile> {
  constructor (folder_path: string) {
    super(folder_path, SchemaFile)
  }

  validate_folder (): ValidationError[] {
    return []
  }
}
