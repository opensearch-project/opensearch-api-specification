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
