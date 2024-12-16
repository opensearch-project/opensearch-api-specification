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

  private constructor(chapter_id: string, output_name: string) {
    this.chapter_id = chapter_id
    this.output_name = output_name
  }

  static parse(str: string): OutputReference[] {
    const pattern = /\$\{([^}]+)\}/g
    let match
    var result = []
    while ((match = pattern.exec(str)) !== null) {
      const spl = this.#split(match[1], '.', 2)
      result.push(new OutputReference(spl[0], spl[1]))
    }
    return result
  }

  static replace(str: string, callback: (chapter_id: any, variable: any) => string): any {
    // preserve type if 1 value is returned
    let full_match = str.match(/^\$\{([^}]+)\}$/)
    if (full_match) {
      const spl = this.#split(full_match[1], '.', 2)
      return callback(spl[0], spl[1])
    } else return str.replace(/\$\{([^}]+)\}/g, (_, k) => {
      const spl = this.#split(k, '.', 2)
      return callback(spl[0], spl[1])
    });
  }

  static #split(str: any, delim: string, count: number): string[] {
    if (str === undefined) return [str]
    if (count <= 0) return [str]
    const parts = str.split(delim)
    if (parts.length <= count) return parts
    const result = parts.slice(0, count - 1)
    result.push(parts.slice(count - 1).join(delim))
    return result
  }
}
