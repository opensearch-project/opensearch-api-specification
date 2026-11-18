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
  const start = spawnSync('ts-node', ['tools/src/prepare-for-vale/prepare-for-vale.ts'].concat(args))
  return {
    stdout: start.stdout?.toString(),
    stderr: start.stderr?.toString()
  }
}

test('--help', () => {
  expect(spec(['--help']).stdout).toContain('Usage: prepare-for-vale [options]')
})
