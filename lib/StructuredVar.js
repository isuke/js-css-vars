const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const merge = require('lodash.merge')
const arrayToObject = require('./arrayToObject')
const objectToArray = require('./objectToArray')

const StructuredVar = class {
  constructor(partOfJsVarName, cssText = document.documentElement.style.cssText, jsVarSeparateStr = '.', cssVarSeparateStr = '__') {
    this.partOfJsVarName = Object.freeze(partOfJsVarName)
    this.cssText = Object.freeze(cssText)
    this.jsVarSeparateStr = Object.freeze(jsVarSeparateStr)
    this.cssVarSeparateStr = Object.freeze(cssVarSeparateStr)
  }

  getOriginalVarNames() {
    if (!this.originalVarNames) {
      this.originalVarNames = this.partOfJsVarName.split(new RegExp(`\\${this.jsVarSeparateStr}|\\${this.cssVarSeparateStr}`, 'g')).map((s) => camelCase(s))
    }
    return this.originalVarNames
  }

  getOriginalJsVarName() {
    if (!this.originalJsVarName) {
      this.originalJsVarName = this.getOriginalVarNames().join(this.jsVarSeparateStr)
    }
    return this.originalJsVarName
  }

  getOriginalCssVarName() {
    if (!this.originalCssVarName) {
      this.originalCssVarName =
        '--' +
        this.getOriginalVarNames()
          .map((s) => kebabCase(s))
          .join(this.cssVarSeparateStr)
    }
    return this.originalCssVarName
  }

  getTailVarObject() {
    if (!this.tailVarObject) {
      this.tailVarObject = this._fetchCssVars().reduce((acc, cur) => {
        const match = cur.match(new RegExp(`${this.getOriginalCssVarName()}(.*?):(.*?);`))
        const array = match[1]
          .replace(new RegExp(`^${this.cssVarSeparateStr}`), '')
          .split(this.cssVarSeparateStr)
          .map((s) => camelCase(s))
        const value = match[2].trim()

        return merge(acc, arrayToObject(array, value))
      }, {})
    }
    return this.tailVarObject
  }

  getFullVarObject() {
    if (!this.fullVarObject) {
      this.fullVarObject = arrayToObject(this.getOriginalVarNames(), this.getTailVarObject())
    }
    return this.fullVarObject
  }

  getFullJsVars() {
    if (!this.fullJsVars) {
      this.fullJsVars = this._getFullVars(this.jsVarSeparateStr)
    }
    return this.fullJsVars
  }

  getFullCssVars() {
    if (!this.fullCssVars) {
      this.fullCssVars = this._getFullVars(this.cssVarSeparateStr, (names) => {
        return names.map((s) => kebabCase(s))
      })
    }
    return this.fullCssVars
  }

  _getFullVars(separateStr, call = undefined) {
    let result = {}
    objectToArray(this.getFullVarObject()).map((array) => {
      let names = array.slice(0, array.length - 1)
      const value = array[array.length - 1]

      if (typeof call === 'function') {
        names = call(names)
      }

      result[names.join(separateStr)] = value
    })

    return result
  }

  _fetchCssVars() {
    const varStrs = this.cssText.match(new RegExp(`${this.getOriginalCssVarName()}.*?:.*?;`, 'g'))
    return varStrs ? varStrs : []
  }
}

module.exports = StructuredVar
