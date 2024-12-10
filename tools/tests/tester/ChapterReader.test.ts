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
    reader = new ChapterReader(new OpenSearchHttpClient(), new Logger())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('.read', () => {
    beforeEach(() => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {
          'content-type': 'application/json'
        }
      });
    })

    it('sends a GET request', async () => {
      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: 'GET',
        parameters: undefined,
        request: undefined,
        output: undefined
      }, 'GET', new StoryOutputs())

      expect(result).toStrictEqual({ status: 200, content_type: 'application/json' })
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

    it('sends a POST request with multiple methods tested', async () => {
      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: ['GET', 'POST'],
        parameters: undefined,
        request: undefined,
        output: undefined
      }, 'POST', new StoryOutputs())

      expect(result).toStrictEqual({ status: 200, content_type: 'application/json' })
      expect(mocked_axios.request.mock.calls).toEqual([
        [{
          url: 'path',
          method: 'POST',
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
        request: undefined,
        output: undefined
      }, 'GET', new StoryOutputs())

      expect(result).toEqual({ status: 200, content_type: 'application/json' })
      expect(mocked_axios.request.mock.calls).toEqual([
        [{
          url: 'books/path',
          method: 'GET',
          data: undefined,
          headers: { 'Content-Type': 'application/json' },
          params: {},
          paramsSerializer: expect.any(Function)
        }]
      ])
    })

    it('resolves array parameters', async () => {
      const result = await reader.read({
        id: 'id',
        path: '/path',
        method: 'GET',
        parameters: { indexes: ['book1', 'book2'] },
        request: undefined,
        output: undefined
      }, 'GET', new StoryOutputs())

      expect(result).toEqual({ status: 200, content_type: 'application/json' })
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
        request: { payload: { "body": "present" } },
        output: undefined
      }, 'POST', new StoryOutputs())

      expect(result).toEqual({ status: 200, content_type: 'application/json' })
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
        request: {
          content_type: 'application/x-ndjson',
          payload: [{ "body": "present" }]
        },
        output: undefined
      }, 'POST', new StoryOutputs())

      expect(result).toEqual({ status: 200, content_type: 'application/json' })
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

    it('sends headers', async () => {
      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: 'GET',
        request: {
          headers: {
            'string': 'bar',
            'number': 1,
            'boolean': true
          },
        },
        output: undefined
      }, 'GET', new StoryOutputs())

      expect(result).toStrictEqual({ status: 200, content_type: 'application/json' })
      expect(mocked_axios.request.mock.calls).toStrictEqual([
        [{
          url: 'path',
          method: 'GET',
          data: undefined,
          headers: {
            'Content-Type': 'application/json',
            'string': 'bar',
            'number': 1,
            'boolean': true
          },
          params: {},
          paramsSerializer: expect.any(Function)
        }]
      ])
    })

    it('overwrites case-insensitive content-type', async () => {
      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: 'GET',
        request: {
          headers: {
            'content-type': 'application/overwritten'
          },
        },
        output: undefined
      }, 'GET', new StoryOutputs())

      expect(result).toStrictEqual({ status: 200, content_type: 'application/json' })
      expect(mocked_axios.request.mock.calls).toStrictEqual([
        [{
          url: 'path',
          method: 'GET',
          data: undefined,
          headers: {
            'Content-Type': 'application/overwritten',
          },
          params: {},
          paramsSerializer: expect.any(Function)
        }]
      ])
    })

    it('sets payload to entire response when payload.error is missing', async () => {
      const mock_payload = { '_data': '1', 'result': 'updated' };
      const mock_error = {
        response: {
          status: 404,
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(mock_payload),
          statusText: 'Not Found'
        }
      };

      mocked_axios.request.mockRejectedValue(mock_error);

      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: 'POST'
      }, 'POST', new StoryOutputs());

      expect(result).toStrictEqual({
        status: 404,
        content_type: 'application/json',
        payload: mock_payload,
        message: 'Not Found'
      });
    });

    it('sets payload to entire response when payload.error is present', async () => {
      const mock_payload = { '_data': '1', 'result': 'updated', 'error': 'error' };
      const mock_error = {
        response: {
          status: 404,
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(mock_payload),
          statusText: 'Not Found'
        }
      };

      mocked_axios.request.mockRejectedValue(mock_error);

      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: 'POST'
      }, 'POST', new StoryOutputs());

      expect(result).toStrictEqual({
        status: 404,
        content_type: 'application/json',
        payload: mock_payload,
        message: 'Not Found'
      });
    });
  })

  describe('deserialize_payload', () => {
    it('undefined', async () => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {},
        data: undefined
      });

      const result = await reader.read({
        id: 'id',
        path: 'path',
        method: 'GET'
      }, 'GET', new StoryOutputs())

      expect(result.content_type).toBeUndefined()
      expect(result.payload).toBeUndefined()
    })

    it('text/plain', async () => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {
          'content-type': 'text/plain'
        },
        data: '{"x":1}'
      });

      const result = await reader.read({ id: 'id', path: 'path', method: 'POST' }, 'POST', new StoryOutputs())
      expect(result.content_type).toEqual("text/plain")
      expect(result.payload).toEqual('{"x":1}')
    })

    it('application/json', async () => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        data: '{"x":1}'
      });

      const result = await reader.read({ id: 'id', path: 'path', method: 'POST' }, 'POST', new StoryOutputs())
      expect(result.content_type).toEqual("application/json")
      expect(result.payload).toEqual({ "x": 1 })
    })

    it('application/yaml', async () => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {
          'content-type': 'application/yaml'
        },
        data: "---\nx: 1"
      });

      const result = await reader.read({ id: 'id', path: 'path', method: 'POST' }, 'POST', new StoryOutputs())
      expect(result.content_type).toEqual("application/yaml")
      expect(result.payload).toEqual({ "x": 1 })
    })

    it('application/cbor', async () => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {
          'content-type': 'application/cbor'
        },
        data: new Uint8Array([130, 97, 120, 161, 97, 121, 1]).buffer
      });

      const result = await reader.read({ id: 'id', path: 'path', method: 'POST' }, 'POST', new StoryOutputs())
      expect(result.content_type).toEqual("application/cbor")
      expect(result.payload).toEqual(["x", { "y": 1 }])
    })

    it('application/smile', async () => {
      mocked_axios.request.mockResolvedValue({
        status: 200,
        headers: {
          'content-type': 'application/smile'
        },
        data: new Uint8Array([
          0x3a, 0x29, 0x0a, 0x00, 0xfa, 0x83, 0x6e, 0x61, 0x6d, 0x65, 0x42, 0x42, 0x6f,
          0x62, 0x82, 0x61, 0x67, 0x65, 0x24, 0xb2, 0x84, 0x73, 0x63, 0x6f, 0x72, 0x65,
          0x29, 0x00, 0x40, 0x2c, 0x0c, 0x66, 0x33, 0x19, 0x4c, 0x66, 0x33, 0xfb
        ]).buffer
      });

      const result = await reader.read({ id: 'id', path: 'path', method: 'POST' }, 'POST', new StoryOutputs())
      expect(result.content_type).toEqual("application/smile")
      expect(result.payload).toEqual({ age: 25, name: "Bob", score: 96.8 })
    })
  })
})

