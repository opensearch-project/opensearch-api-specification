/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from "lodash";
import { ChapterOutput } from "./ChapterOutput";
import ChapterReader from "./ChapterReader";
import { StoryOutputs } from "./StoryOutputs";
import { overall_result } from "./helpers";
import { ChapterEvaluation, Evaluation, Result } from "./types/eval.types";
import { SupplementalChapter } from "./types/story.types";
import { Logger } from "../Logger";
import { to_json } from "../helpers";

export default class SupplementalChapterEvaluator {
  private readonly _chapter_reader: ChapterReader;
  private readonly logger: Logger;

  constructor(chapter_reader: ChapterReader, logger: Logger) {
    this._chapter_reader = chapter_reader;
    this.logger = logger
  }

  async evaluate(chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<{ evaluation: ChapterEvaluation, evaluation_error: boolean }> {
    const title = `${chapter.method} ${chapter.path}`
    const response = await this._chapter_reader.read(chapter, story_outputs)
    const status = chapter.status ?? [200, 201]
    const output_values_evaluation = ChapterOutput.extract_output_values(response, chapter.output)
    if (output_values_evaluation.output) this.logger.info(`$ ${to_json(output_values_evaluation.output)}`)
    let response_evaluation: ChapterEvaluation
    const passed_evaluation = { title, overall: { result: Result.PASSED } }
    if (status.includes(response.status)) {
      response_evaluation = passed_evaluation
    } else {
      response_evaluation = {
        title,
        overall: {
          result: Result.ERROR,
          message: response.message,
          error: response.error as Error
        }
      }
    }

    if (output_values_evaluation.output) {
      response_evaluation.output = output_values_evaluation.output
    }

    const result = overall_result(_.compact([
      response_evaluation.overall,
      output_values_evaluation.evaluation
    ]))

    if (result === Result.PASSED) {
      return { evaluation: passed_evaluation, evaluation_error: false }
    } else {
      const message_segments = []

      if (response_evaluation.overall.result === Result.ERROR) {
        message_segments.push(`${response_evaluation.overall.message}`)
      }

      if (output_values_evaluation.evaluation.message !== undefined && output_values_evaluation.evaluation.result === Result.ERROR) {
        message_segments.push(`${output_values_evaluation.evaluation.message}`)
      }

      const message = message_segments.join('\n')

      var overall: Evaluation = { result: Result.ERROR, message }
      if (response.error !== undefined) overall.error = response.error as Error

      var evaluation: ChapterEvaluation = {
        title, overall
      }

      if (output_values_evaluation.output) {
        evaluation.output = output_values_evaluation.output
      }

      return { evaluation, evaluation_error: true }
    }
  }
}
