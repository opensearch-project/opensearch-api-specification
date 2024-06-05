/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type Chapter, type ActualResponse } from './types/story.types'
import { type ChapterEvaluation, type Evaluation, Result } from './types/eval.types'
import { type ParsedOperation } from './types/spec.types'
import { overall_result } from './helpers'
import { type OpenAPIV3 } from 'openapi-types'
import ChapterReader from './ChapterReader'
import SpecParser from './SpecParser'
import SchemaValidator from './SchemaValidator'

export default class ChapterEvaluator {
  spec: OpenAPIV3.Document
  chapter: Chapter
  skip_payload_evaluation: boolean = false

  constructor (chapter: Chapter, spec: OpenAPIV3.Document) {
    this.chapter = chapter
    this.spec = spec
  }

  async evaluate (skip: boolean): Promise<ChapterEvaluation> {
    if (skip) return { title: this.chapter.synopsis, overall: { result: Result.SKIPPED } }
    const response = await new ChapterReader().read(this.chapter)
    const operation = new SpecParser(this.spec).locate_operation(this.chapter)
    if (operation == null) return { title: this.chapter.synopsis, overall: { result: Result.FAILED, message: `Operation "${this.chapter.method.toUpperCase()} ${this.chapter.path}" not found in the spec.` } }
    const params = this.#evaluate_parameters(operation)
    const request_body = this.#evaluate_request_body(operation)
    const status = this.#evaluate_status(response)
    const payload = this.#evaluate_payload(operation, response)
    return {
      title: this.chapter.synopsis,
      overall: { result: overall_result(Object.values(params).concat([request_body, status, payload])) },
      request: { parameters: params, request_body },
      response: { status, payload }
    }
  }

  #evaluate_parameters (operation: ParsedOperation): Record<string, Evaluation> {
    return Object.fromEntries(Object.entries(this.chapter.parameters ?? {}).map(([name, parameter]) => {
      const schema = operation.parameters[name]?.schema
      if (schema == null) return [name, { result: Result.FAILED, message: `Schema for "${name}" parameter not found.` }]
      const evaluation = new SchemaValidator(this.spec).validate(schema, parameter)
      return [name, evaluation]
    }))
  }

  #evaluate_request_body (operation: ParsedOperation): Evaluation {
    if (!this.chapter.request_body) return { result: Result.PASSED }
    const content_type = this.chapter.request_body.content_type ?? 'application/json'
    const schema = operation.requestBody?.content[content_type]?.schema
    if (schema == null) return { result: Result.FAILED, message: `Schema for "${content_type}" request body not found in the spec.` }
    return new SchemaValidator(this.spec).validate(schema, this.chapter.request_body?.payload ?? {})
  }

  #evaluate_status (response: ActualResponse): Evaluation {
    const expected_status = this.chapter.response?.status ?? 200
    if (response.status === expected_status) return { result: Result.PASSED }
    this.skip_payload_evaluation = true
    return {
      result: Result.ERROR,
      message: `Expected status ${expected_status}, but received ${response.status}: ${response.content_type}. ${response.message}`,
      error: response.error as Error
    }
  }

  #evaluate_payload (operation: ParsedOperation, response: ActualResponse): Evaluation {
    if (this.skip_payload_evaluation) return { result: Result.SKIPPED }
    const content_type = response.content_type ?? 'application/json'
    const content = operation.responses[response.status]?.content[content_type]
    const schema = content?.schema
    if (schema == null && content != null) return { result: Result.PASSED }
    if (schema == null) return { result: Result.FAILED, message: `Schema for "${response.status}: ${response.content_type}" response not found in the spec.` }
    return new SchemaValidator(this.spec).validate(schema, response.payload)
  }
}
