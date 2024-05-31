/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import SpecParser from './SpecParser'
import ChapterReader from './ChapterReader'
import SchemaValidator from './SchemaValidator'
import StoryEvaluator, { type StoryFile } from './StoryEvaluator'
import fs from 'fs'
import { type Story } from './types/story.types'
import { read_yaml } from '../../helpers'
import { Result, type StoryEvaluation } from './types/eval.types'
import ResultsDisplay, { type DisplayOptions } from './ResultsDisplay'
import { basename, resolve } from 'path'
import ChapterEvaluator from './ChapterEvaluator'
import { OpenSearchHttpClient, type OpenSearchHttpClientOptions } from '../OpenSearchHttpClient'

interface TestsRunnerOptions {
  dry_run?: boolean
  display: DisplayOptions
  opensearch: OpenSearchHttpClientOptions
}

export default class TestsRunner {
  private readonly _http_client: OpenSearchHttpClient
  private readonly _story_evaluator: StoryEvaluator
  private readonly _results_display: ResultsDisplay

  constructor (spec: OpenAPIV3.Document, opts: TestsRunnerOptions) {
    this._http_client = new OpenSearchHttpClient(opts.opensearch)
    const chapter_reader = new ChapterReader(this._http_client)
    const chapter_evaluator = new ChapterEvaluator(new SpecParser(spec), chapter_reader, new SchemaValidator(spec))
    this._story_evaluator = new StoryEvaluator(chapter_reader, chapter_evaluator, opts.dry_run ?? false)
    this._results_display = new ResultsDisplay(opts.display)
  }

  async run (story_path: string, debug: boolean = false): Promise<StoryEvaluation[]> {
    let failed = false
    const story_files = this.#sort_story_files(this.#collect_story_files(resolve(story_path), '', ''))
    const evaluations: StoryEvaluation[] = []
    for (const story_file of story_files) {
      const evaluation = await this._story_evaluator.evaluate(story_file)
      evaluations.push(evaluation)
      if (!debug) {
        this._results_display.display(evaluation)
      }
      if ([Result.ERROR, Result.FAILED].includes(evaluation.result)) failed = true
    }
    if (failed && !debug) process.exit(1)
    return evaluations
  }

  #collect_story_files (folder: string, file: string, prefix: string): StoryFile[] {
    const path = file === '' ? folder : `${folder}/${file}`
    const next_prefix = prefix === '' ? file : `${prefix}/${file}`
    if (fs.statSync(path).isFile()) {
      const story: Story = read_yaml(path)
      return [{
        display_path: next_prefix === '' ? basename(path) : next_prefix,
        full_path: path,
        story
      }]
    } else {
      return fs.readdirSync(path).flatMap(next_file => {
        return this.#collect_story_files(path, next_file, next_prefix)
      })
    }
  }

  #sort_story_files (story_files: StoryFile[]): StoryFile[] {
    return story_files.sort((a, b) => {
      const a_depth = a.display_path.split('/').length
      const b_depth = b.display_path.split('/').length
      if (a_depth !== b_depth) return a_depth - b_depth
      return a.display_path.localeCompare(b.display_path)
    })
  }
}
