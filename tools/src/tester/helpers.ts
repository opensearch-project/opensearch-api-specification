/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterOutput } from './ChapterOutput'
import { type Evaluation, Result, type EvaluationWithOutput } from './types/eval.types'
import { type ActualResponse, type Output } from './types/story.types'
import _ from 'lodash'

export function overall_result(evaluations: Evaluation[]): Result {
  if (evaluations.some(e => e.result === Result.ERROR)) return Result.ERROR
  if (evaluations.some(e => e.result === Result.FAILED)) return Result.FAILED
  if (evaluations.some(e => e.result === Result.SKIPPED)) return Result.SKIPPED
  return Result.PASSED
}

export function extract_output_values(response: ActualResponse, chapter_output?: Output): EvaluationWithOutput | undefined {
  if (!chapter_output) return undefined
  const output = new ChapterOutput({})
  for (const [name, path] of Object.entries(chapter_output)) {
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
    output.set_output(name, value)
  }
  return { result: Result.PASSED, output }
}
