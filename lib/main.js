const StructuredVar = require('./StructuredVar')

/**
 * TODO
 */
const JsVarSeparateStr = '.'

/**
 * TODO
 */
const CssVarSeparateStr = '__'

module.exports = {
  getObject: (jsVarName) => {
    const structuredVar = new StructuredVar(jsVarName, document.documentElement.style, JsVarSeparateStr, CssVarSeparateStr)
    return structuredVar.fullVarObject
  },
  getJsVars: (jsVarName) => {
    const structuredVar = new StructuredVar(jsVarName, document.documentElement.style, JsVarSeparateStr, CssVarSeparateStr)
    return structuredVar.fullJsVars
  },
  getCssVars: (jsVarName) => {
    const structuredVar = new StructuredVar(jsVarName, document.documentElement.style, JsVarSeparateStr, CssVarSeparateStr)
    return structuredVar.fullCssVars
  },
  setValue: (jsVarName, value) => {
    const structuredVar = new StructuredVar(jsVarName, document.documentElement.style, JsVarSeparateStr, CssVarSeparateStr)

    if (typeof value === 'object') {
      return structuredVar.putObject(value)
    } else {
      return structuredVar.putValue(value)
    }
  },
  setVar: (jsVarName, valueJsVarName) => {
    const structuredVar = new StructuredVar(jsVarName, document.documentElement.style, JsVarSeparateStr, CssVarSeparateStr)
    return structuredVar.putVar(valueJsVarName)
  },
  setVars: (jsVarName, valueJsVarName) => {
    const structuredVar = new StructuredVar(jsVarName, document.documentElement.style, JsVarSeparateStr, CssVarSeparateStr)
    return structuredVar.putVars(valueJsVarName)
  },
}
