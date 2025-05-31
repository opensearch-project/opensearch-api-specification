/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Option } from '@commander-js/extra-typings'
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type ResponseType } from 'axios'
import * as https from 'node:https'
import fs from 'fs'
import { sleep } from './helpers'
import { Logger } from './Logger'
import { aws4Interceptor } from 'aws4-axios'

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

export const OPENSEARCH_CERT_OPTION = new Option('--opensearch-cert <cert>', 'client certificate file to use when authenticating with OpenSearch')
  .env('OPENSEARCH_CERT')

export const OPENSEARCH_KEY_OPTION = new Option('--opensearch-key <cert>', 'client certificate private key file name to use when authenticating with OpenSearch')
  .env('OPENSEARCH_KEY')

export const OPENSEARCH_INSECURE_OPTION = new Option('--opensearch-insecure', 'disable SSL/TLS certificate verification when connecting to OpenSearch')
  .default(DEFAULT_INSECURE)

export const AWS_ACCESS_KEY_ID_OPTION = new Option('--aws-access-key-id <key id>', 'AWS access key ID')
  .env('AWS_ACCESS_KEY_ID')

export const AWS_SECRET_ACCESS_KEY_OPTION = new Option('--aws-secret-access-key <key>', 'AWS secret access key')
  .env('AWS_SECRET_ACCESS_KEY')

export const AWS_SESSION_TOKEN_OPTION = new Option('--aws-session-token <token>', 'AWS session token')
  .env('AWS_SESSION_TOKEN')

export const AWS_REGION_OPTION = new Option('--aws-region <region>', 'AWS region')
  .env('AWS_REGION')
  .default('us-east-1')

export const AWS_SERVICE_OPTION = new Option('--aws-service <service>', 'AWS service ID')
  .env('AWS_SERVICE')
  .default('es')

export interface BasicAuth {
  username: string
  password: string
}

export interface AwsAuth {
  aws_access_key_id: string
  aws_access_secret_key: string
  aws_access_session_token?: string
  aws_region?: string
  aws_service?: string
}

export interface OpenSearchHttpClientOptions {
  url?: string
  insecure?: boolean
  cert?: string,
  key?: string,
  responseType?: ResponseType
  logger?: Logger,
  basic_auth?: BasicAuth
  aws_auth?: AwsAuth
}

export type OpenSearchHttpClientCliOptions = {
  opensearchUrl?: string
  opensearchDistribution?: string,
  opensearchUsername?: string
  opensearchPassword?: string
  opensearchInsecure?: boolean
  opensearchCert?: string,
  opensearchKey?: string,
  awsAccessKeyId?: string
  awsSecretAccessKey?: string
  awsSessionToken?: string
  awsRegion?: string
  awsService?: string
  responseType?: ResponseType
  logger?: Logger
}

export function get_opensearch_opts_from_cli (opts: OpenSearchHttpClientCliOptions): OpenSearchHttpClientOptions {
  return {
    url: opts.opensearchUrl,
    insecure: opts.opensearchInsecure,
    cert: opts.opensearchCert,
    key: opts.opensearchKey,
    basic_auth: opts.opensearchUsername !== undefined && opts.opensearchPassword !== undefined ? {
      username: opts.opensearchUsername,
      password: opts.opensearchPassword
    } : undefined,
    aws_auth: opts.awsAccessKeyId !== undefined && opts.awsSecretAccessKey !== undefined ? {
      aws_access_key_id: opts?.awsAccessKeyId,
      aws_access_secret_key: opts?.awsSecretAccessKey,
      aws_access_session_token: opts?.awsSessionToken,
      aws_region: opts?.awsRegion,
      aws_service: opts?.awsService,
    } : undefined,
    responseType: opts.responseType,
    logger: opts?.logger
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
  private readonly _opts?: OpenSearchHttpClientOptions
  private readonly _logger: Logger

  constructor (opts?: OpenSearchHttpClientOptions) {
    this._opts = opts
    this._logger = opts?.logger ?? new Logger()

    let auth_middleware = undefined

    if (opts?.basic_auth !== undefined) {
      this._logger.info(`Authenticating with ${opts.basic_auth.username} ...`)
      auth_middleware = ((request: any): any => {
        if (request.headers.Authorization === undefined) {
          const base64 = Buffer.from(`${opts.basic_auth?.username}:${opts.basic_auth?.password}`, 'utf8').toString('base64');
          request.headers.Authorization = `Basic ${base64}`
        }
        return request
      })
    } else if (opts?.aws_auth !== undefined) {
      this._logger.info(`Authenticating using SigV4 with ${opts.aws_auth.aws_access_key_id} (${opts.aws_auth.aws_region}) ...`)
      auth_middleware = aws4Interceptor({
        options: {
          region: opts.aws_auth.aws_region,
          service: opts.aws_auth.aws_service
        },
        credentials: {
          accessKeyId: opts.aws_auth.aws_access_key_id,
          secretAccessKey: opts.aws_auth.aws_access_secret_key,
          sessionToken: opts.aws_auth.aws_access_session_token,
        }
      });
    } else {
      this._logger.warn(`No credentials provided, did you forget to set OPENSEARCH_PASSWORD or AWS_ACCESS_KEY_ID?`)
    }

    this._axios = axios.create({
      baseURL: opts?.url ?? DEFAULT_URL,
      httpsAgent: new https.Agent({
        rejectUnauthorized: !(opts?.insecure ?? DEFAULT_INSECURE),
        cert: opts?.cert !== undefined && opts?.cert !== '' ? fs.readFileSync(opts?.cert) : undefined,
        key: opts?.key !== undefined && opts?.key !== '' ? fs.readFileSync(opts?.key) : undefined,
      }),
      responseType: opts?.responseType,
    })

    if (auth_middleware !== undefined) {
      this._axios.interceptors.request.use(auth_middleware)
    }
  }

  async wait_until_available (max_attempts: number = 20, wait_between_attempt_millis: number = 5000): Promise<OpenSearchInfo> {
    let attempt = 0
    while (true) {
      attempt += 1
      this._logger.info(`Connecting to ${this._opts?.url} ... (${attempt}/${max_attempts})`)
      try {
        const info = await this.get('/')
        if (this._opts?.responseType == 'arraybuffer') {
          return JSON.parse(info.data as string)
        } else {
          return info.data
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          this._logger.warn(`Error connecting to ${this._opts?.url}: (${e.message})`)
          if (e.response?.status == 401 || e.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
            throw e.message
          } else if (e.response?.status == 403 || e.code === 'ERR_BAD_REQUEST') {
            throw e.message
          }
        } else {
          this._logger.warn(`Error connecting to ${this._opts?.url}: (${typeof (e)})`)
        }
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
