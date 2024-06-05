import axios from 'axios'
import { type ChapterRequest, type ActualResponse, type Parameter, RetryOnResponse } from './types/story.types'
import { Agent } from 'https'

// A lightweight client for testing the API
export default class ChapterReader {
  url: string
  admin_password: string

  constructor () {
    this.url = process.env.OPENSEARCH_URL ?? 'https://localhost:9200'
    if (process.env.OPENSEARCH_PASSWORD == null) throw new Error('OPENSEARCH_PASSWORD is not set')
    this.admin_password = process.env.OPENSEARCH_PASSWORD
  }

  get_params(chapter: ChapterRequest, environment: Record<string, any>): Record<string, Parameter> {
    const params = { ...chapter.parameters }
    for (const [key, value] of Object.entries(chapter.parameters_from_environment ?? {})) {
      params[key] = environment[value]
    }
    return params
  }

  needs_to_retry(response: ActualResponse, retry_on_response: RetryOnResponse): boolean {
    const payload_to_check = retry_on_response.payload || {}
    if(typeof response.payload !== 'object') return response.payload !== payload_to_check
    const response_payload = response.payload as Record<string, any>
    for (const [key, value] of Object.entries(payload_to_check)) {
      if (response_payload[key] !== value) return false
    }
    return true
  }

  async read_with_retry (chapter: ChapterRequest, retry_on_response: RetryOnResponse, environment: Record<string, any>, max_attempts: number, backoff: number, attempts: number): Promise<ActualResponse> {
    const response = await this.read(chapter, environment);
    if (attempts >= max_attempts || !this.needs_to_retry(response, retry_on_response)) return response
    await this.sleep_for_ms(backoff)
    return await this.read_with_retry(chapter, retry_on_response, environment, max_attempts, backoff, attempts + 1)
  }

  async sleep_for_ms (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async read (chapter: ChapterRequest, environment: Record<string, any>): Promise<ActualResponse> {
    const response: Record<string, any> = {}
    const params_with_values = this.get_params(chapter, environment)
    console.log("params_with_values: ", params_with_values)
    const [url, params] = this.#parse_url(chapter.path, params_with_values ?? {})
    await axios.request({
      url,
      auth: {
        username: 'admin',
        password: this.admin_password
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
      method: chapter.method,
      params,
      data: chapter.request_body?.payload
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
