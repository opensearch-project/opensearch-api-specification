/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type StoryEvaluations, type ChapterEvaluation, type Evaluation, Result, type StoryEvaluation } from './types/eval.types'
import { overall_result } from './helpers'
import * as ansi from './Ansi'
import _ from 'lodash'
import MergedOpenApiSpec from './MergedOpenApiSpec'

export interface ResultLogger {
  log: (evaluation: StoryEvaluation) => void
  log_coverage: (_spec: MergedOpenApiSpec, evaluations: StoryEvaluations) => void
}

export class NoOpResultLogger implements ResultLogger {
  log (_: StoryEvaluation): void { }
  log_coverage(_spec: MergedOpenApiSpec, _evaluations: StoryEvaluations): void { }
}

export class ConsoleResultLogger implements ResultLogger {
  private readonly _tab_width: number
  private readonly _verbose: boolean

  constructor (tab_width: number = 4, verbose: boolean = false) {
    this._tab_width = tab_width
    this._verbose = verbose
  }

  log (evaluation: StoryEvaluation): void {
    const with_padding = [Result.FAILED, Result.ERROR].includes(evaluation.result) || this._verbose
    if (with_padding) console.log()
    this.#log_story(evaluation)
    this.#log_chapters(evaluation.prologues ?? [], 'PROLOGUES')
    this.#log_chapters(evaluation.chapters ?? [], 'CHAPTERS')
    this.#log_chapters(evaluation.epilogues ?? [], 'EPILOGUES')
    if (with_padding) console.log()
  }

  log_coverage(spec: MergedOpenApiSpec, evaluations: StoryEvaluations): void {
    const evaluated_paths = _.uniq(_.compact(_.flatten(_.map(evaluations.evaluations, (evaluation) =>
      _.map(evaluation.chapters, (chapter) => chapter.path)
    ))))

    const total_paths = Object.values(spec.paths()).reduce((acc, methods) => acc + methods.length, 0);
    console.log()
    console.log(`Tested ${evaluated_paths.length}/${total_paths} paths.`)
  }

  #log_story ({ result, full_path, display_path, message }: StoryEvaluation): void {
    this.#log_evaluation({ result, message: message ?? full_path }, ansi.cyan(ansi.b(display_path)))
  }

  #log_chapters (evaluations: ChapterEvaluation[], title: string): void {
    if (evaluations.length === 0) return
    const result = overall_result(evaluations.map(e => e.overall))
    if (!this._verbose && (result === Result.SKIPPED || result === Result.PASSED)) return
    this.#log_evaluation({ result }, title, this._tab_width)
    for (const evaluation of evaluations) this.#log_chapter(evaluation)
  }

  #log_chapter (chapter: ChapterEvaluation): void {
    this.#log_evaluation(chapter.overall, ansi.i(chapter.title), this._tab_width * 2)
    this.#log_parameters(chapter.request?.parameters ?? {})
    this.#log_request_body(chapter.request?.request_body)
    this.#log_status(chapter.response?.status)
    this.#log_payload_body(chapter.response?.payload_body)
    this.#log_payload_schema(chapter.response?.payload_schema)
  }

  #log_parameters (parameters: Record<string, Evaluation>): void {
    if (Object.keys(parameters).length === 0) return
    const result = overall_result(Object.values(parameters))
    this.#log_evaluation({ result }, 'PARAMETERS', this._tab_width * 3)
    for (const [name, evaluation] of Object.entries(parameters)) {
      this.#log_evaluation(evaluation, name, this._tab_width * 4)
    }
  }

  #log_request_body (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#log_evaluation(evaluation, 'REQUEST BODY', this._tab_width * 3)
  }

  #log_status (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#log_evaluation(evaluation, 'RESPONSE STATUS', this._tab_width * 3)
  }

  #log_payload_body (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#log_evaluation(evaluation, 'RESPONSE PAYLOAD BODY', this._tab_width * 3)
  }

  #log_payload_schema (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#log_evaluation(evaluation, 'RESPONSE PAYLOAD SCHEMA', this._tab_width * 3)
  }

  #log_evaluation (evaluation: Evaluation, title: string, prefix: number = 0): void {
    const result = ansi.padding(this.#result(evaluation.result), 0, prefix)

    const message = this.#maybe_shorten_error_message(evaluation.message);

    if (message !== undefined) {
      console.log(`${result} ${title} ${ansi.gray(`(${message})`)}`)
    } else {
      console.log(`${result} ${title}`)
    }
  }

  #maybe_shorten_error_message(message: string | undefined): string | undefined {
    if (message === undefined || message.length <= 128 || this._verbose) return message
    const part = message.split(',')[0]
    return part + (part !== message ? ', ...' : '')
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
