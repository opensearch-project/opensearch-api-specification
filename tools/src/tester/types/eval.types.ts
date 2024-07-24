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
import type { Story } from "./story.types";

export interface StoryFile {
  display_path: string
  full_path: string
  story: Story
}

export interface StoryEvaluation {
  result: Result
  display_path: string
  full_path: string
  description: string
  message?: string
  chapters?: ChapterEvaluation[]
  epilogues?: ChapterEvaluation[]
  prologues?: ChapterEvaluation[]
}

export interface StoryEvaluations {
  evaluations: StoryEvaluation[]
}

export interface ChapterEvaluation {
  title: string,
  overall: Evaluation,
  path?: string,
  request?: {
    parameters?: Record<string, Evaluation>
    request_body?: Evaluation
  }
  response?: {
    status: Evaluation
    payload_body: Evaluation,
    payload_schema: Evaluation
    output_values: Evaluation
  },
  output?: ChapterOutput
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

export type EvaluationWithOutput = {
  evaluation: Evaluation,
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
