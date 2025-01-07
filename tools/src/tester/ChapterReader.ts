/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterRequest, type ActualResponse, type Parameter } from './types/story.types'
import { type OpenSearchHttpClient } from '../OpenSearchHttpClient'
import { type StoryOutputs } from './StoryOutputs'
import { Logger } from 'Logger'
import { to_json, to_ndjson } from '../helpers'
import qs from 'qs'
import YAML from 'yaml'
import CBOR from 'cbor'
import SMILE from 'smile-js'
import { APPLICATION_CBOR, APPLICATION_JSON, APPLICATION_SMILE, APPLICATION_YAML, TEXT_PLAIN } from "./MimeTypes";
import _ from 'lodash'
import { PostmanManager } from './PostmanManager'

export default class ChapterReader {
  private readonly _client: OpenSearchHttpClient
  private readonly logger: Logger
  private readonly postman_manager: PostmanManager;

  constructor (client: OpenSearchHttpClient, logger: Logger, collection_path: string = './postman_collection.json') {
    this._client = client
    this.logger = logger
    this.postman_manager = new PostmanManager(collection_path);
  }

  async read (chapter: ChapterRequest, story_outputs: StoryOutputs): Promise<ActualResponse> {
    const response: Record<string, any> = {}
    const resolved_params = story_outputs.resolve_params(chapter.parameters ?? {})
    const [url_path, params] = this.#parse_url(chapter.path, resolved_params)
    const [headers, content_type] = this.#serialize_headers(chapter.request?.headers, chapter.request?.content_type)
    const request_data = chapter.request?.payload !== undefined ? this.#serialize_payload(
      story_outputs.resolve_value(chapter.request.payload),
      content_type
    ) : undefined

    this.postman_manager.add_to_collection(this._client.get_url(), chapter.method, url_path, headers, params, request_data, content_type);

    this.logger.info(`=> ${chapter.method} ${url_path} (${to_json(params)}) [${content_type}] ${_.compact([to_json(headers), to_json(request_data)]).join(' | ')}`)
    await this._client.request({
      url: url_path,
      method: chapter.method,
      headers: { 'Content-Type' : content_type, ...headers },
      params,
      data: request_data,
      paramsSerializer: (params) => { // eslint-disable-line @typescript-eslint/naming-convention
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    }).then(r => {
      response.status = r.status
      response.content_type = r.headers['content-type']?.split(';')[0]
      const payload = this.#deserialize_payload(r.data, response.content_type)
      if (payload !== undefined) response.payload = payload
      this.logger.info(`<= ${r.status} (${r.headers['content-type']}) | ${to_json(response.payload)}`)
    }).catch(e => {
      if (e.response == null) {
        this.logger.info(`<= ERROR: ${e}`)
        response.message = e.message
        response.error = e
      } else {
        response.status = e.response.status
        response.content_type = e.response.headers['content-type']?.split(';')[0]
        response.payload = this.#deserialize_payload(e.response.data, response.content_type)
        response.message = response.payload?.error?.reason ?? e.response.statusText
        this.logger.info(`<= ${response.status} (${response.content_type}) | ${response.payload !== undefined ? to_json(response.payload) : response.message}`)
      }
    })
    this.postman_manager.save_collection();
    return response as ActualResponse
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

  #parse_url (path: string, parameters: Record<string, Parameter>): [string, Record<string, Parameter>] {
    const path_params = new Set<string>()
    const parsed_path = path.replace(/{(\w+)}/g, (_, key) => {
      path_params.add(key as string)
      return parameters[key] as string
    })
    const query_params = Object.fromEntries(Object.entries(parameters).filter(([key]) => !path_params.has(key)))
    return [parsed_path, query_params]
  }

  #deserialize_payload(payload: any, content_type: any): any {
    if (payload === undefined) return undefined
    if (content_type === undefined) return payload
    const payload_buffer = Buffer.from(payload as string, 'binary')
    switch (content_type) {
      case TEXT_PLAIN: return payload_buffer.toString()
      case APPLICATION_JSON: return payload.length == 0 ? {} : JSON.parse(payload_buffer.toString())
      case APPLICATION_YAML: return payload.length == 0 ? {} : YAML.parse(payload_buffer.toString())
      case APPLICATION_CBOR: return payload.length == 0 ? {} : CBOR.decode(payload_buffer)
      case APPLICATION_SMILE: return payload.length == 0 ? {} : SMILE.parse(payload_buffer)
      default: return payload_buffer.toString()
    }
  }
}
