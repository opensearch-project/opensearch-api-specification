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

// A lightweight client for testing the API
export default class ChapterReader {
  private readonly _client: OpenSearchHttpClient

  constructor (client: OpenSearchHttpClient) {
    this._client = client
  }

  async read (chapter: ChapterRequest, story_outputs: StoryOutputs): Promise<ActualResponse> {
    const response: Record<string, any> = {}
    const resolved_params = story_outputs.resolve_params(chapter.parameters ?? {})
    const [url_path, params] = this.#parse_url(chapter.path, resolved_params)
    const request_data = chapter.request_body?.payload !== undefined ? story_outputs.resolve_value(chapter.request_body.payload) : undefined
    await this._client.request({
      url: url_path,
      method: chapter.method,
      params,
      data: request_data
    }).then(r => {
      response.status = r.status
      response.content_type = r.headers['content-type'].split(';')[0]
      response.payload = r.data
    }).catch(e => {
      if (e.response == null) throw e
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
