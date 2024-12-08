// cell-value.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellValue              } from '@/js/model/CellValue'

describe('model/cell-label', () => {
  test('HIDDEN.label',  () => expect(CellValue.HIDDEN.label).toBe('?'))
  test('ONE.label',     () => expect(CellValue.ONE.label).toBe('1'))
  test('TWO.label',     () => expect(CellValue.TWO.label).toBe('2'))
  test('THREE.label',   () => expect(CellValue.THREE.label).toBe('3'))
  test('FOUR.label',    () => expect(CellValue.FOUR.label).toBe('4'))
  test('FIVE.label',    () => expect(CellValue.FIVE.label).toBe('5'))
  test('SIX.label',     () => expect(CellValue.SIX.label).toBe('6'))
  test('SEVEN.label',   () => expect(CellValue.SEVEN.label).toBe('7'))
  test('EIGHT.label',   () => expect(CellValue.EIGHT.label).toBe('8'))
  test('NINE.label',    () => expect(CellValue.NINE.label).toBe('9'))
})

describe('model/cell-value', () => {
  test('HIDDEN.value',  () => expect(CellValue.HIDDEN.value).toBe(0))
  test('ONE.value',     () => expect(CellValue.ONE.value).toBe(1))
  test('TWO.value',     () => expect(CellValue.TWO.value).toBe(2))
  test('THREE.value',   () => expect(CellValue.THREE.value).toBe(3))
  test('FOUR.value',    () => expect(CellValue.FOUR.value).toBe(4))
  test('FIVE.value',    () => expect(CellValue.FIVE.value).toBe(5))
  test('SIX.value',     () => expect(CellValue.SIX.value).toBe(6))
  test('SEVEN.value',   () => expect(CellValue.SEVEN.value).toBe(7))
  test('EIGHT.value',   () => expect(CellValue.EIGHT.value).toBe(8))
  test('NINE.value',    () => expect(CellValue.NINE.value).toBe(9))
})

describe('model/cell-index', () => {
  test('HIDDEN.index',  () => expect(CellValue.HIDDEN.index).toBe(-1))
  test('ONE.index',     () => expect(CellValue.ONE.index).toBe(0))
  test('TWO.index',     () => expect(CellValue.TWO.index).toBe(1))
  test('THREE.index',   () => expect(CellValue.THREE.index).toBe(2))
  test('FOUR.index',    () => expect(CellValue.FOUR.index).toBe(3))
  test('FIVE.index',    () => expect(CellValue.FIVE.index).toBe(4))
  test('SIX.index',     () => expect(CellValue.SIX.index).toBe(5))
  test('SEVEN.index',   () => expect(CellValue.SEVEN.index).toBe(6))
  test('EIGHT.index',   () => expect(CellValue.EIGHT.index).toBe(7))
  test('NINE.index',    () => expect(CellValue.NINE.index).toBe(8))
})

describe('model/cell-array', () => {
  test('arrayFactory', () => {
    const v = CellValue.arrayFactory
    expect(v[0]).toBe(CellValue.ONE)
    expect(v[1]).toBe(CellValue.TWO)
    expect(v[2]).toBe(CellValue.THREE)
    expect(v[3]).toBe(CellValue.FOUR)
    expect(v[4]).toBe(CellValue.FIVE)
    expect(v[5]).toBe(CellValue.SIX)
    expect(v[6]).toBe(CellValue.SEVEN)
    expect(v[7]).toBe(CellValue.EIGHT)
    expect(v[8]).toBe(CellValue.NINE)
  })
})

// vim: expandtab number tabstop=2
// END
