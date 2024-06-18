/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { spawnSync } from 'child_process'

const spec = (args: string[]): any => {
  const start = spawnSync('ts-node', ['tools/src/linter/lint.ts'].concat(args))
  return {
    stdout: start.stdout?.toString(),
    stderr: start.stderr?.toString()
  }
}

test('--help', () => {
  const output = spec(['--help'])
  expect(output.stderr).toEqual('')
  expect(output.stdout).toContain('Usage: lint [options]')
})
