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

test.todo('--tab-width')

test('--dry-run', () => {
  const test_yaml = 'tools/tests/tester/fixtures/empty_with_all_the_parts.yaml'
  const s = spec(['--dry-run', '--tests', test_yaml]).stdout
  const full_path = path.join(__dirname, '../../../' + test_yaml)
  expect(s).toEqual(`${ansi.yellow('SKIPPED')} ${ansi.cyan(ansi.b('A story with all its parts.'))} ${ansi.gray('(' + full_path + ')')}\n\n\n`)
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
