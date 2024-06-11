/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { spawnSync } from 'child_process'
import * as ansi from 'tester/Ansi'
import * as path from 'path'
import { type Chapter, type ChapterRequest, type Output, type RequestBody, type ActualResponse, Story } from 'tester/types/story.types'
import { type EvaluationWithOutput, Result, ChapterEvaluation, StoryEvaluation } from 'tester/types/eval.types'
import { ChapterOutput } from 'tester/ChapterOutput'
import StoryEvaluator from 'tester/StoryEvaluator'

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

function create_response(payload: any): ActualResponse {
  return {
    status: 200,
    content_type: 'application/json',
    payload
  }
}

function passed_output(output: Record<string, any>): EvaluationWithOutput {
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
  expect(ChapterOutput.extract_output_values(response, output1)).toEqual(passed_output({
    c: 1,
    d: 2,
    e: 3
  }))
  expect(ChapterOutput.extract_output_values(response, { x: 'payload' })).toEqual(
    passed_output({ x: response.payload })
  )
  expect(ChapterOutput.extract_output_values(response, { x: 'payload.a.b.x[0]' })).toEqual({
    result: Result.ERROR,
    message: 'Expected to find non undefined value at `payload.a.b.x[0]`.'
  })
})

function dummy_chapter_request(id?: string, output?: Output): ChapterRequest {
  return {
    id,
    path: '/path',
    method: 'GET',
    output
  }
}

function dummy_chapter_request_with_input(parameters?: Record<string, any>, request_body?: RequestBody, id?: string, output?: Output): ChapterRequest {
  return {
    ...dummy_chapter_request(id, output),
    parameters,
    request_body
  }
}

function chapter(synopsis: string, request: ChapterRequest): Chapter {
  return {
    synopsis,
    ...request
  }
}

 
test('check_story_variables', () => {
  const check_story_variables = (s: Story): StoryEvaluation | undefined => StoryEvaluator.check_story_variables(s, 'display_path', 'full_path')
  const failed = (prologues: ChapterEvaluation[] = [], chapters: ChapterEvaluation[] = []): StoryEvaluation => ({
    result: Result.ERROR,
    description: 'story1',
    display_path: 'display_path',
    full_path: 'full_path',
    message: 'The story was defined with incorrect variables',
    prologues,
    chapters,
    epilogues: []
  })
  expect(check_story_variables({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue1.x}' }))
    ]
  })).toStrictEqual(undefined)

  expect(check_story_variables({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue1.y}' }))
    ]
  })).toStrictEqual(
    failed(
      [{ title: "GET /path", overall: { result: Result.PASSED } }],
      [{ title: 'GET /path', overall: { result: Result.FAILED, message: 'Chapter makes reference to non existent output "y" in chapter "prologue1"' } }]
    )
  )

  expect(check_story_variables({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue2.x}' }))
    ]
  })).toStrictEqual(
    failed(
      [{ title: "GET /path", overall: { result: Result.PASSED } }],
      [{ title: 'GET /path', overall: { result: Result.FAILED, message: 'Chapter makes reference to non existent chapter "prologue2' } }]
    )
  )

  expect(check_story_variables({
    description: 'story1',
    prologues: [
      dummy_chapter_request(undefined, { x: 'payload.x' })
    ],
    chapters: []
  })).toStrictEqual(
    failed(
      [
        { title: "GET /path", overall: { result: Result.FAILED, message: 'An episode must have an id to store its output' } }
      ]
    )
  )

  expect(check_story_variables({
    description: 'story1',
    prologues: [
      dummy_chapter_request('prologue1', { x: 'payload.x' })
    ],
    chapters: [
      chapter('synopsis-1', dummy_chapter_request_with_input({ 'param-x': '${prologue1.x}' }, undefined, 'chapter1', { y: 'payload.y' })),
      chapter('synopsis-2', dummy_chapter_request_with_input({ 'param-y': '${chapter1.y}' }))
    ]
  })).toStrictEqual(undefined)
})
 

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
