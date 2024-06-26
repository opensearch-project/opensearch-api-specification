/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Result, StoryEvaluation, StoryFile } from "./types/eval.types";
import * as path from "path";
import { Ajv2019, ValidateFunction } from 'ajv/dist/2019'
import addFormats from 'ajv-formats'
import { read_yaml } from "../helpers";

export default class StoryValidator {
  private static readonly SCHEMA_FILE = path.resolve("./json_schemas/test_story.schema.yaml")
  private readonly ajv: Ajv2019
  private readonly validate_schema: ValidateFunction

  constructor() {
    this.ajv = new Ajv2019({ allErrors: true, strict: false })
    addFormats(this.ajv)
    const schema = read_yaml(StoryValidator.SCHEMA_FILE)
    this.validate_schema = this.ajv.compile(schema)
  }

  validate(story_file: StoryFile): StoryEvaluation | undefined {
    const schema_file_error = this.#validate_schema_path(story_file)
    if (schema_file_error != null) return schema_file_error
    const schema_error = this.#validate_schema(story_file)
    if (schema_error != null) return schema_error
  }

  #validate_schema_path(story_file: StoryFile): StoryEvaluation | undefined {
    const actual_path = story_file.story.$schema
    const expected_path = path.relative(path.dirname(story_file.full_path), StoryValidator.SCHEMA_FILE)
    if (actual_path !== expected_path) return this.#invalid(story_file, `Expected $schema to be ${expected_path}`)
  }

  #validate_schema(story_file: StoryFile): StoryEvaluation | undefined {
    const valid = this.validate_schema(story_file.story)
    if (!valid) return this.#invalid(story_file, this.ajv.errorsText(this.validate_schema.errors))
  }

  #invalid({ story, display_path, full_path }: StoryFile, message: string): StoryEvaluation {
    return {
      display_path,
      full_path,
      description: story.description,
      result: Result.ERROR,
      message: `Invalid Story: ${message}`,
    }
  }
}