/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import axios from 'axios'
import { type ChapterRequest, type ActualResponse, type Parameter } from './types/story.types'
import { Agent } from 'https'
import { type StoryOutputs } from './types/eval.types'
import { resolve_params, resolve_value } from './helpers'

// A lightweight client for testing the API
export default class ChapterReader {
  url: string
  admin_password: string

  constructor () {
    this.url = process.env.OPENSEARCH_URL ?? 'https://localhost:9200'
    if (process.env.OPENSEARCH_PASSWORD == null) throw new Error('OPENSEARCH_PASSWORD is not set')
    this.admin_password = process.env.OPENSEARCH_PASSWORD
  }

  async read (chapter: ChapterRequest, story_outputs: StoryOutputs): Promise<ActualResponse> {
    const response: Record<string, any> = {}
    const resolved_params = resolve_params(chapter.parameters ?? {}, story_outputs)
    const [url, params] = this.#parse_url(chapter.path, resolved_params)
    const request_data = chapter.request_body?.payload !== undefined ? resolve_value(chapter.request_body.payload, story_outputs) : undefined
    await axios.request({
      url,
      auth: {
        username: 'admin',
        password: this.admin_password
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
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
    const url = this.url + parsed_path
    return [url, query_params]
  }
}
