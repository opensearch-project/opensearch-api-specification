/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { spawnSync } from 'child_process'
import fs from 'fs'
import tmp from 'tmp'

const spec = (args: string[]): any => {
  const start = spawnSync('ts-node', ['tools/src/merger/merge.ts'].concat(args))
  return {
    stdout: start.stdout?.toString(),
    stderr: start.stderr?.toString()
  }
}

test('--help', () => {
  expect(spec(['--help']).stdout).toContain('Usage: merge [options]')
})

test('writes one file, with the client model in it', () => {
  const temp = tmp.dirSync({ unsafeCleanup: true })
  spec(['--source', './tools/tests/merger/fixtures/specs/animals', '--output', `${temp.name}/opensearch-openapi.yaml`])
  expect(fs.readdirSync(temp.name)).toEqual(['opensearch-openapi.yaml'])
  expect(fs.readFileSync(`${temp.name}/opensearch-openapi.yaml`, 'utf8')).toContain('x-model:')
  temp.removeCallback()
})

