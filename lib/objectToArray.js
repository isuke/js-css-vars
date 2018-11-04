const forEach = require('lodash.foreach')

const objectToArray = (object, acc = []) => {
  let result = []

  forEach(object, (value, key) => {
    if (typeof value == 'object') {
      result = result.concat(objectToArray(value, acc.concat([key])))
    } else {
      result.push(acc.concat([key, value]))
    }
  })

  return result
}

module.exports = objectToArray
