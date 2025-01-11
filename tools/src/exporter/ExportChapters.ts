/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import { read_yaml } from '../helpers'
import { basename, resolve } from 'path'
import _ from 'lodash'
import { StoryEvaluations, StoryFile } from 'tester/types/eval.types'
import { Logger } from 'Logger'
import StoryParser from './StoryParser'
import { PostmanManager } from './PostmanManager'

export default class ExportChapters {
  private readonly _story_files: Record<string, StoryFile[]> = {}
  private readonly _logger: Logger
  private readonly _PostmanManager: PostmanManager

  constructor (logger: Logger, postman_manager: PostmanManager) {
    this._PostmanManager = postman_manager
    this._logger = logger
  }

  async run (story_path: string): Promise<{ results: StoryEvaluations, failed: boolean }> {
    let failed = false
    const story_files = this.story_files(story_path)
    const results: StoryEvaluations = { evaluations: [] }

    for (const story_file of story_files) {
        for(const chapter of story_file.story.chapters) {
            console.log(chapter);
            this._PostmanManager.add_to_collection('url', chapter.method, chapter.path, {}, {}, 'application/json', story_file.full_path);
        }
        this._logger.info(`Evaluating ${story_file.display_path} ...`)
    }
    this._PostmanManager.save_collection()

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
    if (file.startsWith('.') || file == 'docker-compose.yml' || file == 'Dockerfile' || file.endsWith('.py')) {
      return []
    } else if (fs.statSync(path).isFile()) {
      const story = StoryParser.parse(read_yaml(path))
      return [{
        display_path: next_prefix === '' ? basename(path) : next_prefix,
        full_path: path,
        story
      }]
    } else {
      return _.compact(fs.readdirSync(path).flatMap(next_file => {
        return this.#collect_story_files(path, next_file, next_prefix)
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
