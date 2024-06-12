/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Option } from '@commander-js/extra-typings'
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import * as https from 'node:https'
import { sleep } from './helpers'

const DEFAULT_URL = 'https://localhost:9200'
const DEFAULT_USER = 'admin'
const DEFAULT_INSECURE = false

export const OPENSEARCH_URL_OPTION = new Option('--opensearch-url <url>', 'URL at which the OpenSearch cluster is accessible')
  .default(DEFAULT_URL)
  .env('OPENSEARCH_URL')

export const OPENSEARCH_USERNAME_OPTION = new Option('--opensearch-username <username>', 'username to use when authenticating with OpenSearch')
  .default(DEFAULT_USER)
  .env('OPENSEARCH_USERNAME')

export const OPENSEARCH_PASSWORD_OPTION = new Option('--opensearch-password <password>', 'password to use when authenticating with OpenSearch')
  .env('OPENSEARCH_PASSWORD')

export const OPENSEARCH_INSECURE_OPTION = new Option('--opensearch-insecure', 'disable SSL/TLS certificate verification when connecting to OpenSearch')
  .default(DEFAULT_INSECURE)

export interface OpenSearchHttpClientOptions {
  url?: string
  username?: string
  password?: string
  insecure?: boolean
}

export type OpenSearchHttpClientCliOptions = { [K in keyof OpenSearchHttpClientOptions as `opensearch${Capitalize<K>}`]: OpenSearchHttpClientOptions[K] }

export function get_opensearch_opts_from_cli (opts: OpenSearchHttpClientCliOptions): OpenSearchHttpClientOptions {
  return {
    url: opts.opensearchUrl,
    username: opts.opensearchUsername,
    password: opts.opensearchPassword,
    insecure: opts.opensearchInsecure
  }
}

export interface OpenSearchInfo {
  cluster_name: string
  cluster_uuid: string
  name: string
  tagline: string
  version: {
    build_date: string
    build_flavor: string
    build_hash: string
    build_snapshot: boolean
    build_type: string
    distribution: string
    lucene_version: string
    minimum_index_compatibility_version: string
    minimum_wire_compatibility_version: string
    number: string
  }
}

export class OpenSearchHttpClient {
  private readonly _axios: AxiosInstance

  constructor (opts?: OpenSearchHttpClientOptions) {
    this._axios = axios.create({
      baseURL: opts?.url ?? DEFAULT_URL,
      auth: opts?.username !== undefined && opts.password !== undefined
        ? {
            username: opts.username,
            password: opts.password
          }
        : undefined,
      httpsAgent: new https.Agent({ rejectUnauthorized: !(opts?.insecure ?? DEFAULT_INSECURE) })
    })
  }

  async wait_until_available (max_attempts: number = 20, wait_between_attempt_millis: number = 5000): Promise<OpenSearchInfo> {
    let attempt = 0
    while (true) {
      attempt += 1
      try {
        const info = await this.get('/')
        return info.data
      } catch (e) {
        if (attempt >= max_attempts) {
          throw e
        }
        await sleep(wait_between_attempt_millis)
      }
    }
  }

  async request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.request(config)
  }

  async get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.get(url, config)
  }

  async delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.delete(url, config)
  }

  async head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.head(url, config)
  }

  async options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.options(url, config)
  }

  async post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.post(url, data, config)
  }

  async put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.put(url, data, config)
  }

  async patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return await this._axios.patch(url, data, config)
  }
}
