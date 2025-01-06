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
import { ParsedStory } from './parsed_story.types';

export interface StoryFile {
  display_path: string
  full_path: string
  story: ParsedStory
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
  pending?: string,
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
  IGNORED = 'IGNORED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
}
