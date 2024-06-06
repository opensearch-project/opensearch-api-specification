import { spawnSync } from 'child_process'
import * as ansi from '../../src/tester/Ansi'
import { extract_output_values, resolve_params, resolve_string, resolve_value } from '../../src/tester/helpers'
import { ActualResponse } from 'tester/types/story.types'
import { ChapterOutput, EvaluationWithOutput, Result } from 'tester/types/eval.types'

const spec = (args: string[]): any => {
  const start = spawnSync('ts-node', ['tools/src/tester/start.ts'].concat(args), {
    env: { ...process.env, OPENSEARCH_PASSWORD: 'password' }
  })
  return {
    stdout: start.stdout?.toString(),
    stderr: start.stderr?.toString()
  }
}

test('--help', async () => {
  expect(spec(['--help']).stdout).toContain('Usage: start [options]')
})

test('--invalid', async () => {
  expect(spec(['--invalid']).stderr).toContain("error: unknown option '--invalid'")
})

test('--tests', async () => {
  expect(spec(['--tests', 'tools/tests/tester/fixtures']).stdout).toContain(
    `${ansi.green('PASSED ')} ${ansi.cyan(ansi.b('empty.yaml'))}`
  )
})

function create_response(payload: any): ActualResponse {
  return {
    status: 200,
    content_type: 'application/json',
    payload
  }
}

function passed_output(output: ChapterOutput): EvaluationWithOutput {
  return {
    result: Result.PASSED,
    output: output
  }
}


test('extract_output_values', async () => {
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

const story_outputs = {
  chapter_id: {
    x: 1,
    y: 2
  }
}

test("resolve_string", async () => {
  expect(resolve_string('${chapter_id.x}', story_outputs)).toEqual(1)
  expect(resolve_string('some_str', story_outputs)).toEqual('some_str')
})

test("resolve_value", async () => {
  const value = {
    a: "${chapter_id.x}",
    b: ["${chapter_id.x}", "${chapter_id.y}", 3],
    c: {
      d: "${chapter_id.x}",
      e: "str",
      f: true
    },
    g: 123
  }
  expect(resolve_value(value, story_outputs)).toEqual(
    {
      a: 1,
      b: [1, 2, 3],
      c: {
        d: 1,
        e: "str",
        f: true
      },
      g: 123
    }
  )
})

test("resolve_params", async () => {
  const parameters = {
    a: "${chapter_id.x}",
    b: "${chapter_id.y}",
    c: 3,
    d: "str"
  }
  expect(resolve_params(parameters, story_outputs)).toEqual({
    a: 1,
    b: 2,
    c: 3,
    d: "str"
  })
})

test.todo('--tab-width')
test.todo('--verbose')
test.todo('--spec')
