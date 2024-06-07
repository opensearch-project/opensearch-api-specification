/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import YAML from 'yaml'
import type { ChapterEvaluation, Evaluation, StoryEvaluation } from '../../src/tester/types/eval.types'
import { read_yaml } from 'helpers'
import StoryEvaluator from '../../src/tester/StoryEvaluator'
import OperationLocator from '../../src/tester/OperationLocator'
import ChapterReader from '../../src/tester/ChapterReader'
import SchemaValidator from '../../src/tester/SchemaValidator'
import ChapterEvaluator from '../../src/tester/ChapterEvaluator'
import { OpenSearchHttpClient } from '../../src/OpenSearchHttpClient'
import { type OpenAPIV3 } from 'openapi-types'
import TestRunner from '../../src/tester/TestRunner'
import { NoOpResultLogger, type ResultLogger } from '../../src/tester/ResultLogger'
import * as process from 'node:process'

export function construct_tester_components (spec_path: string): {
  specification: OpenAPIV3.Document
  operation_locator: OperationLocator
  opensearch_http_client: OpenSearchHttpClient
  chapter_reader: ChapterReader
  schema_validator: SchemaValidator
  chapter_evaluator: ChapterEvaluator
  story_evaluator: StoryEvaluator
  result_logger: ResultLogger
  test_runner: TestRunner
} {
  const specification: OpenAPIV3.Document = read_yaml(spec_path)
  const operation_locator = new OperationLocator(specification)
  const opensearch_http_client = new OpenSearchHttpClient({
    insecure: true,
    username: process.env.OPENSEARCH_USERNAME ?? 'admin',
    password: process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
  })
  const chapter_reader = new ChapterReader(opensearch_http_client)
  const schema_validator = new SchemaValidator(specification)
  const chapter_evaluator = new ChapterEvaluator(operation_locator, chapter_reader, schema_validator)
  const story_evaluator = new StoryEvaluator(chapter_reader, chapter_evaluator)
  const result_logger = new NoOpResultLogger()
  const test_runner = new TestRunner(story_evaluator, result_logger)
  return {
    specification,
    operation_locator,
    opensearch_http_client,
    chapter_reader,
    schema_validator,
    chapter_evaluator,
    story_evaluator,
    result_logger,
    test_runner
  }
}

export function print_yaml (obj: any): void {
  console.log(YAML.stringify(obj, { indent: 2, singleQuote: true, lineWidth: undefined }))
}

export function flatten_errors (evaluation: StoryEvaluation): StoryEvaluation {
  const flatten = <T extends Evaluation | undefined>(e: T): T => (e !== undefined
    ? {
        ...e,
        error: typeof e.error === 'object' ? e.error.message : e.error
      }
    : undefined as T)

  const flatten_chapters = <T extends ChapterEvaluation[] | undefined> (chapters: T): T => {
    if (chapters === undefined) return undefined as T
    return chapters.map((c: ChapterEvaluation): ChapterEvaluation => ({
      ...c,
      overall: flatten(c.overall),
      request: c.request !== undefined
        ? {
            parameters: c.request.parameters !== undefined
              ? Object.fromEntries(Object.entries(c.request.parameters).map(([k, v]) => [k, flatten(v)]))
              : undefined,
            request_body: flatten(c.request.request_body)
          }
        : undefined,
      response: c.response !== undefined
        ? {
            status: flatten(c.response.status),
            payload: flatten(c.response.payload)
          }
        : undefined
    })) as T
  }

  return {
    ...evaluation,
    chapters: flatten_chapters(evaluation.chapters),
    epilogues: flatten_chapters(evaluation.epilogues),
    prologues: flatten_chapters(evaluation.prologues)
  }
}

export function load_expected_evaluation (name: string, exclude_full_path: boolean = false): Omit<StoryEvaluation, 'full_path'> & { full_path?: string } {
  const { full_path, ...rest }: StoryEvaluation = read_yaml(`tools/tests/tester/fixtures/evals/${name}.yaml`)
  return !exclude_full_path ? { ...rest, full_path } : rest
}

export async function load_actual_evaluation (evaluator: StoryEvaluator, name: string): Promise<StoryEvaluation> {
  const full_path = `tools/tests/tester/fixtures/stories/${name}.yaml`
  return flatten_errors(await evaluator.evaluate({
    full_path,
    display_path: `${name}.yaml`,
    story: read_yaml(full_path)
  }))
}
