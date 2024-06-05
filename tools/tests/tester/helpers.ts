/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import ChapterReader from '../../src/tester/ChapterReader'
import SpecParser from '../../src/tester/SpecParser'
import SchemaValidator from '../../src/tester/SchemaValidator'
import SharedResources from '../../src/tester/SharedResources'
import { type OpenAPIV3 } from 'openapi-types'
import YAML from 'yaml'
import type { StoryEvaluation } from '../../src/tester/types/eval.types'
import type { Story } from '../../src/tester/types/story.types'
import { read_yaml } from '../../helpers'
import StoryEvaluator from '../../src/tester/StoryEvaluator'

export function create_shared_resources (spec: any): void {
  // The fallback password must match the default password specified in .github/opensearch-cluster/docker-compose.yml
  process.env.OPENSEARCH_PASSWORD = process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
  const chapter_reader = new ChapterReader()
  const spec_parser = new SpecParser(spec as OpenAPIV3.Document)
  const schema_validator = new SchemaValidator(spec as OpenAPIV3.Document)
  SharedResources.create_instance({ chapter_reader, schema_validator, spec_parser })
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

export async function load_actual_evaluation (name: string): Promise<StoryEvaluation> {
  const story: Story = read_yaml(`tools/tests/tester/fixtures/stories/${name}.yaml`)
  const display_path = `${name}.yaml`
  const full_path = `tools/tests/tester/fixtures/stories/${name}.yaml`
  const actual = await new StoryEvaluator({ display_path, full_path, story }).evaluate()
  scrub_errors(actual)
  return actual
}
