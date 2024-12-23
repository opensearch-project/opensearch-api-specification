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

test('process single link', () => {
  const input = ['description: This is a [link](https://opensearch.org).']
  expect(spec(input).stdout).toContain('description: This is a link.\n')
})

test('process two links', () => {
  const input = ['description: Here is [link one](https://opensearch.org) and [link two](https://opensearch.org/).']
  const expected_output = 'description: Here is link one and link two.\n'
  const result = spec(input).stdout
  expect(result).toBe(expected_output)
})

test('process plain text without links', () => {
  const input = ['description: This is plain text without any links.']
  const expected_output = 'description: This is plain text without any links.\n'
  const result = spec(input).stdout
  expect(result).toBe(expected_output)
})

test('process complex link structures', () => {
  const input = ['description: Check this [link with a title](https://opensearch.org "title").']
  const expected_output = 'description: Check this link with a title.\n'
  const result = spec(input).stdout
  expect(result).toBe(expected_output)
})
