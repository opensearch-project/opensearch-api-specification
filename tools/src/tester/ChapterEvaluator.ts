import { type Chapter, type ActualResponse, SaveInEnvironment, SaveInEnvironmentMapping } from './types/story.types'
import { type ChapterEvaluation, type Evaluation, Result, EvaluationEnvironment } from './types/eval.types'
import { type ParsedOperation } from './types/spec.types'
import { overall_result } from './helpers'
import type ChapterReader from './ChapterReader'
import SharedResources from './SharedResources'
import type SpecParser from './SpecParser'
import type SchemaValidator from './SchemaValidator'

export default class ChapterEvaluator {
  chapter: Chapter
  skip_payload_evaluation: boolean = false
  spec_parser: SpecParser
  chapter_reader: ChapterReader
  schema_validator: SchemaValidator

  constructor (chapter: Chapter) {
    this.chapter = chapter
    this.spec_parser = SharedResources.get_instance().spec_parser
    this.chapter_reader = SharedResources.get_instance().chapter_reader
    this.schema_validator = SharedResources.get_instance().schema_validator
  }

  async evaluate (skipped: boolean, environment: EvaluationEnvironment): Promise<ChapterEvaluation> {
    if (skipped) return { title: this.chapter.synopsis, overall: { result: Result.SKIPPED } }
    const operation = this.spec_parser.locate_operation(this.chapter)
    const response = await this.chapter_reader.read(this.chapter, environment)
    const params = this.#evaluate_parameters(operation)
    const request_body = this.#evaluate_request_body(operation)
    const status = this.#evaluate_status(response)
    const payload = this.#evaluate_payload(operation, response)
    console.log("remember: ", this.chapter.remember)
    const updated_environment = this.chapter.remember? this.#evaluate_environment(this.chapter.remember, response) : {}
    return {
      title: this.chapter.synopsis,
      overall: { result: overall_result(Object.values(params).concat([request_body, status, payload])) },
      request: { parameters: params, requestBody: request_body },
      response: { status, payload },
      updated_environment: updated_environment
    }
  }

  #evaluate_parameters (operation: ParsedOperation): Record<string, Evaluation> {
    return Object.fromEntries(Object.entries(this.chapter.parameters ?? {}).map(([name, parameter]) => {
      const schema = operation.parameters[name]?.schema
      if (schema == null) return [name, { result: Result.FAILED, message: `Schema for "${name}" parameter not found.` }]
      const evaluation = this.schema_validator.validate(schema, parameter)
      return [name, evaluation]
    }))
  }

  #evaluate_request_body (operation: ParsedOperation): Evaluation {
    if (!this.chapter.request_body) return { result: Result.PASSED }
    const content_type = this.chapter.request_body.content_type ?? 'application/json'
    const schema = operation.requestBody?.content[content_type]?.schema
    if (schema == null) return { result: Result.FAILED, message: `Schema for "${content_type}" request body not found in the spec.` }
    return this.schema_validator.validate(schema, this.chapter.request_body?.payload ?? {})
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
    return this.schema_validator.validate(schema, response.payload)
  }

  #evaluate_environment(remember: SaveInEnvironment, actualResponse: ActualResponse): EvaluationEnvironment {
    if(remember.payload) {
      return this.#evaluate_environment_for_payload(remember.payload, actualResponse)
    }
    // @TODO support headers environments
    return {}
  }

  #evaluate_environment_for_payload (payload_remember: SaveInEnvironmentMapping, actualResponse: ActualResponse): EvaluationEnvironment {
    const environment: EvaluationEnvironment = {}
    // @TODO support saving environments for the whole payload no matter if it's an object or not
    if(actualResponse.payload && typeof actualResponse.payload === 'object' ) {
      for (const key in payload_remember) {
        const payload_as_object = actualResponse.payload as Record<string, any>
        const payload_field = payload_remember[key]
        environment[key] = payload_as_object[payload_field]
      }
    }
    return environment
  }
}
