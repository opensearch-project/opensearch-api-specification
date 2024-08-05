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
    expect(evaluation?.message).toBe("Invalid Story: " +
      "data/epilogues/0 contains unsupported properties: response --- " +
      "data/chapters/0 MUST contain the missing properties: method --- " +
      "data/chapters/1/method MUST be equal to one of the allowed values: GET, PUT, POST, DELETE, PATCH, HEAD, OPTIONS")
  })

  test('invalid description', () => {
    const evaluation = validate('tools/tests/tester/fixtures/invalid_description.yaml')
    expect(evaluation?.result).toBe('ERROR')
    expect(evaluation?.message).toBe("Invalid Story: " +
      'The description must start with a capital letter and end with a period, got "This story description is missing a period".\n' +
      'The synopsis must start with a capital letter and end with a period, got "this synopsis is not capitalized.".'
    )
  })

  test('valid story', () => {
    const evaluation = validate('tools/tests/tester/fixtures/valid_story.yaml')
    expect(evaluation).toBeUndefined()
  })
})