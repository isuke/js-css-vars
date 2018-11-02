const kebabCase = require('lodash.kebabcase')

module.exports = {
  get: (varName) => {
    return document.documentElement.style.getPropertyValue(`--${kebabCase(varName)}`)
  },

  set: (varName, val) => {
    document.documentElement.style.setProperty(`--${kebabCase(varName)}`, val)
  },
}
