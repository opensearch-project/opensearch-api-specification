/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import type StoryEvaluator from './StoryEvaluator'
import { StoryEvaluations, type StoryFile } from './types/eval.types'
import fs from 'fs'
import { type Story } from './types/story.types'
import { read_yaml } from '../helpers'
import { Result } from './types/eval.types'
import { type ResultLogger } from './ResultLogger'
import { basename, resolve } from 'path'
import type StoryValidator from "./StoryValidator";
import { OpenSearchHttpClient } from 'OpenSearchHttpClient'
import * as ansi from './Ansi'
import _ from 'lodash'

const EXCLUDED_FILES = [
  'docker-compose.yml'
]

export default class TestRunner {
  private readonly _http_client: OpenSearchHttpClient
  private readonly _story_validator: StoryValidator
  private readonly _story_evaluator: StoryEvaluator
  private readonly _result_logger: ResultLogger
  private readonly _story_files: Record<string, StoryFile[]> = {}

  constructor (http_client: OpenSearchHttpClient, story_validator: StoryValidator, story_evaluator: StoryEvaluator, result_logger: ResultLogger) {
    this._http_client = http_client
    this._story_validator = story_validator
    this._story_evaluator = story_evaluator
    this._result_logger = result_logger
  }

  async run (story_path: string, version?: string, dry_run: boolean = false): Promise<{ results: StoryEvaluations, failed: boolean }> {
    let failed = false
    const story_files = this.story_files(story_path)
    const results: StoryEvaluations = { evaluations: [] }

    if (!dry_run) {
      const info = await this._http_client.wait_until_available()
      console.log(`OpenSearch ${ansi.green(info.version.number)}\n`)
      version = info.version.number
    }

    for (const story_file of story_files) {
      const evaluation = this._story_validator.validate(story_file) ?? await this._story_evaluator.evaluate(story_file, version, dry_run)
      results.evaluations.push(evaluation)
      this._result_logger.log(evaluation)
      if ([Result.ERROR, Result.FAILED].includes(evaluation.result)) failed = true
    }

    return { results, failed }
  }

  story_files(story_path: string): StoryFile[] {
    if (this._story_files[story_path] !== undefined) return this._story_files[story_path]
    this._story_files[story_path]  = this.#sort_story_files(this.#collect_story_files(resolve(story_path), '', ''))
    return this._story_files[story_path]
  }

  #collect_story_files (folder: string, file: string, prefix: string): StoryFile[] {
    const path = file === '' ? folder : `${folder}/${file}`
    const next_prefix = prefix === '' ? file : `${prefix}/${file}`
    if (fs.statSync(path).isFile()) {
      if (!file.endsWith('.yaml')) {
        return []
      }
      const story: Story = read_yaml(path)
      return [{
        display_path: next_prefix === '' ? basename(path) : next_prefix,
        full_path: path,
        story
      }]
    } else {
      return _.compact(fs.readdirSync(path).flatMap(next_file => {
        if (!EXCLUDED_FILES.includes(next_file)) {
          return this.#collect_story_files(path, next_file, next_prefix)
        }
      }))
    }
  }

  #sort_story_files (story_files: StoryFile[]): StoryFile[] {
    return story_files.sort(({ display_path: a }, { display_path: b }) => {
      const a_depth = a.split('/').length
      const b_depth = b.split('/').length
      if (a_depth !== b_depth) return a_depth - b_depth
      return a.localeCompare(b)
    })
  }
}
