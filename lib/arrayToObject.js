const arrayToObject = (array, value) => {
  let result = {}

  if (array.length == 1) {
    result[array[0]] = value
  } else {
    const [head, ...tail] = array
    result[head] = arrayToObject(tail, value)
  }

  return result
}

module.exports = arrayToObject
