/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type ChapterRequest, type ActualResponse, type Parameter } from './types/story.types'
import { type OpenSearchHttpClient } from '../OpenSearchHttpClient'
import { type StoryOutputs } from './StoryOutputs'
import { Logger } from 'Logger'
import { to_json } from '../helpers'

// A lightweight client for testing the API
export default class ChapterReader {
  private readonly _client: OpenSearchHttpClient
  private readonly logger: Logger

  constructor (client: OpenSearchHttpClient, logger: Logger) {
    this._client = client
    this.logger = logger
  }

  async read (chapter: ChapterRequest, story_outputs: StoryOutputs): Promise<ActualResponse> {
    const response: Record<string, any> = {}
    const resolved_params = story_outputs.resolve_params(chapter.parameters ?? {})
    const [url_path, params] = this.#parse_url(chapter.path, resolved_params)
    const request_data = chapter.request_body?.payload !== undefined ? story_outputs.resolve_value(chapter.request_body.payload) : undefined
    this.logger.info(`=> ${chapter.method} ${url_path} (${to_json(params)}) | ${to_json(request_data)}`)
    await this._client.request({
      url: url_path,
      method: chapter.method,
      params,
      data: request_data
    }).then(r => {
      this.logger.info(`<= ${r.status} (${r.headers['content-type']}) | ${to_json(r.data)}`)
      response.status = r.status
      response.content_type = r.headers['content-type'].split(';')[0]
      response.payload = r.data
    }).catch(e => {
      if (e.response == null) {
        this.logger.info(`<= ERROR: ${e}`)
        throw e
      }
      this.logger.info(`<= ${e.response.status} (${e.response.headers['content-type']}) | ${to_json(e.response.data)}`)
      response.status = e.response.status
      response.content_type = e.response.headers['content-type'].split(';')[0]
      response.payload = e.response.data?.error
      response.message = e.response.data?.error?.reason
      response.error = e
    })
    return response as ActualResponse
  }

  #parse_url (path: string, parameters: Record<string, Parameter>): [string, Record<string, Parameter>] {
    const path_params = new Set<string>()
    const parsed_path = path.replace(/{(\w+)}/g, (_, key) => {
      path_params.add(key as string)
      return parameters[key] as string
    })
    const query_params = Object.fromEntries(Object.entries(parameters).filter(([key]) => !path_params.has(key)))
    return [parsed_path, query_params]
  }
}
