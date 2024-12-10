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
import { ChapterEvaluation, EvaluationWithOutput, Result } from './types/eval.types';
import { SupplementalChapter } from "./types/story.types";
import { Logger } from "../Logger";
import { sleep, to_json } from "../helpers";

export default class SupplementalChapterEvaluator {
  private readonly _chapter_reader: ChapterReader;
  private readonly logger: Logger;

  constructor(chapter_reader: ChapterReader, logger: Logger) {
    this._chapter_reader = chapter_reader;
    this.logger = logger
  }

  async evaluate(chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<ChapterEvaluation> {
    const title = `${chapter.method} ${chapter.path}`

    let tries = chapter.retry && chapter.retry?.count > 0 ? chapter.retry.count + 1 : 1
    let chapter_evaluation: EvaluationWithOutput

    do {
      chapter_evaluation = await this.#evaluate(chapter, story_outputs)
      if (chapter_evaluation.evaluation.result === Result.PASSED) break
      if (--tries == 0) break
      this.logger.info(`Failed, retrying, ${tries == 1 ? '1 retry left' : `${tries} retries left`} ...`)
      await sleep(chapter.retry?.wait ?? 1000)
    } while (tries > 0)

    var result: ChapterEvaluation = { title, overall: chapter_evaluation.evaluation }
    if (chapter_evaluation.output) result.output = chapter_evaluation.output
    return result
  }

  async #evaluate(chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<EvaluationWithOutput> {
    const response = await this._chapter_reader.read(chapter, story_outputs)
    const output_values_evaluation = ChapterOutput.extract_output_values(response, chapter.output)
    if (output_values_evaluation.output) this.logger.info(`$ ${to_json(output_values_evaluation.output)}`)

    const status = chapter.status ?? [200, 201]
    const overall = status.includes(response.status) ? { result: Result.PASSED } : { result: Result.ERROR, message: response.message, error: response.error as Error }
    const result: Result = overall_result(_.compact([overall, output_values_evaluation.evaluation]))

    var evaluation_result: EvaluationWithOutput = { evaluation: { result } }
    if (output_values_evaluation.output) { evaluation_result.output = output_values_evaluation.output }

    if (result !== Result.PASSED) {
      const message_segments = []
      if (response.message !== undefined) { message_segments.push(`${response.message}`) }
      if (output_values_evaluation.evaluation.result === Result.ERROR) {
        message_segments.push(`${output_values_evaluation.evaluation.message}`)
      }
      if (message_segments.length > 0) evaluation_result.evaluation.message = message_segments.join('\n')
      if (response.error) { evaluation_result.evaluation.error = response.error as Error }
    }

    return evaluation_result
  }
}