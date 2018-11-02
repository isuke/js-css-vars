const kebabCase = require('lodash.kebabcase')

const JsVarSeparateStr = '.'
const CssVarSeparateStr = '--'

const get = (varName) => {
  return document.documentElement.style.getPropertyValue(`--${varName}`)
}

const set = (varName, val) => {
  const renamedVarName = varName
    .replace(/^--/, '')
    .split(new RegExp(`\\${JsVarSeparateStr}|\\${CssVarSeparateStr}`))
    .map((s) => kebabCase(s))
    .join(CssVarSeparateStr)
  document.documentElement.style.setProperty(`--${renamedVarName}`, val)
}

module.exports = {
  get: get,
  set: set,
}
