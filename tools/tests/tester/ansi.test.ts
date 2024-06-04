/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import * as ansi from '../../src/tester/Ansi'

test('b', async () => {
  expect(ansi.b('xyz')).toEqual('\x1b[1mxyz\x1b[0m')
})

test('i', async () => {
  expect(ansi.i('xyz')).toEqual('\x1b[3mxyz\x1b[0m')
})

test.todo('padding')
test.todo('green')
test.todo('red')
test.todo('yellow')
test.todo('cyan')
test.todo('gray')
test.todo('magenta')
