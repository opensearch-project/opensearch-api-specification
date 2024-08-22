/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type ChapterEvaluation, type Evaluation, Operation, Result, type StoryEvaluation } from './types/eval.types'
import { overall_result } from './helpers'
import * as ansi from './Ansi'
import TestResults from './TestResults'
import _ from 'lodash'

export interface ResultLogger {
  log: (evaluation: StoryEvaluation) => void
  log_coverage: (_results: TestResults) => void
}

export class NoOpResultLogger implements ResultLogger {
  log (_: StoryEvaluation): void { }
  log_coverage(_results: TestResults): void { }
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

  log_coverage(results: TestResults): void {
    console.log()
    console.log(`Tested ${results.evaluated_operations().length}/${results.operations().length} paths.`)
  }

  log_coverage_report(results: TestResults): void {
    console.log()
    console.log(`${results.unevaluated_operations().length} paths remaining.`)
    const groups = _.groupBy(results.unevaluated_operations(), (operation) => operation.path.split('/')[1])
    Object.entries(groups).forEach(([root, operations]) => {
      this.#log_coverage_group(root, operations)
    });
  }

  #log_coverage_group(key: string, operations: Operation[], index: number = 2): void {
    if (operations.length == 0 || key == undefined) return
    console.log(`${' '.repeat(index)}/${key} (${operations.length})`)
    const current_level_operations = operations.filter((operation) => operation.path.split('/').length == index)
    current_level_operations.forEach((operation) => {
      console.log(`${' '.repeat(index + 2)}${operation.method} ${operation.path}`)
    })
    const next_level_operations = operations.filter((operation) => operation.path.split('/').length > index)
    const subgroups = _.groupBy(next_level_operations, (operation) => operation.path.split('/')[index])
    Object.entries(subgroups).forEach(([root, operations]) => {
      this.#log_coverage_group(root, operations, index + 1)
    });
  }

  #log_story ({ result, full_path, display_path, message, warnings }: StoryEvaluation): void {
    this.#log_evaluation({ result, message: message ?? full_path }, ansi.cyan(ansi.b(display_path)))
    this.#log_warnings(warnings)
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
    this.#log_request(chapter.request?.request)
    this.#log_status(chapter.response?.status)
    this.#log_payload_body(chapter.response?.payload_body)
    this.#log_payload_schema(chapter.response?.payload_schema)
    this.#log_output_values(chapter.response?.output_values)
    this.#log_retries(chapter.retries)
  }

  #log_parameters (parameters: Record<string, Evaluation>): void {
    if (Object.keys(parameters).length === 0) return
    const result = overall_result(Object.values(parameters))
    this.#log_evaluation({ result }, 'PARAMETERS', this._tab_width * 3)
    for (const [name, evaluation] of Object.entries(parameters)) {
      this.#log_evaluation(evaluation, name, this._tab_width * 4)
    }
  }

  #log_request (evaluation: Evaluation | undefined): void {
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

  #log_output_values (evaluation: Evaluation | undefined): void {
    if (evaluation == null) return
    this.#log_evaluation(evaluation, 'RESPONSE OUTPUT VALUES', this._tab_width * 3)
  }

  #log_retries (retries?: number): void {
    if (retries == null) return
    const result = ansi.padding(ansi.green(`RETRIES`), 0, this._tab_width * 3)
    console.log(`${result} ${retries}`)
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

  #log_warnings(warnings?: string[]): void {
    if (!warnings) return
    warnings.forEach((warning) => { console.log(ansi.gray(`WARNING ${(warning)}`)); })
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
