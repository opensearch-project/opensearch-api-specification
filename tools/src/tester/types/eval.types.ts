/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type ChapterOutput } from '../ChapterOutput'
import { StoryOutputs } from '../StoryOutputs'

export type LibraryEvaluation = StoryEvaluation[]

export interface StoryEvaluation {
  result: Result
  display_path: string
  full_path: string
  description: string
  message?: string
  chapters: ChapterEvaluation[]
  epilogues?: ChapterEvaluation[]
  prologues?: ChapterEvaluation[]
}

export interface ChapterEvaluation {
  title: string
  overall: Evaluation
  request?: {
    parameters?: Record<string, Evaluation>
    request_body?: Evaluation
  }
  response?: {
    status: Evaluation
    payload: Evaluation
  }
  output_values?: EvaluationWithOutput
}

export class ChaptersEvaluations {
  evaluations: ChapterEvaluation[]
  outputs: StoryOutputs
  constructor () {
    this.evaluations = []
    this.outputs = new StoryOutputs()
  }
}

export interface Evaluation {
  result: Result
  message?: string
  error?: Error | string
}

export type EvaluationWithOutput = Evaluation & {
  output?: ChapterOutput
}

export enum Result {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
}

export class OutputReference {
  chapter_id: string
  output_name: string
  private constructor (chapter_id: string, output_name: string) {
    this.chapter_id = chapter_id
    this.output_name = output_name
  }

  static parse (str: string): OutputReference | undefined {
    if (str.startsWith('${') && str.endsWith('}')) {
      const spl = str.slice(2, -1).split('.', 2)
      return { chapter_id: spl[0], output_name: spl[1] }
    }
    return undefined
  }
}
