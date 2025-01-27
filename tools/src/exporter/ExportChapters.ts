/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import { read_yaml, to_ndjson } from '../helpers'
import { basename, resolve } from 'path'
import _ from 'lodash'
import { StoryFile } from 'tester/types/eval.types'
import { Logger } from 'Logger'
import StoryParser from './StoryParser'
import { PostmanManager } from './PostmanManager'
import { APPLICATION_JSON } from './MimeTypes'
import { Parameter } from 'tester/types/story.types'

export default class ExportChapters {
  private readonly _story_files: Record<string, StoryFile[]> = {}
  private readonly _logger: Logger
  private readonly _postman_manager: PostmanManager

  constructor (logger: Logger, postman_manager: PostmanManager) {
    this._logger = logger
    this._postman_manager = postman_manager
  }

  run (story_path: string): void {
    const story_files = this.story_files(story_path)

    for (const story_file of story_files) {
      for (const chapter of story_file.story.chapters) {
        const [headers, content_type] = this.#serialize_headers(chapter.request?.headers, chapter.request?.content_type)
        let params = {};
        if (chapter.parameters !== undefined) {
          params = this.#parse_url(chapter.path, chapter.parameters)
        }
        const request_data = chapter.request?.payload !== undefined ? this.#serialize_payload(
          chapter.request.payload,
          content_type
        ) : {}
        this._postman_manager.add_to_collection('url', chapter.method, chapter.path, headers, params, request_data, content_type, story_file.full_path);
      }
      this._logger.info(`Evaluating ${story_file.display_path} ...`)
    }
    this._postman_manager.save_collection()
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

  #serialize_headers(headers?: Record<string, any>, content_type?: string): [Record<string, any> | undefined, string] {
    headers = _.cloneDeep(headers)
    content_type = content_type ?? APPLICATION_JSON
    if (!headers) return [headers, content_type]
    _.forEach(headers, (v, k) => {
      if (k.toLowerCase() == 'content-type') {
        content_type = v.toString()
        if (headers) delete headers[k]
      }
    })
    return [headers, content_type]
  }

  #serialize_payload(payload: any, content_type: string): any {
    if (payload === undefined) return undefined
    switch (content_type) {
      case 'application/x-ndjson': return to_ndjson(payload as any[])
      default: return payload
    }
  }

  resolve_params (parameters: Record<string, Parameter>): Record<string, Parameter> {
    const resolved_params: Record<string, Parameter> = {}
    for (const [param_name, param_value] of Object.entries(parameters ?? {})) {
      if (typeof param_value === 'string') {
        resolved_params[param_name] = param_value
      } else {
        resolved_params[param_name] = param_value
      }
    }
    return resolved_params
  }

  #parse_url (path: string, parameters: Record<string, Parameter>): Record<string, Parameter> {
    const path_params = new Set<string>()
    path.replace(/{(\w+)}/g, (_, key) => {
      path_params.add(key as string)
      return parameters[key] as string
    })
    const query_params = Object.fromEntries(Object.entries(parameters).filter(([key]) => !path_params.has(key)))
    return query_params
  }
}
