/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import axios from "axios";
import { OpenSearchHttpClient } from "OpenSearchHttpClient"
import AxiosMockAdapter from "axios-mock-adapter";

describe('OpenSearchHttpClient', () => {
  var mock = new AxiosMockAdapter(axios)

  afterEach(() => {
    mock.reset()
  })

  it('adds a Basic auth header', async () => {
    let client = new OpenSearchHttpClient({
      url: 'https://localhost:9200',
      basic_auth: {
        username: 'u',
        password: 'p'
      }
    })

    mock.onAny().reply((config) => {
      expect(config.headers?.Authorization).toMatch(/^Basic /)
      return [200, { called: true }]
    })

    expect((await client.get('/')).data).toEqual({ called: true })
  })

  it('allows to overwrite Authorization', async () => {
    let client = new OpenSearchHttpClient({
      url: 'https://localhost:9200',
      basic_auth: {
        username: 'u',
        password: 'p'
      }
    })

    mock.onAny().reply((config) => {
      expect(config.headers?.Authorization).toEqual('custom')
      return [200, { called: true }]
    })

    expect((await client.get('/', { headers: { Authorization: 'custom' } })).data).toEqual({ called: true })
  })

  it('adds a Sigv4 header', async () => {
    let client = new OpenSearchHttpClient({
      url: 'https://localhost:9200',
      aws_auth: {
        aws_access_key_id: 'key id',
        aws_access_secret_key: 'secret key',
        aws_access_session_token: 'session token',
        aws_region: 'us-west-42',
        aws_service: 'aoss'
      }
    })

    mock.onAny().reply((config) => {
      expect(config.headers?.Authorization).toMatch(
        /^AWS4-HMAC-SHA256 Credential=key id\/\d*\/us-west-42\/aoss\/aws4_request/
      )
      return [200, { called: true }]
    })

    expect((await client.get('/')).data).toEqual({ called: true })
  })
})
