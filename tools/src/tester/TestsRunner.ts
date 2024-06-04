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
import { Result } from './types/eval.types'
import ResultsDisplayer, { type DisplayOptions } from './ResultsDisplayer'
import SharedResources from './SharedResources'
import { resolve, basename } from 'path'

type TestsRunnerOptions = DisplayOptions & Record<string, any>

export default class TestsRunner {
  path: string // Path to a story file or a directory containing story files
  opts: TestsRunnerOptions

  constructor (spec: OpenAPIV3.Document, path: string, opts: TestsRunnerOptions) {
    this.path = resolve(path)
    this.opts = opts

    const chapter_reader = new ChapterReader()
    const spec_parser = new SpecParser(spec)
    const schema_validator = new SchemaValidator(spec)
    SharedResources.create_instance({ chapter_reader, schema_validator, spec_parser })
  }

  async run (): Promise<void> {
    let failed = false
    const story_files = this.#collect_story_files(this.path, '', '').sort((a, b) => a.display_path.localeCompare(b.display_path))
    for (const story_file of story_files) {
      const evaluator = new StoryEvaluator(story_file)
      const evaluation = await evaluator.evaluate()
      const displayer = new ResultsDisplayer(evaluation, this.opts)
      displayer.display()
      if ([Result.ERROR, Result.FAILED].includes(evaluation.result)) failed = true
    }
    if (failed) process.exit(1)
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
}
