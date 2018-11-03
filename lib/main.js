const kebabCase = require('lodash.kebabcase')
const arrayToObject = require('./arrayToObject')

/**
 * TODO
 */
const JsVarSeparateStr = '.'

/**
 * TODO
 */
const CssVarSeparateStr = '__'

/**
 * TODO
 * @param {string} jsVarName TODO
 * @return {string} TODO
 * @example <code>renameJsVarNameToCssVarName('fooBar') // => '--foo-bar'</code>
 * @example <code>renameJsVarNameToCssVarName('fooBar.bgColor') // => '--foo-bar__bg-color'</code>
 * @example <code>renameJsVarNameToCssVarName('--foo-bar__bg-color') // => '--foo-bar__bg-color'</code>
 */
const renameJsVarNameToCssVarName = (jsVarName) => {
  return (
    '--' +
    jsVarName
      .replace(/^--/, '')
      .split(new RegExp(`\\${JsVarSeparateStr}|\\${CssVarSeparateStr}`))
      .map((s) => kebabCase(s))
      .join(CssVarSeparateStr)
  )
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @return {Array.<string>} TODO
 * @example
 *     <code>
 *       // css
 *       --foo-bar__day__bg-color: pink;
 *       --foo-bar__day__ft-color: black;
 *       --foo-bar__night__bg-color: black;
 *       --foo-bar__night__ft-color: white;
 *
 *       // js
 *       getCssVars('fooBar.day') // => ['--foo-bar__day__bg-color:pink;', '--foo-bar__day__ft-color:black;']
 *       getCssVars('fooBar.day.bgColor') // => ['--foo-bar__day__bg-color:pink;']
 *     </code>
 */
const getCssVars = (jsVarName) => {
  const renamedCssVarName = renameJsVarNameToCssVarName(jsVarName)
  const varStrs = document.documentElement.style.cssText.match(new RegExp(`${renamedCssVarName}.*?:.*?;`, 'g'))
  return varStrs ? varStrs : []
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @return {Hash} TODO
 * @example
 *     <code>
 *       // css
 *       --foo-bar__day__bg-color: pink;
 *       --foo-bar__day__ft-color: black;
 *       --foo-bar__night__bg-color: black;
 *       --foo-bar__night__ft-color: white;
 *
 *       // js
 *       getCssVarObject('fooBar') // => { day: { bgColor: 'pink', ftColor: 'black' }, night: { bgColor: 'black', ftColor: 'white' } }
 *       getCssVarObject('fooBar.day') // => { bgColor: 'pink', ftColor: 'black' }
 *       getCssVarObject('fooBar.day.bgColor') // => {}
 *     </code>
 */
const getObject = (jsVarName) => {
  const renamedCssVarName = renameJsVarNameToCssVarName(jsVarName)

  return getCssVars(jsVarName).reduce((acc, cur) => {
    const match = cur.match(new RegExp(`${renamedCssVarName}(.*?):(.*?);`))
    const array = match[1].replace(new RegExp(`^${CssVarSeparateStr}`), '').split(CssVarSeparateStr)
    const value = match[2]
    if (array.length <= 1 && !array[0]) {
      return acc
    } else {
      return Object.assign(acc, arrayToObject(array, value))
    }
  }, {})
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @return {string} TODO
 * @example
 *     <code>
 *       // css
 *       --foo-bar__day__bg-color: pink;
 *       --foo-bar__day__ft-color: black;
 *
 *       // js
 *       getCssVarObject('fooBar.day') // => ""
 *       getCssVarObject('fooBar.day.bgColor') // => "pink"
 *     </code>
 */
const getValue = (jsVarName) => {
  return document.documentElement.style.getPropertyValue(renameJsVarNameToCssVarName(jsVarName))
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @param {string} value TODO
 */
const setValue = (jsVarName, value) => {
  document.documentElement.style.setProperty(`${renameJsVarNameToCssVarName(jsVarName)}`, value)
  return value
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @param {Object} valueObject TODO
 */
const setObject = (jsVarName, valueObject) => {
  getCssVars(jsVarName).forEach((_cssVar) => {
    // TODO
  })

  return valueObject
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @param {any} value TODO
 */
const set = (jsVarName, value) => {
  if (typeof value == 'object') {
    return setObject(jsVarName, value)
  } else {
    return setValue(jsVarName, value)
  }
}

module.exports = {
  getObject: getObject,
  getValue: getValue,
  set: set,
}
