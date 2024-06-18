/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterOutput } from "./ChapterOutput";
import ChapterReader from "./ChapterReader";
import { StoryOutputs } from "./StoryOutputs";
import { overall_result } from "./helpers";
import { ChapterEvaluation, Result } from "./types/eval.types";
import { SupplementalChapter } from "./types/story.types";

export default class SupplementalChapterEvaluator {
  private readonly _chapter_reader: ChapterReader;

  constructor(chapter_reader: ChapterReader) {
    this._chapter_reader = chapter_reader;
  }

  async evaluate(chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<{ evaluation: ChapterEvaluation, evaluation_error: boolean }> {
    const title = `${chapter.method} ${chapter.path}`
    const response = await this._chapter_reader.read(chapter, story_outputs)
    const status = chapter.status ?? [200, 201]
    const output_values = ChapterOutput.extract_output_values(response, chapter.output)
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
      return { evaluation: passed_evaluation, evaluation_error: false }
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
      return { evaluation, evaluation_error: true }
    }
  }
}
