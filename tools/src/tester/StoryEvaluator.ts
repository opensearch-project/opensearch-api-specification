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
import ChapterEvaluator from './ChapterEvaluator'
import type ChapterReader from './ChapterReader'
import SharedResources from './SharedResources'
import { check_story_variables, extract_output_values, overall_result } from './helpers'
import { StoryOutputs } from './StoryOutputs'

export interface StoryFile {
  display_path: string
  full_path: string
  story: Story
}

export default class StoryEvaluator {
  dry_run: boolean
  story: Story
  display_path: string
  full_path: string
  has_errors: boolean = false
  chapter_reader: ChapterReader

  constructor (story_file: StoryFile, dry_run?: boolean) {
    this.dry_run = dry_run ?? false
    this.story = story_file.story
    this.display_path = story_file.display_path
    this.full_path = story_file.full_path
    this.chapter_reader = SharedResources.get_instance().chapter_reader
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
    const variables_error = check_story_variables(this.story)
    if (variables_error !== undefined) {
      return {
        result: Result.ERROR,
        display_path: this.display_path,
        full_path: this.full_path,
        description: this.story.description,
        chapters: [],
        message: variables_error
      }
    }
    const story_outputs = new StoryOutputs()
    const prologues = await this.#evaluate_supplemental_chapters(this.story.prologues ?? [], story_outputs)
    const chapters = await this.#evaluate_chapters(this.story.chapters, story_outputs)
    const epilogues = await this.#evaluate_supplemental_chapters(this.story.epilogues ?? [], story_outputs)
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

  async #evaluate_chapters (chapters: Chapter[], story_outputs: StoryOutputs): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      if (this.dry_run) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const evaluator = new ChapterEvaluator(chapter)
        const evaluation = await evaluator.evaluate(this.has_errors, story_outputs)
        this.has_errors = this.has_errors || evaluation.overall.result === Result.ERROR
        if (evaluation.output_values?.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter(chapter.id, evaluation.output_values?.output)
        }
        evaluations.push(evaluation)
      }
    }
    return evaluations
  }

  async #evaluate_supplemental_chapters (chapters: SupplementalChapter[], story_outputs: StoryOutputs): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      const title = `${chapter.method} ${chapter.path}`
      if (this.dry_run) {
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const evaluation = await this.evaluate_supplemental_chapter(chapter, story_outputs)
        if (evaluation.output_values?.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter(chapter.id, evaluation.output_values?.output)
        }
        evaluations.push(evaluation)
      }
    }
    return evaluations
  }

  async evaluate_supplemental_chapter (chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<ChapterEvaluation> {
    const title = `${chapter.method} ${chapter.path}`
    const response = await this.chapter_reader.read(chapter, story_outputs)
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
      return passed_evaluation
    } else {
      this.has_errors = true
      const message_segments = []
      if (response_evaluation.overall.result === Result.ERROR) {
        message_segments.push(`${response_evaluation.overall.message}`)
      }
      if (output_values !== undefined && output_values.result === Result.ERROR) {
        message_segments.push(`${output_values.message}`)
      }
      const message = message_segments.join('\n')
      return {
        title,
        overall: { result: Result.ERROR, message, error: response.error as Error },
        ...(output_values ? { output_values } : {})
      }
    }
  }
}
