const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const merge = require('lodash.merge')
const arrayToObject = require('./arrayToObject')
const objectToArray = require('./objectToArray')

const StructuredVar = class {
  constructor(partOfJsVarName, documentStyle = document.documentElement.style, jsVarSeparateStr = '.', cssVarSeparateStr = '__') {
    this.partOfJsVarName = partOfJsVarName
    this.documentStyle = documentStyle
    this.jsVarSeparateStr = jsVarSeparateStr
    this.cssVarSeparateStr = cssVarSeparateStr
  }

  get originalVarNames() {
    if (!this._originalVarNames) {
      this._originalVarNames = this.partOfJsVarName.split(new RegExp(`\\${this.jsVarSeparateStr}|\\${this.cssVarSeparateStr}`, 'g')).map((s) => camelCase(s))
    }
    return this._originalVarNames
  }

  get originalJsVarName() {
    if (!this._originalJsVarName) {
      this._originalJsVarName = this.originalVarNames.join(this.jsVarSeparateStr)
    }
    return this._originalJsVarName
  }

  get originalCssVarName() {
    if (!this._originalCssVarName) {
      this._originalCssVarName = this._createCssVarName(this.originalVarNames)
    }
    return this._originalCssVarName
  }

  get tailVarObject() {
    if (!this._tailVarObject) {
      this._tailVarObject = this._creteObjectFromCssProperties(this.originalCssVarName)
    }
    return this._tailVarObject
  }

  get fullVarObject() {
    if (!this._fullVarObject) {
      const keys = Object.keys(this.tailVarObject)
      if (keys.length <= 1 && !keys[0]) {
        const value = Object.values(this.tailVarObject)[0]
        if (value) {
          this._fullVarObject = arrayToObject(this.originalVarNames, Object.values(this.tailVarObject)[0])
        } else {
          this._fullVarObject = {}
        }
      } else {
        this._fullVarObject = arrayToObject(this.originalVarNames, this.tailVarObject)
      }
    }
    return this._fullVarObject
  }

  get fullJsVars() {
    if (!this._fullJsVars) {
      this._fullJsVars = this._getFullVars(this.jsVarSeparateStr, (names) => {
        return names.join(this.jsVarSeparateStr)
      })
    }
    return this._fullJsVars
  }

  get fullCssVars() {
    if (!this._fullCssVars) {
      this._fullCssVars = this._getFullVars(this.cssVarSeparateStr, (names) => {
        return this._createCssVarName(names)
      })
    }
    return this._fullCssVars
  }

  // TODO: change current value of tailVarObject/fullVarObject.
  putValue(value) {
    const fullCssVarNames = Object.keys(this.fullCssVars)

    if (fullCssVarNames.length === 0) {
      throw new Error(`'${this.originalCssVarName}' is not found.`)
    } else if (fullCssVarNames.length > 1) {
      throw new Error(`'${this.originalCssVarName}' is ambiguous.`)
    }

    this.documentStyle.setProperty(`${fullCssVarNames[0]}`, value)

    return value
  }

  // TODO: change current value of tailVarObject/fullVarObject.
  putObject(value) {
    objectToArray(arrayToObject(this.originalVarNames, value)).map((array) => {
      const name = this._createCssVarName(array.slice(0, array.length - 1))
      const value = array[array.length - 1]

      this.documentStyle.setProperty(name, value)
    })

    return value
  }

  // TODO: change current value of tailVarObject/fullVarObject.
  putVar(jsVarName) {
    const newVarNames = jsVarName.split(this.jsVarSeparateStr)
    const newVarCssName = this._createCssVarName(newVarNames)
    const newVar = this._creteObjectFromCssProperties(newVarCssName)
    const value = Object.values(newVar)[0]

    this.putValue(`var(${newVarCssName})`)

    return value
  }

  // TODO: change current value of tailVarObject/fullVarObject.
  putVars(jsVarName) {
    const newVarNames = jsVarName.split(this.jsVarSeparateStr)
    const newVarCssName = this._createCssVarName(newVarNames)
    const newVar = this._creteObjectFromCssProperties(newVarCssName)

    objectToArray(arrayToObject(newVarNames, newVar)).forEach((array) => {
      const newVarName = this._createCssVarName(array.slice(0, array.length - 1))
      const currentVarName = newVarName.replace(new RegExp(`^${newVarCssName}`), this.originalCssVarName)

      this.documentStyle.setProperty(currentVarName, `var(${newVarName})`)
    })

    return newVar
  }

  _createCssVarName(partOfNames) {
    return '--' + partOfNames.map((s) => kebabCase(s)).join(this.cssVarSeparateStr)
  }

  _getFullVars(separateStr, callback = new Function()) {
    let result = {}
    objectToArray(this.fullVarObject).map((array) => {
      const names = array.slice(0, array.length - 1)
      const value = array[array.length - 1]

      result[callback(names)] = value
    })

    return result
  }

  _creteObjectFromCssProperties(partOfCssVarName) {
    return this._fetchCssProperties(partOfCssVarName).reduce((acc, cur) => {
      const match = cur.match(new RegExp(`${partOfCssVarName}(.*?):(.*?);`))
      const array = match[1]
        .replace(new RegExp(`^${this.cssVarSeparateStr}`), '')
        .split(this.cssVarSeparateStr)
        .map((s) => camelCase(s))
      const value = match[2].trim()

      return merge(acc, arrayToObject(array, value))
    }, {})
  }

  _fetchCssProperties(partOfCssVarName) {
    const varStrs = this.documentStyle.cssText.match(new RegExp(`${partOfCssVarName}.*?:.*?;`, 'g'))
    return varStrs ? varStrs : []
  }
}

module.exports = StructuredVar
