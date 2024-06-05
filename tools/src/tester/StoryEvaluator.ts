/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import { type Chapter, type Story, type SupplementalChapter } from './types/story.types'
import { type ChapterEvaluation, Result, type StoryEvaluation } from './types/eval.types'
import ChapterEvaluator from './ChapterEvaluator'
import { overall_result } from './helpers'
import ChapterReader from './ChapterReader'

export interface StoryFile {
  display_path: string
  full_path: string
  story: Story
}

export default class StoryEvaluator {
  spec: OpenAPIV3.Document
  dry_run: boolean
  story: Story
  display_path: string
  full_path: string
  has_errors: boolean = false

  constructor (story_file: StoryFile, spec: OpenAPIV3.Document, dry_run?: boolean) {
    this.spec = spec
    this.dry_run = dry_run ?? false
    this.story = story_file.story
    this.display_path = story_file.display_path
    this.full_path = story_file.full_path
  }

  async evaluate (): Promise<StoryEvaluation> {
    if (this.story.skip) {
      return {
        result: Result.SKIPPED,
        display_path: this.display_path,
        full_path: this.full_path,
        description: this.story.description,
        chapters: []
      }
    }
    const prologues = await this.#evaluate_supplemental_chapters(this.story.prologues ?? [])
    const chapters = await this.#evaluate_chapters(this.story.chapters)
    const epilogues = await this.#evaluate_supplemental_chapters(this.story.epilogues ?? [])
    return {
      display_path: this.display_path,
      full_path: this.full_path,
      description: this.story.description,
      chapters,
      prologues,
      epilogues,
      result: overall_result(prologues.concat(chapters).concat(epilogues).concat(prologues).map(e => e.overall))
    }
  }

  async #evaluate_chapters (chapters: Chapter[]): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      if (this.dry_run) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const evaluator = new ChapterEvaluator(chapter, this.spec)
        const evaluation = await evaluator.evaluate(this.has_errors)
        this.has_errors = this.has_errors || evaluation.overall.result === Result.ERROR
        evaluations.push(evaluation)
      }
    }
    return evaluations
  }

  async #evaluate_supplemental_chapters (chapters: SupplementalChapter[]): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      const title = `${chapter.method} ${chapter.path}`
      if (this.dry_run) {
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const response = await new ChapterReader().read(chapter)
        const status = chapter.status ?? [200, 201]
        if (status.includes(response.status)) evaluations.push({ title, overall: { result: Result.PASSED } })
        else {
          this.has_errors = true
          evaluations.push({ title, overall: { result: Result.ERROR, message: response.message, error: response.error as Error } })
        }
      }
    }
    return evaluations
  }
}
