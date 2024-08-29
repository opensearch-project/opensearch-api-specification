/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterOutput } from 'tester/ChapterOutput'
import { StoryOutputs } from 'tester/StoryOutputs'

const story_outputs = new StoryOutputs({
  chapter_id: new ChapterOutput({
    x: 1,
    y: 2,
    n: null,
    z: 0
  })
})

test('resolve_string', () => {
  expect(story_outputs.resolve_string('${chapter_id.x}')).toEqual(1)
  expect(story_outputs.resolve_string('${invalid_id.x}')).toBeUndefined()
  expect(story_outputs.resolve_string('some_str')).toEqual('some_str')
})

test('resolve_string defaults', () => {
  expect(story_outputs.resolve_string('${chapter_id.n ? x}')).toEqual('x')
  expect(story_outputs.resolve_string('${chapter_id.n ? 0}')).toEqual(0)
  expect(story_outputs.resolve_string('${chapter_id.z ? -1}')).toEqual(0)
  expect(story_outputs.resolve_string('${chapter_id.n ? a_string }')).toEqual('a_string')
  expect(story_outputs.resolve_string('${chapter_id.n ? \'-1\'}')).toEqual('-1')
  expect(story_outputs.resolve_string('${chapter_id.z ? a_string }')).toEqual(0)
  expect(story_outputs.resolve_string('${chapter_id.z ? \'-1\'}')).toEqual(0)
})

test('resolve_value', () => {
  const value = {
    a: '${chapter_id.x}',
    b: ['${chapter_id.x}', '${chapter_id.y}', 3],
    c: {
      d: '${chapter_id.x}',
      e: 'str',
      f: true
    },
    g: 123,
    '${chapter_id.x}': 345
  }
  expect(story_outputs.resolve_value(value)).toEqual(
    {
      a: 1,
      b: [1, 2, 3],
      c: {
        d: 1,
        e: 'str',
        f: true
      },
      g: 123,
      1: 345
    }
  )
})

test('resolve_params', () => {
  const parameters = {
    a: '${chapter_id.x}',
    b: '${chapter_id.y}',
    c: 3,
    d: 'str'
  }
  expect(story_outputs.resolve_params(parameters)).toEqual({
    a: 1,
    b: 2,
    c: 3,
    d: 'str'
  })
})


