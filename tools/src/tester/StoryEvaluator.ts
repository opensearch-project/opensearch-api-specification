/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterRequest, Parameter, type Chapter, type Story, type SupplementalChapter } from './types/story.types'
import { type StoryFile, type ChapterEvaluation, Result, type StoryEvaluation, OutputReference } from './types/eval.types'
import type ChapterEvaluator from './ChapterEvaluator'
import { overall_result } from './helpers'
import { StoryOutputs } from './StoryOutputs'
import SupplementalChapterEvaluator from './SupplementalChapterEvaluator'
import { ChapterOutput } from './ChapterOutput'
import * as semver from 'semver'

export default class StoryEvaluator {
  private readonly _chapter_evaluator: ChapterEvaluator
  private readonly _supplemental_chapter_evaluator: SupplementalChapterEvaluator

  constructor(chapter_evaluator: ChapterEvaluator, supplemental_chapter_evaluator: SupplementalChapterEvaluator) {
    this._chapter_evaluator = chapter_evaluator
    this._supplemental_chapter_evaluator = supplemental_chapter_evaluator
  }

  async evaluate({ story, display_path, full_path }: StoryFile, version: string, dry_run: boolean = false): Promise<StoryEvaluation> {
    if (story.version !== undefined && !semver.satisfies(version, story.version)) {
      return {
        result: Result.SKIPPED,
        display_path,
        full_path,
        description: story.description,
        message: `Skipped because version ${version} does not satisfy ${story.version}.`
      }
    }

    const variables_error = StoryEvaluator.check_story_variables(story, display_path, full_path)
    if (variables_error !== undefined) {
      return variables_error
    }
    const story_outputs = new StoryOutputs()
    const { evaluations: prologues, has_errors: prologue_errors } = await this.#evaluate_supplemental_chapters(story.prologues ?? [], dry_run, story_outputs)
    const chapters = await this.#evaluate_chapters(story.chapters, prologue_errors, version, dry_run, story_outputs)
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

  async #evaluate_chapters(chapters: Chapter[], has_errors: boolean, version: string, dry_run: boolean, story_outputs: StoryOutputs): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      if (dry_run) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else if (chapter.version !== undefined && !semver.satisfies(version, chapter.version)) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: `Skipped because version ${version} does not satisfy ${chapter.version}.`, error: undefined } })
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

  async #evaluate_supplemental_chapters(chapters: SupplementalChapter[], dry_run: boolean, story_outputs: StoryOutputs): Promise<{ evaluations: ChapterEvaluation[], has_errors: boolean }> {
    let has_errors = false
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      const title = `${chapter.method} ${chapter.path}`
      if (dry_run) {
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run', error: undefined } })
      } else {
        const { evaluation, evaluation_error } = await this._supplemental_chapter_evaluator.evaluate(chapter, story_outputs)
        has_errors = has_errors || evaluation_error
        if (evaluation.output_values?.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter_output(chapter.id, evaluation.output_values?.output)
        }
        evaluations.push(evaluation)
      }
    }
    return { evaluations, has_errors }
  }

  // TODO: Refactor and move this logic into StoryValidator
  static check_story_variables(story: Story, display_path: string, full_path: string): StoryEvaluation | undefined {
    const story_outputs = new StoryOutputs()
    const prologues = (story.prologues ?? []).map((prologue) => {
      return StoryEvaluator.#check_chapter_variables(prologue, story_outputs)
    })
    const chapters = (story.chapters ?? []).map((chapter) => {
      return StoryEvaluator.#check_chapter_variables(chapter, story_outputs)
    })
    const epilogues = (story.epilogues ?? []).map((epilogue) => {
      return StoryEvaluator.#check_chapter_variables(epilogue, story_outputs)
    })
    const evals = prologues.concat(chapters).concat(epilogues)
    if (overall_result(evals.map(e => e.overall)) === Result.FAILED) {
      return {
        result: Result.ERROR,
        display_path,
        full_path,
        description: story.description,
        prologues,
        chapters,
        epilogues,
        message: 'The story was defined with incorrect variables'
      }
    }
  }

  static #check_chapter_variables(chapter: ChapterRequest, story_outputs: StoryOutputs): ChapterEvaluation {
    const title = `${chapter.method} ${chapter.path}`
    const error = StoryEvaluator.#check_used_variables(chapter, story_outputs)
    if (error !== undefined) {
      return error
    }
    if (chapter.id === undefined && chapter.output !== undefined) {
      return this.#failed_evaluation(title, 'A chapter must have an id to store its output')
    }
    if (chapter.id !== undefined && chapter.output !== undefined) {
      story_outputs.set_chapter_output(chapter.id, new ChapterOutput(chapter.output))
    }
    return { title, overall: { result: Result.PASSED } }
  }

  /**
   *
   * @param chapter ChapterEvaluation {
  title: string
  overall: Evaluation
   * @param story_outputs
   * @returns
   */
  static #check_used_variables(chapter: ChapterRequest, story_outputs: StoryOutputs): ChapterEvaluation | undefined {
    const variables = new Set<OutputReference>()
    const title = `${chapter.method} ${chapter.path}`
    StoryEvaluator.#extract_params_variables(chapter.parameters ?? {}, variables)
    StoryEvaluator.#extract_request_body_variables(chapter.request_body?.payload ?? {}, variables)
    for (const { chapter_id, output_name } of variables) {
      if (!story_outputs.has_chapter(chapter_id)) {
        return StoryEvaluator.#failed_evaluation(title, `Chapter makes reference to non existent chapter "${chapter_id}`)
      }
      if (!story_outputs.has_output_value(chapter_id, output_name)) {
        return StoryEvaluator.#failed_evaluation(title, `Chapter makes reference to non existent output "${output_name}" in chapter "${chapter_id}"`)
      }
    }
  }

  static #extract_params_variables(parameters: Record<string, Parameter>, variables: Set<OutputReference>): void {
    Object.values(parameters ?? {}).forEach((param) => {
      if (typeof param === 'string') {
        const ref = OutputReference.parse(param)
        if (ref) {
          variables.add(ref)
        }
      }
    })
  }

  static #extract_request_body_variables(request_body: any, variables: Set<OutputReference>): void {
    const request_body_type = typeof request_body
    switch (request_body_type) {
      case 'string': {
        const ref = OutputReference.parse(request_body as string)
        if (ref !== undefined) {
          variables.add(ref)
        }
        break
      }
      case 'object': {
        if (Array.isArray(request_body)) {
          for (const value of request_body) {
            StoryEvaluator.#extract_request_body_variables(value, variables)
          }
        } else {
          for (const [, value] of Object.entries(request_body as Record<string, any>)) {
            StoryEvaluator.#extract_request_body_variables(value, variables)
          }
        }
        break
      }
      default: {
        break
      }
    }
  }

  static #failed_evaluation(title: string, message: string): ChapterEvaluation {
    return { title, overall: { result: Result.FAILED, message } }
  }
}
