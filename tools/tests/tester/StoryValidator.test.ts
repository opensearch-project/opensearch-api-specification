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
import { ParsedStory } from "tester/types/parsed_story.types";
import StoryParser from "../../src/tester/StoryParser";

const validator = new StoryValidator()

function validate(path: string): StoryEvaluation | undefined {
  const story: ParsedStory = StoryParser.parse(read_yaml(path))
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
      "data/chapters/1/method MUST be equal to one of the allowed values: GET, PUT, POST, DELETE, PATCH, HEAD, OPTIONS --- " +
      "data/chapters/1/method must be array --- data/chapters/1/method must match exactly one schema in oneOf")
  })

  test('invalid description', () => {
    const evaluation = validate('tools/tests/tester/fixtures/invalid_description.yaml')
    expect(evaluation?.result).toBe('ERROR')
    expect(evaluation?.message).toBe("Invalid Story: " +
      "data/description must match pattern \"^\\p{Lu}[\\s\\S]*\\.$\" --- " +
      "data/chapters/0/synopsis must match pattern \"^\\p{Lu}[\\s\\S]*\\.$|^\\p{Lu}[\\s\\S]*\\. \\[(GET|PUT|POST|DELETE|PATCH|HEAD|OPTIONS)\\]$\"")
  })

  test('invalid property', () => {
    const evaluation = validate('tools/tests/tester/fixtures/invalid_property.yaml')
    expect(evaluation?.result).toBe('ERROR')
    expect(evaluation?.message).toBe("Invalid Story: " +
      "data/prologues/0/retry contains unsupported properties: until")
  })

  test('valid story', () => {
    const evaluation = validate('tools/tests/tester/fixtures/valid_story.yaml')
    expect(evaluation).toBeUndefined()
  })
})