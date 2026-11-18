/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterOutput } from 'tester/ChapterOutput'
import { EvaluationWithOutput, Result } from 'tester/types/eval.types'
import { ActualResponse } from 'tester/types/story.types'

function create_response(payload: any): ActualResponse {
  return {
    status: 200,
    content_type: 'application/json',
    payload
  }
}

function passed_output(output: Record<string, any>): EvaluationWithOutput {
  return {
    evaluation: { result: Result.PASSED },
    output: new ChapterOutput(output)
  }
}

describe('with an object response', () => {
  const response: ActualResponse = create_response({
    a: {
      b: {
        c: 1
      },
      arr: [
        { d: 2 },
        { e: 3 }
      ]
    },
    zero: 0
  })

  test('returns nested values', () => {
    const output = {
      c: 'payload.a.b.c',
      d: 'payload.a.arr[0].d',
      e: 'payload.a.arr[1].e'
    }

    expect(ChapterOutput.extract_output_values(response, output)).toEqual(passed_output({
      c: 1,
      d: 2,
      e: 3
    }))
  })

  test('extracts complete payload', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'payload' })).toEqual(
      passed_output({ x: response.payload })
    )
  })

  test('errors on undefined value', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'payload.a.b.x[0]' })).toEqual({
      evaluation: {
        result: Result.ERROR,
        message: 'Expected to find non undefined value at `payload.a.b.x[0]`.'
      }
    })
  })

  test('uses a default numeric value', () => {
    expect(ChapterOutput.extract_output_values(response, { x: { path: 'payload.a.b.x[0]', default: -1 } })).toEqual(
      passed_output({ x: -1 })
    )
  })

  test('uses a default string value', () => {
    expect(ChapterOutput.extract_output_values(response, { x: { path: 'payload.a.b.x[0]', default: 'a_string' } })).toEqual(
      passed_output({ x: 'a_string' })
    )
  })

  test('does not use a default value on a numeric zero', () => {
    expect(ChapterOutput.extract_output_values(response, { x: { path: 'payload.zero', default: '-1' } })).toEqual(
      passed_output({ x: 0 })
    )
  })

  test('errors on invalid source', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'foobar' })).toEqual({
      evaluation: {
        result: Result.ERROR,
        message: 'Unknown output source: foobar.'
      }
    })
  })
})

describe('with an array response', () => {
  const response: ActualResponse = create_response([
    {
      a: {
        b: {
          c: 1
        },
        arr: [
          { d: 2 },
          { e: 3 }
        ]
      }
    },{
      a: {
        b: {
          c: 2
        },
        arr: [
          { d: 3 },
          { e: 4 }
        ]
      }
    },
  ])

  test('returns nested values', () => {
    const output = {
      c1: 'payload[0].a.b.c',
      d1: 'payload[0].a.arr[0].d',
      e1: 'payload[0].a.arr[1].e',
      c2: 'payload[1].a.b.c',
      d2: 'payload[1].a.arr[0].d',
      e2: 'payload[1].a.arr[1].e'
    }

    expect(ChapterOutput.extract_output_values(response, output)).toEqual(passed_output({
      c1: 1,
      d1: 2,
      e1: 3,
      c2: 2,
      d2: 3,
      e2: 4
    }))
  })

  test('extracts complete payload', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'payload' })).toEqual(
      passed_output({ x: response.payload })
    )
  })

  test('errors on undefined value', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'payload[0].a.b.x[0]' })).toEqual({
      evaluation: {
        result: Result.ERROR,
        message: 'Expected to find non undefined value at `payload[0].a.b.x[0]`.'
      }
    })
  })

  test('errors on invalid source', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'foobar' })).toEqual({
      evaluation: {
        result: Result.ERROR,
        message: 'Unknown output source: foobar.'
      }
    })
  })

  test('errors on invalid index', () => {
    expect(ChapterOutput.extract_output_values(response, { x: 'payload[2]' })).toEqual({
      evaluation: {
        result: Result.ERROR,
        message: 'Expected to find non undefined value at `payload[2]`.'
      }
    })
  })
})
