/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type Chapter, type Story, type SupplementalChapter } from './types/story.types'
import { type ChapterEvaluation, Result, type StoryEvaluation } from './types/eval.types'
import type ChapterEvaluator from './ChapterEvaluator'
import type ChapterReader from './ChapterReader'
import { overall_result } from './helpers'

export interface StoryFile {
  display_path: string
  full_path: string
  story: Story
}

export default class StoryEvaluator {
  private readonly _chapter_reader: ChapterReader
  private readonly _chapter_evaluator: ChapterEvaluator

  constructor (chapter_reader: ChapterReader, chapter_evaluator: ChapterEvaluator) {
    this._chapter_reader = chapter_reader
    this._chapter_evaluator = chapter_evaluator
  }

  async evaluate ({ story, display_path, full_path }: StoryFile, dry_run: boolean = false): Promise<StoryEvaluation> {
    if (story.skip) {
      return {
        result: Result.SKIPPED,
        display_path,
        full_path,
        description: story.description,
        chapters: []
      }
    }
    const { evaluations: prologues, has_errors: prologue_errors } = await this.#evaluate_supplemental_chapters(story.prologues ?? [], dry_run)
    const chapters = await this.#evaluate_chapters(story.chapters, prologue_errors, dry_run)
    const { evaluations: epilogues } = await this.#evaluate_supplemental_chapters(story.epilogues ?? [], dry_run)
    return {
      display_path,
      full_path,
      description: story.description,
      chapters,
      prologues,
      epilogues,
      result: overall_result(prologues.concat(chapters).concat(epilogues).concat(prologues).map(e => e.overall))
    }
  }

  async #evaluate_chapters (chapters: Chapter[], has_errors: boolean, dry_run: boolean): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      if (dry_run) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const evaluation = await this._chapter_evaluator.evaluate(chapter, has_errors)
        has_errors = has_errors || evaluation.overall.result === Result.ERROR
        evaluations.push(evaluation)
      }
    }
    return evaluations
  }

  async #evaluate_supplemental_chapters (chapters: SupplementalChapter[], dry_run: boolean): Promise<{ evaluations: ChapterEvaluation[], has_errors: boolean }> {
    let has_errors = false
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      const title = `${chapter.method} ${chapter.path}`
      if (dry_run) {
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const response = await this._chapter_reader.read(chapter)
        const status = chapter.status ?? [200, 201]
        if (status.includes(response.status)) evaluations.push({ title, overall: { result: Result.PASSED } })
        else {
          has_errors = true
          evaluations.push({ title, overall: { result: Result.ERROR, message: response.message, error: response.error as Error } })
        }
      }
    }
    return { evaluations, has_errors }
  }
}
