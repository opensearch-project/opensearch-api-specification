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

  get(name: string): any {
    return this.outputs[name]
  }

  set(name: string, value: any): void {
    this.outputs[name] = value
  }

  static extract_output_values(response: ActualResponse, output?: Output): EvaluationWithOutput {
    if (!output) return { evaluation: { result: Result.SKIPPED } }
    const chapter_output = new ChapterOutput({})
    for (const [name, output_value] of Object.entries(output)) {
      const [path, default_value] = (typeof output_value === 'string')
        ? [output_value, undefined]
        : [output_value.path, output_value.default]
      let value: any
      if (path == 'payload' || path.startsWith('payload.') || path.match(/^payload\[\d*\]/)) {
        if (response.payload === undefined) {
          return { evaluation: { result: Result.ERROR, message: 'No payload found in response, but expected output: ' + path } }
        }
        value = _.get(response, path)
        if (value === undefined) value = default_value
        if (value === undefined) {
          return { evaluation: { result: Result.ERROR, message: `Expected to find non undefined value at \`${path}\`.` } }
        }
      } else {
        return { evaluation: { result: Result.ERROR, message: `Unknown output source: ${path.split('.')[0]}.` } }
      }
      chapter_output.set(name, value)
    }
    return { evaluation: { result: Result.PASSED }, output: chapter_output }
  }
}
