/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { spawnSync } from 'child_process'
import * as ansi from '../../src/tester/Ansi'
import * as path from 'path'
import { check_story_variables as get_bad_references, extract_output_values } from '../../src/tester/helpers'
import { type Chapter, type ChapterRequest, type Output, type RequestBody, type ActualResponse } from 'tester/types/story.types'
import { type EvaluationWithOutput, Result } from 'tester/types/eval.types'
import { ChapterOutput } from 'tester/ChapterOutput'
import { StoryOutputs } from 'tester/StoryOutputs'

const spec = (args: string[]): any => {
  const start = spawnSync('ts-node', ['tools/src/tester/start.ts'].concat(args), {
    env: { ...process.env, OPENSEARCH_PASSWORD: 'password' }
  })
  return {
    stdout: start.stdout?.toString(),
    stderr: start.stderr?.toString()
  }
}

test('--help', () => {
  expect(spec(['--help']).stdout).toContain('Usage: start [options]')
})

test('--invalid', () => {
  expect(spec(['--invalid']).stderr).toContain("error: unknown option '--invalid'")
})

test('displays story filename', () => {
  expect(spec(['--tests', 'tools/tests/tester/fixtures/empty_story']).stdout).toContain(
    `${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('empty.yaml'))}`
  )
})

test('displays story description', () => {
  expect(spec(['--tests', 'tools/tests/tester/fixtures/empty_with_description.yaml']).stdout).toContain(
    `${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('A story with no beginning or end.'))}`
  )
})

function create_response (payload: any): ActualResponse {
  return {
    status: 200,
    content_type: 'application/json',
    payload
  }
}

function passed_output (output: Record<string, any>): EvaluationWithOutput {
  return {
    result: Result.PASSED,
    output: new ChapterOutput(output)
  }
}

test('extract_output_values', () => {
  const response: ActualResponse = create_response({
    a: {
      b: {
        c: 1
      },
      arr: [
        { d: 2 },
        { e: 3 }
      ]
    }
  })
  const output1 = {
    c: 'payload.a.b.c',
    d: 'payload.a.arr[0].d',
    e: 'payload.a.arr[1].e'
  }
  expect(extract_output_values(response, output1)).toEqual(passed_output({
    c: 1,
    d: 2,
    e: 3
  }))
  expect(extract_output_values(response, { x: 'payload' })).toEqual(
    passed_output({ x: response.payload })
  )
  expect(extract_output_values(response, { x: 'payload.a.b.x[0]' })).toEqual({
    result: Result.ERROR,
    message: 'Expected to find non undefined value at `payload.a.b.x[0]`.'
  })
})

const story_outputs = new StoryOutputs({
  chapter_id: new ChapterOutput({
    x: 1,
    y: 2
  })
})

/* eslint-disable no-template-curly-in-string */
test('resolve_string', () => {
  expect(story_outputs.resolve_string('${chapter_id.x}')).toEqual(1)
  expect(story_outputs.resolve_string('some_str')).toEqual('some_str')
})
/* eslint-enable no-template-curly-in-string */

test('resolve_value', () => {
  /* eslint-disable no-template-curly-in-string */
  const value = {
    a: '${chapter_id.x}',
    b: ['${chapter_id.x}', '${chapter_id.y}', 3],
    c: {
      d: '${chapter_id.x}',
      e: 'str',
      f: true
    },
    g: 123
  }
  /* eslint-enable no-template-curly-in-string */
  expect(story_outputs.resolve_value(value)).toEqual(
    {
      a: 1,
      b: [1, 2, 3],
      c: {
        d: 1,
        e: 'str',
        f: true
      },
      g: 123
    }
  )
})

test('resolve_params', () => {
  /* eslint-disable no-template-curly-in-string */
  const parameters = {
    a: '${chapter_id.x}',
    b: '${chapter_id.y}',
    c: 3,
    d: 'str'
  }
  /* eslint-enable no-template-curly-in-string */
  expect(story_outputs.resolve_params(parameters)).toEqual({
    a: 1,
    b: 2,
    c: 3,
    d: 'str'
  })
})

function dummy_chapter_request (id?: string, output?: Output): ChapterRequest {
  return {
    id,
    path: '/path',
    method: 'GET',
    output
  }
}

function dummy_chapter_request_with_input (parameters?: Record<string, any>, request_body?: RequestBody, id?: string, output?: Output): ChapterRequest {
  return {
    ...dummy_chapter_request(id, output),
    parameters,
    request_body
  }
}

function chapter (synopsis: string, request: ChapterRequest): Chapter {
  return {
    synopsis,
    ...request
  }
}

/* eslint-disable no-template-curly-in-string */
test('get_bad_references', () => {
  expect(get_bad_references({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue1.x}' }))
    ]
  })).toBe(undefined)

  expect(get_bad_references({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue1.y}' }))
    ]
  })).toBe('Chapter makes reference to non existent output "y" in chapter "prologue1"')

  expect(get_bad_references({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue2.x}' }))
    ]
  })).toBe('Chapter makes reference to non existent chapter "prologue2')

  expect(get_bad_references({
    description: 'story1',
    prologues: [
      dummy_chapter_request(undefined, { x: 'payload.x' })
    ],
    chapters: []
  })).toBe('An episode must have an id to store its output')

  expect(get_bad_references({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue1.x}' }, undefined, 'chapter1', { y: 'payload.y' })),
      chapter('synopsis-2', dummy_chapter_request_with_input({ 'param-y': '${chapter1.y}' }))
    ]
  })).toBe(undefined)
})
/* eslint-enable no-template-curly-in-string */

test.todo('--tab-width')

test('--dry-run', () => {
  const test_yaml = 'tools/tests/tester/fixtures/empty_with_all_the_parts.yaml'
  const s = spec(['--dry-run', '--tests', test_yaml]).stdout
  const full_path = path.join(__dirname, '../../../' + test_yaml)
  expect(s).not.toContain(`${ansi.yellow('SKIPPED')} CHAPTERS`)
  expect(s).not.toContain(`${ansi.yellow('SKIPPED')} EPILOGUES`)
  expect(s).not.toContain(`${ansi.yellow('SKIPPED')} PROLOGUES`)
  expect(s).toContain(`${ansi.yellow('SKIPPED')} ${ansi.cyan(ansi.b('A story with all its parts.'))} ${ansi.gray('(' + full_path + ')')}\n\n\n`)
})

test('--dry-run --verbose', () => {
  const s = spec(['--dry-run', '--verbose', '--tests', 'tools/tests/tester/fixtures/empty_with_all_the_parts.yaml']).stdout
  expect(s).toContain(`${ansi.yellow('SKIPPED')} ${ansi.cyan(ansi.b('A story with all its parts.'))}`)
  expect(s).toContain(`${ansi.yellow('SKIPPED')} CHAPTERS`)
  expect(s).toContain(`${ansi.yellow('SKIPPED')} EPILOGUES`)
  expect(s).toContain(`${ansi.yellow('SKIPPED')} PROLOGUES`)
  expect(s).toContain(`${ansi.yellow('SKIPPED')} ${ansi.i('A PUT method.')} ${ansi.gray('(Dry Run)')}`)
})

test.todo('--spec')
