/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import YAML from 'yaml'
import type { StoryEvaluation } from '../../src/tester/types/eval.types'
import type { Story } from '../../src/tester/types/story.types'
import { read_yaml } from '../../helpers'
import StoryEvaluator from '../../src/tester/StoryEvaluator'
import SpecParser from '../../src/tester/SpecParser'
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
  spec_parser: SpecParser
  opensearch_http_client: OpenSearchHttpClient
  chapter_reader: ChapterReader
  schema_validator: SchemaValidator
  chapter_evaluator: ChapterEvaluator
  story_evaluator: StoryEvaluator
  result_logger: ResultLogger
  test_runner: TestRunner
} {
  const specification: OpenAPIV3.Document = read_yaml(spec_path)
  const spec_parser = new SpecParser(specification)
  const opensearch_http_client = new OpenSearchHttpClient({
    insecure: true,
    username: process.env.OPENSEARCH_USERNAME ?? 'admin',
    password: process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
  })
  const chapter_reader = new ChapterReader(opensearch_http_client)
  const schema_validator = new SchemaValidator(specification)
  const chapter_evaluator = new ChapterEvaluator(spec_parser, chapter_reader, schema_validator)
  const story_evaluator = new StoryEvaluator(chapter_reader, chapter_evaluator)
  const result_logger = new NoOpResultLogger()
  const test_runner = new TestRunner(story_evaluator, result_logger)
  return {
    specification,
    spec_parser,
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

export function scrub_errors (obj: any): void {
  for (const key in obj) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (key === 'error') obj[key] = obj[key].message
    else if (typeof obj[key] === 'object') scrub_errors(obj[key])
  }
}

export function load_expected_evaluation (name: string, exclude_full_path: boolean = false): Record<string, any> {
  const expected = read_yaml(`tools/tests/tester/fixtures/evals/${name}.yaml`)
  if (exclude_full_path) delete expected.full_path
  return expected
}

export async function load_actual_evaluation (evaluator: StoryEvaluator, name: string): Promise<StoryEvaluation> {
  const story: Story = read_yaml(`tools/tests/tester/fixtures/stories/${name}.yaml`)
  const display_path = `${name}.yaml`
  const full_path = `tools/tests/tester/fixtures/stories/${name}.yaml`
  const actual = await evaluator.evaluate({ display_path, full_path, story })
  scrub_errors(actual)
  return actual
}
