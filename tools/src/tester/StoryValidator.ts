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
import { read_yaml } from "../helpers";
import JsonSchemaValidator from "../_utils/JsonSchemaValidator";
import _ from "lodash";

const DESCRIPTION_REGEX = /^\p{Lu}[\s\S]*\.$/u

export default class StoryValidator {
  private static readonly SCHEMA_FILE = path.resolve("./json_schemas/test_story.schema.yaml")
  private readonly json_validator: JsonSchemaValidator

  constructor() {
    const schema = read_yaml(StoryValidator.SCHEMA_FILE)
    this.json_validator = new JsonSchemaValidator(schema, { ajv_opts: { strictTypes: false } })
  }

  validate(story_file: StoryFile): StoryEvaluation | undefined {
    const schema_file_error = this.#validate_schema_path(story_file)
    if (schema_file_error != null) return schema_file_error
    const schema_error = this.#validate_schema(story_file)
    if (schema_error != null) return schema_error
    const fields_error = this.#validate_fields(story_file)
    if (fields_error != null) return fields_error
  }

  #validate_schema_path(story_file: StoryFile): StoryEvaluation | undefined {
    const actual_path = story_file.story.$schema
    const expected_path = path.relative(path.dirname(story_file.full_path), StoryValidator.SCHEMA_FILE)
    if (actual_path !== expected_path) return this.#invalid(story_file, `Expected $schema to be ${expected_path}`)
  }

  #validate_schema(story_file: StoryFile): StoryEvaluation | undefined {
    const message = this.json_validator.validate_data(story_file.story)
    if (message != null) return this.#invalid(story_file, message)
  }

  #validate_fields(story_file: StoryFile): StoryEvaluation | undefined {
    const results = this.#validate_text_fields(story_file.story)
    if (results.length > 0) return this.#invalid(story_file, _.join(results, "\n"))
  }

  #validate_text_fields(obj: Record<string, any>): string[] {
    let result: string[] = []
    _.forEach(['synopsis', 'description'], (field) => {
      if (obj[field] !== undefined) {
        if (!DESCRIPTION_REGEX.test(obj[field] as string)) {
          result = result.concat(`The ${field} must start with a capital letter and end with a period, got "${obj[field]}".`)
        }
      }
    })

    for (const key in obj) {
      var item = obj[key]
      if (_.isObject(item)) {
        result = result.concat(this.#validate_text_fields(item))
      }
    }
    return result
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