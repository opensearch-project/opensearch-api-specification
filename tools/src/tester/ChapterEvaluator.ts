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
import YAML from 'yaml'
import _ from 'lodash'

export default class ChapterEvaluator {
  private readonly _operation_locator: OperationLocator
  private readonly _chapter_reader: ChapterReader
  private readonly _schema_validator: SchemaValidator

  constructor(spec_parser: OperationLocator, chapter_reader: ChapterReader, schema_validator: SchemaValidator) {
    this._operation_locator = spec_parser
    this._chapter_reader = chapter_reader
    this._schema_validator = schema_validator
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
    const payload_schema_evaluation = status.result === Result.PASSED ? this.#evaluate_payload_schema(response, operation) : { result: Result.SKIPPED }
    const output_values = ChapterOutput.extract_output_values(response, chapter.output)
    return {
      title: chapter.synopsis,
      overall: { result: overall_result(Object.values(params).concat([
        request_body, status, payload_body_evaluation, payload_schema_evaluation
      ]).concat(output_values ? [output_values] : [])) },
      request: { parameters: params, request_body },
      response: {
        status,
        payload_body: payload_body_evaluation,
        payload_schema: payload_schema_evaluation
      },
      ...(output_values ? { output_values } : {})
    }
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
    const content_type = chapter.request_body.content_type ?? 'application/json'
    const schema = operation.requestBody?.content[content_type]?.schema
    if (schema == null) return { result: Result.FAILED, message: `Schema for "${content_type}" request body not found in the spec.` }
    return this._schema_validator.validate(schema, chapter.request_body?.payload ?? {})
  }

  #evaluate_status(chapter: Chapter, response: ActualResponse): Evaluation {
    const expected_status = chapter.response?.status ?? 200
    if (response.status === expected_status) return { result: Result.PASSED }
    return {
      result: Result.ERROR,
      message: `Expected status ${expected_status}, but received ${response.status}: ${response.content_type}. ${response.message}`,
      error: response.error as Error
    }
  }

  #evaluate_payload_body(response: ActualResponse, expected_payload?: Payload): Evaluation {
    if (expected_payload == null) return { result: Result.PASSED }
    const content_type = response.content_type ?? 'application/json'
    const payload = this.#deserialize_payload(response.payload, content_type)
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

  #evaluate_payload_schema(response: ActualResponse, operation: ParsedOperation): Evaluation {
    const content_type = response.content_type ?? 'application/json'
    const content = operation.responses[response.status]?.content[content_type]
    const schema = content?.schema
    if (schema == null && content != null) return { result: Result.PASSED }
    if (schema == null) return { result: Result.FAILED, message: `Schema for "${response.status}: ${response.content_type}" response not found in the spec.` }
    return this._schema_validator.validate(schema, this.#deserialize_payload(response.payload, content_type))
  }

  #deserialize_payload(payload: any, content_type: string): any {
    if (payload === undefined) return undefined
    switch (content_type) {
      case 'application/yaml': return YAML.parse(payload as string)
      default: return payload
    }
  }
}
