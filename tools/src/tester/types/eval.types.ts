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
import YAML from 'yaml'

export interface StoryFile {
  display_path: string
  full_path: string
  story: Story
}

export interface Operation {
  method: string
  path: string
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
  warnings?: string[]
}

export interface StoryEvaluations {
  evaluations: StoryEvaluation[]
}

export interface ChapterEvaluation {
  title: string,
  overall: Evaluation,
  operation?: Operation,
  path?: string,
  request?: {
    parameters?: Record<string, Evaluation>
    request?: Evaluation
  }
  response?: {
    status: Evaluation
    payload_body: Evaluation,
    payload_schema: Evaluation
    output_values: Evaluation
  },
  retries?: number,
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
  default_value?: string
  private constructor (chapter_id: string, output_name: string, default_value?: string) {
    this.chapter_id = chapter_id
    this.output_name = output_name
    this.default_value = default_value
  }

  static parse (str: string): OutputReference | undefined {
    if (str.startsWith('${') && str.endsWith('}')) {
      const spl = str.slice(2, -1).replaceAll(' ', '').split('.', 2)
      const rhs = spl[1].split('?', 2)
      let default_value = rhs.length >= 2 && rhs[1] !== undefined ? YAML.parse(rhs[1]) : undefined
      return { chapter_id: spl[0], output_name: rhs[0], default_value }
    }
    return undefined
  }
}
