import test from 'tape'

/* eslint-disable */

test('good test', t => {
  t.ok(true)
  t.end()
})

test('good test 2', t => {
  t.ok(1)
  t.end()
})

test('bad test', t => {
  t.ok(undefined.length)
  t.end()
})
