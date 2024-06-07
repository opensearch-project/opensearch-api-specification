/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import * as ansi from 'tester/Ansi'

test('b', () => {
  expect(ansi.b('xyz')).toEqual('\x1b[1mxyz\x1b[0m')
})

test('i', () => {
  expect(ansi.i('xyz')).toEqual('\x1b[3mxyz\x1b[0m')
})

test('padding', () => {
  expect(ansi.padding('xyz', 10)).toEqual('xyz       ')
  expect(ansi.padding('xyz', 10, 2)).toEqual('  xyz       ')
  expect(ansi.padding('xyz', 10, 8)).toEqual('        xyz       ')
  expect(ansi.padding('xyz', 2)).toEqual('xyz')
})

test('green', () => {
  expect(ansi.green('xyz')).toEqual('\x1b[32mxyz\x1b[0m')
})

test('red', () => {
  expect(ansi.red('xyz')).toEqual('\x1b[31mxyz\x1b[0m')
})

test('yellow', () => {
  expect(ansi.yellow('xyz')).toEqual('\x1b[33mxyz\x1b[0m')
})

test('cyan', () => {
  expect(ansi.cyan('xyz')).toEqual('\x1b[36mxyz\x1b[0m')
})

test('gray', () => {
  expect(ansi.gray('xyz')).toEqual('\x1b[90mxyz\x1b[0m')
})

test('magenta', () => {
  expect(ansi.magenta('xyz')).toEqual('\x1b[35mxyz\x1b[0m')
})
