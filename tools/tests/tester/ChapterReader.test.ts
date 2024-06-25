/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger } from 'Logger';
import { OpenSearchHttpClient } from 'OpenSearchHttpClient';
import axios from 'axios';
import ChapterReader from 'tester/ChapterReader';
import { StoryOutputs } from 'tester/StoryOutputs';

jest.mock('axios');
const mocked_axios = axios as jest.Mocked<typeof axios>;

describe('ChapterReader', () => {
  var reader: ChapterReader

  beforeEach(() => {
    mocked_axios.create.mockReturnThis()

    mocked_axios.request.mockResolvedValue({
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    });

    reader = new ChapterReader(new OpenSearchHttpClient(), new Logger())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('sends a GET request', async () => {
    const result = await reader.read({
      id: 'id',
      path: 'path',
      method: 'GET',
      parameters: undefined,
      request_body: undefined,
      output: undefined
    }, new StoryOutputs())

    expect(result).toEqual({ status: 200, content_type: 'application/json', payload: undefined })
    expect(mocked_axios.request.mock.calls).toEqual([
      [{
        url: 'path',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: {},
        paramsSerializer: expect.any(Function),
        data: undefined
      }]
    ])
  })

  it('resolves path parameters', async () => {
    const result = await reader.read({
      id: 'id',
      path: '{index}/path',
      method: 'GET',
      parameters: { index: 'books' },
      request_body: undefined,
      output: undefined
    }, new StoryOutputs())

    expect(result).toEqual({ status: 200, content_type: 'application/json', payload: undefined })
    expect(mocked_axios.request.mock.calls).toEqual([
      [{
        url: 'books/path',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: {},
        paramsSerializer: expect.any(Function),
        data: undefined
      }]
    ])
  })

  it('resolves array parameters', async () => {
    const result = await reader.read({
      id: 'id',
      path: '/path',
      method: 'GET',
      parameters: { indexes: ['book1', 'book2'] },
      request_body: undefined,
      output: undefined
    }, new StoryOutputs())

    expect(result).toEqual({ status: 200, content_type: 'application/json', payload: undefined })
    expect(mocked_axios.request.mock.calls).toEqual([
      [{
        url: '/path',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: { indexes: ['book1', 'book2'] },
        paramsSerializer: expect.any(Function),
        data: undefined
      }]
    ])

    const call = mocked_axios.request.mock.calls[0][0] as any
    expect(call.paramsSerializer(call.params)).toEqual(`indexes=${encodeURIComponent('book1,book2')}`)
  })

  it('sends a POST request', async () => {
    const result = await reader.read({
      id: 'id',
      path: 'path',
      method: 'POST',
      parameters: { 'x': 1 },
      request_body: { payload: { "body": "present" } },
      output: undefined
    }, new StoryOutputs())

    expect(result).toEqual({ status: 200, content_type: 'application/json', payload: undefined })
    expect(mocked_axios.request.mock.calls).toEqual([
      [{
        url: 'path',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { 'x': 1 },
        paramsSerializer: expect.any(Function),
        data: { 'body': 'present' }
      }]
    ])
  })

  it('sends an nd-json POST request', async () => {
    const result = await reader.read({
      id: 'id',
      path: 'path',
      method: 'POST',
      parameters: { 'x': 1 },
      request_body: {
        content_type: 'application/x-ndjson',
        payload: [{ "body": "present" }]
      },
      output: undefined
    }, new StoryOutputs())

    expect(result).toEqual({ status: 200, content_type: 'application/json', payload: undefined })
    expect(mocked_axios.request.mock.calls).toEqual([
      [{
        url: 'path',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-ndjson' },
        params: { 'x': 1 },
        paramsSerializer: expect.any(Function),
        data: "{\"body\":\"present\"}\n"
      }]
    ])
  })
})

