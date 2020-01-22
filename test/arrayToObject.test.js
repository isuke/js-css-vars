const test = require('ava')

const arrayToObject = require('../lib/arrayToObject')

test('.arrayToObject', (t) => {
  const array = ['aaa', 'bbb', 'ccc']
  const value = 123
  const expected = { aaa: { bbb: { ccc: 123 } } }
  t.deepEqual(arrayToObject(array, value), expected)
})
