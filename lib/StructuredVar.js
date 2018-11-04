const kebabCase = require('lodash.kebabcase')
const arrayToObject = require('./arrayToObject')
const objectToArray = require('./objectToArray')

const StructuredVar = class {
  constructor(partOfJsVarName, jsVarSeparateStr = '.', cssVarSeparateStr = '__', cssText = document.documentElement.style.cssText) {
    this.partOfJsVarName = Object.freeze(partOfJsVarName)
    this.jsVarSeparateStr = Object.freeze(jsVarSeparateStr)
    this.cssVarSeparateStr = Object.freeze(cssVarSeparateStr)
    this.cssText = Object.freeze(cssText)
  }

  getOriginalVarNames() {
    if (!this.originalVarNames) {
      this.originalVarNames = this.partOfJsVarName.split(new RegExp(`\\${this.jsVarSeparateSt}|\\${this.cssVarSeparateStr}`)).map((s) => kebabCase(s))
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
      this.originalCssVarName = this.getOriginalVarNames().join(this.cssVarSeparateStr)
    }
    return this.originalCssVarName
  }

  getTailVarObject() {
    if (!this.tailVarObject) {
      this.tailVarObject = this._fetchCssVars().reduce((acc, cur) => {
        const match = cur.match(new RegExp(`${this.getOriginalCssVarName()}(.*?):(.*?);`))
        const array = match[1].replace(new RegExp(`^${this.cssVarSeparateStr}`), '').split(this.cssVarSeparateStr)
        const value = match[2]
        if (array.length <= 1 && !array[0]) {
          return acc
        } else {
          return Object.assign(acc, arrayToObject(array, value))
        }
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
      this.fullCssVars = this._getFullVars(this.cssVarSeparateStr)
    }
    return this.fullCssVars
  }

  _getFullVars(separateStr) {
    let result = {}
    objectToArray(this.getFullVarObject()).map((array) => {
      const names = array.slice(0, array.length - 1)
      const value = array[array.length - 1]

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
