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
import * as semver from '../_utils/semver'
import _ from 'lodash'

export default class StoryEvaluator {
  private readonly _chapter_evaluator: ChapterEvaluator
  private readonly _supplemental_chapter_evaluator: SupplementalChapterEvaluator

  constructor(chapter_evaluator: ChapterEvaluator, supplemental_chapter_evaluator: SupplementalChapterEvaluator) {
    this._chapter_evaluator = chapter_evaluator
    this._supplemental_chapter_evaluator = supplemental_chapter_evaluator
  }

  async evaluate({ story, display_path, full_path }: StoryFile, version?: string, distribution?: string, dry_run: boolean = false): Promise<StoryEvaluation> {
    if (distribution != undefined && story.distributions?.included !== undefined && story.distributions?.included.length > 0 && !story.distributions.included.includes(distribution)) {
      return {
        result: Result.SKIPPED,
        display_path,
        full_path,
        description: story.description,
        message: `Skipped because distribution ${distribution} is not ${story.distributions.included.length > 1 ? 'one of ' : ''}${story.distributions.included.join(', ')}.`
      }
    }

    if (distribution != undefined && story.distributions?.excluded !== undefined && story.distributions?.excluded.length > 0 && story.distributions.excluded.includes(distribution)) {
      return {
        result: Result.SKIPPED,
        display_path,
        full_path,
        description: story.description,
        message: `Skipped because distribution ${distribution} is ${story.distributions.excluded.length > 1 ? 'one of ' : ''}${story.distributions.excluded.join(', ')}.`
      }
    }

    if (version !== undefined && story.version !== undefined && !semver.satisfies(version, story.version)) {
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
    const chapters = await this.#evaluate_chapters(story.chapters, prologue_errors, dry_run, story_outputs, version, distribution)
    const { evaluations: epilogues } = await this.#evaluate_supplemental_chapters(story.epilogues ?? [], dry_run, story_outputs)

    const result: StoryEvaluation = {
      display_path,
      full_path,
      description: story.description,
      chapters,
      prologues,
      epilogues,
      result: overall_result(prologues.concat(chapters).concat(epilogues).concat(prologues).map(e => e.overall)),
    }

    const warnings = this.#chapter_warnings(story)
    if (warnings !== undefined) {
      result.warnings = warnings
    }

    return result
  }

  #chapter_warnings(story: Story): string[] | undefined {
    const result = _.compact([
      this.#warning_if_mismatched_chapter_paths(story)
    ])
    return result.length > 0 ? result : undefined
  }

  #warning_if_mismatched_chapter_paths(story: Story): string | undefined {
    if (story.warnings?.['multiple-paths-detected'] === false) return
    const paths = _.compact(_.map(story.chapters, (chapter) => {
      if (chapter.warnings?.['multiple-paths-detected'] === false) return
      return chapter.path
    }))
    const normalized_paths = _.map(paths, (path) => path.replaceAll(/\/\{[^}]+}/g, '').replaceAll('//', '/'))
    const paths_counts: Record<string, number> = Object.assign((_.values(_.groupBy(normalized_paths)).map(p => { return { [p[0]] : p.length } })))
    if (paths_counts.length > 1) {
      return `Multiple paths detected, please group similar tests together and move paths not being tested to prologues or epilogues.\n  ${_.join(_.uniq(paths), "\n  ")}\n`
    }
  }

  async #evaluate_chapters(chapters: Chapter[], has_errors: boolean, dry_run: boolean, story_outputs: StoryOutputs, version?: string, distribution?: string): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      if (dry_run) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run' } })
      } else if (distribution != undefined && chapter.distributions?.included !== undefined && chapter.distributions?.included.length > 0 && !chapter.distributions.included.includes(distribution)) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: `Skipped because distribution ${distribution} is not ${chapter.distributions.included.length > 1 ? 'one of ' : ''}${chapter.distributions.included.join(', ')}.` } })
      } else if (distribution != undefined && chapter.distributions?.excluded !== undefined && chapter.distributions?.excluded.length > 0 && chapter.distributions.excluded.includes(distribution)) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: `Skipped because distribution ${distribution} is ${chapter.distributions.excluded.length > 1 ? 'one of ' : ''}${chapter.distributions.excluded.join(', ')}.` } })
      } else if (version != undefined && chapter.version !== undefined && !semver.satisfies(version, chapter.version)) {
        const title = chapter.synopsis || `${chapter.method} ${chapter.path}`
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: `Skipped because version ${version} does not satisfy ${chapter.version}.` } })
      } else {
        const evaluation = await this._chapter_evaluator.evaluate(chapter, has_errors, story_outputs)
        has_errors = has_errors || evaluation.overall.result === Result.ERROR
        if (evaluation.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter_output(chapter.id, evaluation.output)
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
        evaluations.push({ title, overall: { result: Result.SKIPPED, message: 'Dry Run' } })
      } else {
        const { evaluation, evaluation_error } = await this._supplemental_chapter_evaluator.evaluate(chapter, story_outputs)
        has_errors = has_errors || evaluation_error
        if (evaluation.output !== undefined && chapter.id !== undefined) {
          story_outputs.set_chapter_output(chapter.id, evaluation.output)
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
        message: 'The story was defined with incorrect variables.'
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
    StoryEvaluator.#extract_request_variables(chapter.request?.payload ?? {}, variables)
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

  static #extract_request_variables(request: any, variables: Set<OutputReference>): void {
    const request_type = typeof request
    switch (request_type) {
      case 'string': {
        const ref = OutputReference.parse(request as string)
        if (ref !== undefined) {
          variables.add(ref)
        }
        break
      }
      case 'object': {
        if (Array.isArray(request)) {
          for (const value of request) {
            StoryEvaluator.#extract_request_variables(value, variables)
          }
        } else {
          for (const [, value] of Object.entries(request as Record<string, any>)) {
            StoryEvaluator.#extract_request_variables(value, variables)
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
