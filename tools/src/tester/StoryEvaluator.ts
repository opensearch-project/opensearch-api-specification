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
import { check_story_variables, extract_output_values, overall_result } from './helpers'
import { StoryOutputs } from './StoryOutputs'

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
    const variables_error = check_story_variables(story)
    if (variables_error !== undefined) {
      return {
        result: Result.ERROR,
        display_path,
        full_path,
        description: story.description,
        chapters: [],
        message: variables_error
      }
    }
    const story_outputs = new StoryOutputs()
    const { evaluations: prologues, has_errors: prologue_errors } = await this.#evaluate_supplemental_chapters(story.prologues ?? [], dry_run, story_outputs)
    const chapters = await this.#evaluate_chapters(story.chapters, prologue_errors, dry_run, story_outputs)
    const { evaluations: epilogues } = await this.#evaluate_supplemental_chapters(story.epilogues ?? [], dry_run, story_outputs)
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

  async #evaluate_chapters (chapters: Chapter[], has_errors: boolean, dry_run: boolean, story_outputs: StoryOutputs): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      if (dry_run) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const evaluation = await this._chapter_evaluator.evaluate(chapter, has_errors, story_outputs)
        has_errors = has_errors || evaluation.overall.result === Result.ERROR
        if (evaluation.output_values?.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter_output(chapter.id, evaluation.output_values?.output)
        }
        evaluations.push(evaluation)
      }
    }
    return evaluations
  }

  async #evaluate_supplemental_chapters (chapters: SupplementalChapter[], dry_run: boolean, story_outputs: StoryOutputs): Promise<{ evaluations: ChapterEvaluation[], has_errors: boolean }> {
    let has_errors = false
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      const title = `${chapter.method} ${chapter.path}`
      if (dry_run) {
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const {evaluation, evaluation_error} = await this.evaluate_supplemental_chapter(chapter, story_outputs)
        has_errors = has_errors || evaluation_error
        if (evaluation.output_values?.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter_output(chapter.id, evaluation.output_values?.output)
        }
        evaluations.push(evaluation)
      }
    }
    return { evaluations, has_errors }
  }

  async evaluate_supplemental_chapter (chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<{ evaluation: ChapterEvaluation, evaluation_error: boolean} > {
    const title = `${chapter.method} ${chapter.path}`
    const response = await this._chapter_reader.read(chapter, story_outputs)
    const status = chapter.status ?? [200, 201]
    const output_values = extract_output_values(response)
    let response_evaluation: ChapterEvaluation
    const passed_evaluation = { title, overall: { result: Result.PASSED } }
    if (status.includes(response.status)) {
      response_evaluation = passed_evaluation
    } else {
      response_evaluation = { title, overall: { result: Result.ERROR, message: response.message, error: response.error as Error }, output_values }
    }
    if (output_values) {
      response_evaluation.output_values = output_values
    }
    const result = overall_result([response_evaluation.overall].concat(output_values ? [output_values] : []))
    if (result === Result.PASSED) {
      return {evaluation: passed_evaluation, evaluation_error: false}
    } else {
      const message_segments = []
      if (response_evaluation.overall.result === Result.ERROR) {
        message_segments.push(`${response_evaluation.overall.message}`)
      }
      if (output_values !== undefined && output_values.result === Result.ERROR) {
        message_segments.push(`${output_values.message}`)
      }
      const message = message_segments.join('\n')
      const evaluation = {
        title,
        overall: { result: Result.ERROR, message, error: response.error as Error },
        ...(output_values ? { output_values } : {})
      }
      return {evaluation, evaluation_error: true}
    }
  }

}
