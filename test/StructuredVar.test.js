const test = require('ava')

const StructuredVar = require('../lib/StructuredVar')

test('.getOriginalVarNames', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const cssText = ``
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = ['mainStyle', 'day']

  t.deepEqual(structuredVar.getOriginalVarNames(), expected)
})

test('.getOriginalJsVarName', (t) => {
  const partOfJsVarName = 'main-style.day'
  const cssText = ``
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = 'mainStyle.day'

  t.deepEqual(structuredVar.getOriginalJsVarName(), expected)
})

test('.getOriginalCssVarName', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const cssText = ``
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = '--main-style__day'

  t.deepEqual(structuredVar.getOriginalCssVarName(), expected)
})

test('.getTailVarObject', (t) => {
  const partOfJsVarName = 'mainStyle'
  const cssText = `
    --main-style__day__bg-color: pink;
    --main-style__day__ft-color: black;
    --main-style__night__bg-color: black;
    --main-style__night__ft-color: white;
  `
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = { day: { bgColor: 'pink', ftColor: 'black' }, night: { bgColor: 'black', ftColor: 'white' } }

  t.deepEqual(structuredVar.getTailVarObject(), expected)
})

test('.getFullVarObject', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const cssText = `
    --main-style__day__bg-color: pink;
    --main-style__day__ft-color: black;
    --main-style__night__bg-color: black;
    --main-style__night__ft-color: white;
  `
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = { mainStyle: { day: { bgColor: 'pink', ftColor: 'black' } } }

  t.deepEqual(structuredVar.getFullVarObject(), expected)
})

test('.getFullJsVars', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const cssText = `
    --main-style__day__bg-color: pink;
    --main-style__day__ft-color: black;
    --main-style__night__bg-color: black;
    --main-style__night__ft-color: white;
  `
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = { 'mainStyle.day.bgColor': 'pink', 'mainStyle.day.ftColor': 'black' }

  t.deepEqual(structuredVar.getFullJsVars(), expected)
})

test('.getFullCssVars', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const cssText = `
    --main-style__day__bg-color: pink;
    --main-style__day__ft-color: black;
    --main-style__night__bg-color: black;
    --main-style__night__ft-color: white;
  `
  const structuredVar = new StructuredVar(partOfJsVarName, cssText)

  const expected = { 'main-style__day__bg-color': 'pink', 'main-style__day__ft-color': 'black' }

  t.deepEqual(structuredVar.getFullCssVars(), expected)
})
