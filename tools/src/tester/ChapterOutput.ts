/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { EvaluationWithOutput, Result } from './types/eval.types'
import { ActualResponse, type Output } from './types/story.types'
import _ from 'lodash'

export class ChapterOutput {
  private outputs: Record<string, any>

  constructor(outputs: Record<string, any>) {
    this.outputs = outputs
  }

  get_output(name: string): any {
    return this.outputs[name]
  }

  set_output(name: string, value: any): void {
    this.outputs[name] = value
  }

  static extract_output_values(response: ActualResponse, output?: Output): EvaluationWithOutput | undefined {
    if (!output) return undefined
    const chapter_output = new ChapterOutput({})
    for (const [name, path] of Object.entries(output)) {
      const [source, ...rest] = path.split('.')
      const keys = rest.join('.')
      let value: any
      if (source === 'payload') {
        if (response.payload === undefined) {
          return { result: Result.ERROR, message: 'No payload found in response, but expected output: ' + path }
        }
        value = keys.length === 0 ? response.payload : _.get(response.payload, keys)
        if (value === undefined) {
          return { result: Result.ERROR, message: `Expected to find non undefined value at \`${path}\`.` }
        }
      } else {
        return { result: Result.ERROR, message: 'Unknown output source: ' + source }
      }
      chapter_output.set_output(name, value)
    }
    return { result: Result.PASSED, output: chapter_output }
  }
}
