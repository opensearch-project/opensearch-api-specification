/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

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
}

export interface Evaluation {
  result: Result
  message?: string
  error?: Error
}

export enum Result {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
}
