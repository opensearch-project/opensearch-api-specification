/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import StoryEvaluator, { type StoryFile } from './StoryEvaluator'
import fs from 'fs'
import { type Story } from './types/story.types'
import { read_yaml } from '../../helpers'
import { Result, type StoryEvaluation } from './types/eval.types'
import ResultsDisplayer, { type TestRunOptions, type DisplayOptions } from './ResultsDisplayer'
import { resolve, basename } from 'path'

type TestsRunnerOptions = TestRunOptions & DisplayOptions & Record<string, any>

export default class TestsRunner {
  path: string // Path to a story file or a directory containing story files
  opts: TestsRunnerOptions
  spec: OpenAPIV3.Document

  constructor (spec: OpenAPIV3.Document, path: string, opts: TestsRunnerOptions) {
    this.path = resolve(path)
    this.opts = opts
    this.spec = spec
  }

  async run (debug: boolean = false): Promise<StoryEvaluation[]> {
    let failed = false
    const story_files = this.#collect_story_files(this.path, '', '')
    const evaluations: StoryEvaluation[] = []
    for (const story_file of this.#sort_story_files(story_files)) {
      const evaluator = new StoryEvaluator(story_file, this.spec, this.opts.dry_run)
      const evaluation = await evaluator.evaluate()
      const displayer = new ResultsDisplayer(evaluation, this.opts)
      if (debug) evaluations.push(evaluation)
      else displayer.display()
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
