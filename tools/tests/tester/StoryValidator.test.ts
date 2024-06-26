/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import StoryValidator from "../../src/tester/StoryValidator";
import { StoryEvaluation } from "../../src/tester/types/eval.types";
import { read_yaml } from "../../src/helpers";
import { Story } from "../../src/tester/types/story.types";

const validator = new StoryValidator()

function validate(path: string): StoryEvaluation | undefined {
  const story: Story = read_yaml(path)
  return validator.validate({ story, display_path: path, full_path: path })
}

describe('StoryValidator', () => {
  test('wrong $schema', () => {
    const evaluation = validate('tools/tests/tester/fixtures/wrong_$schema.yaml')
    expect(evaluation?.result).toBe('ERROR')
    expect(evaluation?.message).toBe('Invalid Story: Expected $schema to be ../../../../json_schemas/test_story.schema.yaml')
  })

  test('invalid story', () => {
    const evaluation = validate('tools/tests/tester/fixtures/invalid_story.yaml')
    expect(evaluation?.result).toBe('ERROR')
    expect(evaluation?.message).toBe("Invalid Story: data/epilogues/0 must NOT have unevaluated properties, data/chapters/0 must have required property 'method', data/chapters/1/method must be equal to one of the allowed values")
  })

  test('valid story', () => {
    const evaluation = validate('tools/tests/tester/fixtures/valid_story.yaml')
    expect(evaluation).toBeUndefined()
  })
})