const test = require('ava')

const StructuredVar = require('../lib/StructuredVar')

test('.originalVarNames', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const documentStyle = { cssText: `` }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = ['mainStyle', 'day']

  t.deepEqual(structuredVar.originalVarNames, expected)
})

test('.originalJsVarName', (t) => {
  const partOfJsVarName = 'main-style.day'
  const documentStyle = { cssText: `` }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = 'mainStyle.day'

  t.deepEqual(structuredVar.originalJsVarName, expected)
})

test('.originalCssVarName', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const documentStyle = { cssText: `` }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = '--main-style__day'

  t.deepEqual(structuredVar.originalCssVarName, expected)
})

test('.tailVarObject with part of var name', (t) => {
  const partOfJsVarName = 'mainStyle'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = { day: { bgColor: 'pink', ftColor: 'black' }, night: { bgColor: 'black', ftColor: 'white' } }

  t.deepEqual(structuredVar.tailVarObject, expected)
})

test('.tailVarObject with full var name', (t) => {
  const partOfJsVarName = 'mainStyle.day.bgColor'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = { '': 'pink' }

  t.deepEqual(structuredVar.tailVarObject, expected)
})

test('.fullVarObject with part of var name', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = { mainStyle: { day: { bgColor: 'pink', ftColor: 'black' } } }

  t.deepEqual(structuredVar.fullVarObject, expected)
})

test('.fullVarObject with full var name', (t) => {
  const partOfJsVarName = 'mainStyle.day.bgColor'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = { mainStyle: { day: { bgColor: 'pink' } } }

  t.deepEqual(structuredVar.fullVarObject, expected)
})

test('.fullVarObject with not exist var name', (t) => {
  const partOfJsVarName = 'mainStyle.foo'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = {}

  t.deepEqual(structuredVar.fullVarObject, expected)
})

test('.fullJsVars', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = { 'mainStyle.day.bgColor': 'pink', 'mainStyle.day.ftColor': 'black' }

  t.deepEqual(structuredVar.fullJsVars, expected)
})

test('.fullCssVars', (t) => {
  const partOfJsVarName = 'mainStyle.day'
  const documentStyle = {
    cssText: `
      --main-style__day__bg-color: pink;
      --main-style__day__ft-color: black;
      --main-style__night__bg-color: black;
      --main-style__night__ft-color: white;
  `,
  }
  const structuredVar = new StructuredVar(partOfJsVarName, documentStyle)

  const expected = { 'main-style__day__bg-color': 'pink', 'main-style__day__ft-color': 'black' }

  t.deepEqual(structuredVar.fullCssVars, expected)
})
