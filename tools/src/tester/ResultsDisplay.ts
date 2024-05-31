/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type ChapterEvaluation, type Evaluation, Result, type StoryEvaluation } from './types/eval.types'
import { overall_result } from './helpers'
import * as ansi from './Ansi'

export interface DisplayOptions {
  tab_width?: number
  verbose?: boolean
}

export default class ResultsDisplay {
  private readonly _tab_width: number
  private readonly _verbose: boolean

  constructor (opts: DisplayOptions) {
    this._tab_width = opts.tab_width ?? 4
    this._verbose = opts.verbose ?? false
  }

  display (evaluation: StoryEvaluation): void {
    this.#display_story(evaluation)
    this.#display_chapters(evaluation.prologues ?? [], 'PROLOGUES')
    this.#display_chapters(evaluation.chapters ?? [], 'CHAPTERS')
    this.#display_chapters(evaluation.epilogues ?? [], 'EPILOGUES')
    console.log('\n')
  }

  #display_story ({ result, full_path, description, display_path }: StoryEvaluation): void {
    this.#display_evaluation({ result, message: full_path }, ansi.cyan(ansi.b(description ?? display_path)))
  }

  #display_chapters (evaluations: ChapterEvaluation[], title: string): void {
    if (evaluations.length === 0) return
    const result = overall_result(evaluations.map(e => e.overall))
    if (!this._verbose && (result === Result.SKIPPED || result === Result.PASSED)) return
    this.#display_evaluation({ result }, title, this._tab_width)
    for (const evaluation of evaluations) this.#display_chapter(evaluation)
  }

  #display_chapter (chapter: ChapterEvaluation): void {
    this.#display_evaluation(chapter.overall, ansi.i(chapter.title), this._tab_width * 2)
    this.#display_parameters(chapter.request?.parameters ?? {})
    this.#display_request_body(chapter.request?.request_body)
    this.#display_status(chapter.response?.status)
    this.#display_payload(chapter.response?.payload)
  }

  #display_parameters (parameters: Record<string, Evaluation>): void {
    if (Object.keys(parameters).length === 0) return
    const result = overall_result(Object.values(parameters))
    this.#display_evaluation({ result }, 'PARAMETERS', this._tab_width * 3)
    for (const [name, evaluation] of Object.entries(parameters)) {
      this.#display_evaluation(evaluation, name, this._tab_width * 4)
    }
  }

  #display_request_body (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#display_evaluation(evaluation, 'REQUEST BODY', this._tab_width * 3)
  }

  #display_status (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#display_evaluation(evaluation, 'RESPONSE STATUS', this._tab_width * 3)
  }

  #display_payload (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#display_evaluation(evaluation, 'RESPONSE PAYLOAD', this._tab_width * 3)
  }

  #display_evaluation (evaluation: Evaluation, title: string, prefix: number = 0): void {
    const result = ansi.padding(this.#result(evaluation.result), 0, prefix)
    const message = evaluation.message != null ? `${ansi.gray('(' + evaluation.message + ')')}` : ''
    console.log(`${result} ${title} ${message}`)
    if (evaluation.error && this._verbose) {
      console.log('-'.repeat(100))
      console.error(evaluation.error)
      console.log('-'.repeat(100))
    }
  }

  #result (r: Result): string {
    const text = ansi.padding(r, 7)
    switch (r) {
      case Result.PASSED: return ansi.green(text)
      case Result.SKIPPED: return ansi.yellow(text)
      case Result.FAILED: return ansi.magenta(text)
      case Result.ERROR: return ansi.red(text)
      default: return ansi.gray(text)
    }
  }
}
