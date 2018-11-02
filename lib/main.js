const kebabCase = require('lodash.kebabcase')
const arrayToObject = require('./arrayToObject')

/**
 * TODO
 */
const JsVarSeparateStr = '.'

/**
 * TODO
 */
const CssVarSeparateStr = '--'

/**
 * TODO
 * @param {string} jsVarName TODO
 * @return {string} TODO
 * @example <code>renameJsVarNameToCssVarName('fooBar') // => 'foo-bar'</code>
 * @example <code>renameJsVarNameToCssVarName('fooBar.bgColor') // => 'foo-bar--bg-color'</code>
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
 * @return {Hash} TODO
 * @example
 *     <code>
 *       // css
 *       --foo-bar--day--bg-color: pink;
 *       --foo-bar--day--ft-color: black;
 *       --foo-bar--night--bg-color: black;
 *       --foo-bar--night--ft-color: white;
 *
 *       // js
 *       getCssVarObject('fooBar') // => { day: { bgColor: 'pink', ftColor: 'black' }, night: { bgColor: 'black', ftColor: 'white' } }
 *       getCssVarObject('fooBar.day') // => { bgColor: 'pink', ftColor: 'black' }
 *       getCssVarObject('fooBar.day.bgColor') // => {}
 *     </code>
 */
const getObject = (jsVarName) => {
  const renamedCssVarName = renameJsVarNameToCssVarName(jsVarName)

  const varStrs = document.documentElement.style.cssText.match(new RegExp(`${renamedCssVarName}.*?:.*?;`, 'g'))

  if (!varStrs) {
    return
  } else {
    return varStrs.reduce((acc, cur) => {
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
}

/**
 * TODO
 * @param {string} jsVarName TODO
 * @return {string} TODO
 * @example
 *     <code>
 *       // css
 *       --foo-bar--day--bg-color: pink;
 *       --foo-bar--day--ft-color: black;
 *
 *       // js
 *       getCssVarObject('fooBar.day') // => ""
 *       getCssVarObject('fooBar.day.bgColor') // => "pink"
 *     </code>
 */
const getValue = (jsVarName) => {
  return document.documentElement.style.getPropertyValue(renameJsVarNameToCssVarName(jsVarName))
}

const set = (jsVarName, val) => {
  document.documentElement.style.setProperty(`${renameJsVarNameToCssVarName(jsVarName)}`, val)
}

module.exports = {
  getObject: getObject,
  getValue: getValue,
  set: set,
}
