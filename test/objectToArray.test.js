const test = require('ava')

const objectToArray = require('../lib/objectToArray')

test((t) => {
  const object = { aaa: { bbb: { ccc: 123, eee: 234 } }, fff: 345 }
  const expected = [['aaa', 'bbb', 'ccc', 123], ['aaa', 'bbb', 'eee', 234], ['fff', 345]]
  t.deepEqual(objectToArray(object), expected)
})
