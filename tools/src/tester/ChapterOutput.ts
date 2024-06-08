/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

export class ChapterOutput {
  private outputs: Record<string, any>
  constructor (outputs: Record<string, any>) {
    this.outputs = outputs
  }

  get_output (name: string): any {
    return this.outputs[name]
  }

  set_output (name: string, value: any): void {
    this.outputs[name] = value
  }
}
