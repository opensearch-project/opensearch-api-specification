/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type Chapter, type ActualResponse, type Payload } from './types/story.types'
import { type ChapterEvaluation, type Evaluation, Result } from './types/eval.types'
import { type ParsedOperation } from './types/spec.types'
import { overall_result } from './helpers'
import type ChapterReader from './ChapterReader'
import type OperationLocator from './OperationLocator'
import type SchemaValidator from './SchemaValidator'
import { type StoryOutputs } from './StoryOutputs'
import { ChapterOutput } from './ChapterOutput'
import { Operation, atomizeChangeset, diff } from 'json-diff-ts'
import _ from 'lodash'
import { Logger } from 'Logger'
import { to_json } from '../helpers'
import { APPLICATION_JSON } from "./MimeTypes";

export default class ChapterEvaluator {
  private readonly logger: Logger
  private readonly _operation_locator: OperationLocator
  private readonly _chapter_reader: ChapterReader
  private readonly _schema_validator: SchemaValidator

  constructor(spec_parser: OperationLocator, chapter_reader: ChapterReader, schema_validator: SchemaValidator, logger: Logger) {
    this._operation_locator = spec_parser
    this._chapter_reader = chapter_reader
    this._schema_validator = schema_validator
    this.logger = logger
  }

  async evaluate(chapter: Chapter, skip: boolean, story_outputs: StoryOutputs): Promise<ChapterEvaluation> {
    if (skip) return { title: chapter.synopsis, overall: { result: Result.SKIPPED } }
    const response = await this._chapter_reader.read(chapter, story_outputs)
    const operation = this._operation_locator.locate_operation(chapter)
    if (operation == null) return { title: chapter.synopsis, overall: { result: Result.FAILED, message: `Operation "${chapter.method.toUpperCase()} ${chapter.path}" not found in the spec.` } }
    const params = this.#evaluate_parameters(chapter, operation)
    const request_body = this.#evaluate_request_body(chapter, operation)
    const status = this.#evaluate_status(chapter, response)
    const payload_body_evaluation = status.result === Result.PASSED ? this.#evaluate_payload_body(response, chapter.response?.payload) : { result: Result.SKIPPED }
    const payload_schema_evaluation = status.result === Result.PASSED ? this.#evaluate_payload_schema(chapter, response, operation) : { result: Result.SKIPPED }

    const output_values_evaluation_with_output = status.result === Result.PASSED ? ChapterOutput.extract_output_values(response, chapter.output) : { result: Result.SKIPPED }
    const output_values_evaluation: Evaluation = { result: output_values_evaluation_with_output.result }
    if (output_values_evaluation_with_output?.message !== undefined) output_values_evaluation.message = output_values_evaluation_with_output?.message

    const evaluations = _.compact(_.concat(
      Object.values(params),
      request_body,
      status,
      payload_body_evaluation,
      payload_schema_evaluation,
      output_values_evaluation
    ))


    var result: ChapterEvaluation = {
      title: chapter.synopsis,
      path: `${chapter.method} ${chapter.path}`,
      overall: { result: overall_result(evaluations) },
      request: { parameters: params, request_body },
      response: {
        status,
        payload_body: payload_body_evaluation,
        payload_schema: payload_schema_evaluation,
        output_values: output_values_evaluation
      }
    }

    if (output_values_evaluation_with_output?.output !== undefined) {
      result.output = output_values_evaluation_with_output?.output
    }

    return result
  }

  #evaluate_parameters(chapter: Chapter, operation: ParsedOperation): Record<string, Evaluation> {
    return Object.fromEntries(Object.entries(chapter.parameters ?? {}).map(([name, parameter]) => {
      const schema = operation.parameters[name]?.schema
      if (schema == null) return [name, { result: Result.FAILED, message: `Schema for "${name}" parameter not found.` }]
      const evaluation = this._schema_validator.validate(schema, parameter)
      return [name, evaluation]
    }))
  }

  #evaluate_request_body(chapter: Chapter, operation: ParsedOperation): Evaluation {
    if (!chapter.request_body) return { result: Result.PASSED }
    const content_type = chapter.request_body.content_type ?? APPLICATION_JSON
    const schema = operation.requestBody?.content[content_type]?.schema
    if (schema == null) return { result: Result.FAILED, message: `Schema for "${content_type}" request body not found in the spec.` }
    return this._schema_validator.validate(schema, chapter.request_body?.payload ?? {})
  }

  #evaluate_status(chapter: Chapter, response: ActualResponse): Evaluation {
    const expected_status = chapter.response?.status ?? 200
    if (response.status === expected_status) return { result: Result.PASSED }

    const result: Evaluation = {
      result: Result.ERROR,
      message: _.join(_.compact([
        `Expected status ${expected_status}, but received ${response.status}: ${response.content_type}.`,
        response.message
      ]), ' ')
    };

    if (response.error !== undefined) {
      result.error = response.error as Error
    }

    return result
  }

  #evaluate_payload_body(response: ActualResponse, expected_payload?: Payload): Evaluation {
    if (expected_payload == null) return { result: Result.PASSED }
    const payload = response.payload
    this.logger.info(`${to_json(payload)}`)
    const delta = atomizeChangeset(diff(expected_payload, payload))
    const messages: string[] = _.compact(delta.map((value, _index, _array) => {
      switch (value.type) {
        case Operation.UPDATE:
          return `expected ${value.path.replace('$.', '')}='${value.oldValue}', got '${value.value}'`
        case Operation.REMOVE:
          return `missing ${value.path.replace('$.', '')}='${value.value}'`
      }
    }))
    return messages.length > 0 ? { result: Result.FAILED, message: _.join(messages, ', ') } : { result: Result.PASSED }
  }

  #evaluate_payload_schema(chapter: Chapter, response: ActualResponse, operation: ParsedOperation): Evaluation {
    const content_type = chapter.response?.content_type ?? APPLICATION_JSON

    if (response.content_type !== content_type) {
      return {
        result: Result.FAILED,
        message: `Expected content type ${content_type}, but received ${response.content_type}.`
      }
    }

    const content = operation.responses[response.status]?.content?.[content_type]

    if (content == null) {
      return {
        result: Result.FAILED,
        message: `Schema for "${response.status}: ${content_type}" response not found in the spec.`
      }
    }

    if (content.schema == null) return { result: Result.PASSED }

    return this._schema_validator.validate(content.schema, response.payload)
  }
}
