/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type HttpVerb, type OperationPath, type SupersededOperationMap } from 'types'
import { read_yaml, write_yaml } from '../../helpers'

// One-time script to generate _superseded_operations.yaml file for OpenDistro
// Keeping this for now in case we need to update the file in the near future. Can be removed after a few months.
// TODO: Remove this file in 2025.
export default class OpenDistro {
  input: Record<OperationPath, HttpVerb[]>
  output: SupersededOperationMap = {}

  constructor (file_path: string) {
    this.input = read_yaml(file_path)
    this.build_output()
    write_yaml(file_path, this.output)
  }

  build_output (): void {
    for (const [path, operations] of Object.entries(this.input)) {
      const replaced_by = path.replace('_opendistro', '_plugins')
      this.output[path] = { superseded_by: replaced_by, operations }
    }
  }
}
