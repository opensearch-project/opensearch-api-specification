/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type Output } from './types/story.types'

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

  /**
   * Creates a dummy ChapterOutput from an Output object
   * where the values will be the response paths.
   * Used for a validation check.
   * @param output
   * @returns
   */
  static create_dummy_from_output (output: Output): ChapterOutput {
    return new ChapterOutput(output)
  }
}
