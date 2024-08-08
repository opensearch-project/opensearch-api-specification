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

jest.mock('axios')

describe('OpenSearchHttpClient', () => {
  let mocked_axios: jest.Mocked<typeof axios> = axios as jest.Mocked<typeof axios>

  beforeEach(() => {
    mocked_axios.create.mockReturnThis()
    mocked_axios.interceptors.request.use = jest.fn().mockReturnValue({ headers: {} })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('uses password authentication', () => {
    new OpenSearchHttpClient({
      url: 'https://localhost:9200',
      username: 'admin',
      password: 'password'
    })

    expect(mocked_axios.create.mock.calls[0][0]).toMatchObject({
      auth: {
        username: 'admin',
        password: 'password'
      },
      baseURL: 'https://localhost:9200'
    })

    expect(mocked_axios.interceptors.request.use).not.toHaveBeenCalled()
  })

  it('assigns a request interceptor with SigV4 authentication', () => {
    new OpenSearchHttpClient({
      url: 'https://localhost:9200',
      aws_access_key_id: 'key id',
      aws_access_secret_key: 'secret key',
      aws_access_session_token: 'session token',
      aws_region: 'us-west-2',
      aws_service: 'aoss'
    })

    expect(mocked_axios.create.mock.calls[0][0]).toMatchObject({
      auth: undefined,
      baseURL: 'https://localhost:9200'
    })

    expect(mocked_axios.interceptors.request.use).toHaveBeenCalled()
  })
})
