// cell-value.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellValue              } from '../src/js/model/CellValue'


describe('model/cell-value', () => {

  test('HIDDEN',  () => expect(CellValue.HIDDEN.value).toBe('?'))
  test('ONE',     () => expect(CellValue.ONE.value).toBe('1'))
  test('TWO',     () => expect(CellValue.TWO.value).toBe('2'))
  test('THREE',   () => expect(CellValue.THREE.value).toBe('3'))
  test('FOUR',    () => expect(CellValue.FOUR.value).toBe('4'))
  test('FIVE',    () => expect(CellValue.FIVE.value).toBe('5'))
  test('SIX',     () => expect(CellValue.SIX.value).toBe('6'))
  test('SEVEN',   () => expect(CellValue.SEVEN.value).toBe('7'))
  test('EIGHT',   () => expect(CellValue.EIGHT.value).toBe('8'))
  test('NINE',    () => expect(CellValue.NINE.value).toBe('9'))
})

// vim: expandtab tabstop=2 number
// END
