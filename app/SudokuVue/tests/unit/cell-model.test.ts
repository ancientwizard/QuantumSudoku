// cell-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellModel              } from '@/js/model/CellModel'
import { CellValue              } from '@/js/model/CellValue'

describe('model/cell-model', () => {

  function _c_fac( x: number, y: number ) { return CellModel.factory(x,y); }

  test('(0,0).value', () => expect(_c_fac(0,0).value).toBe('?'))

  // IS
  CellValue.arrayFactory.forEach(
    (v) => test('(0,0).is(' + v.value + ').<props>',
      () => {
        const _c = _c_fac(0,0)
        expect(_c.is(v)).toStrictEqual(true)
        expect(_c.isKnown).toStrictEqual(true)
        expect(_c.isUnknown).toStrictEqual(false)
        expect(_c.value).toStrictEqual(v.value)
        expect(_c.name).toBe('X0')
        expect(_c.coord).toBe('r0c0')
        expect(_c.toArray()).toStrictEqual([])
      })
    )

  // EXCLUDE
  CellValue.arrayFactory.forEach(
    (v) => test('(0,0).exclude(' + v.value + ').<props>',
      () => {
        const _c = _c_fac(0,0)
        expect(_c.toArray().length).toBe(9)
        expect(_c.length).toBe(9)
        expect(_c.exclude(v)).toStrictEqual(true)
        expect(_c.toArray().length).toBe(8)
        expect(_c.length).toBe(8)
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
        expect(_c.name).toBe('X0')
        expect(_c.coord).toBe('r0c0')
      })
    )

  test('(0,0).exclude(N).<props>',
    () => {
      const _c = _c_fac(0,0)
      const   _a = [1,2,3,4,5,6,7,8,9]
      let   _l = 9

      CellValue.arrayFactory.reverse().forEach(
        (v) => {
          expect(_c.toArray().length).toBe(_l)
          expect(_c.length).toBe(_l)
          expect(_c.exclude(v)).toStrictEqual(_l!=1)
          expect(_c.toArray().length).toBe(_l>1 ? _l-1 : _l)
          expect(_c.length).toBe(_l>1 ? _l-1 : _l)
          expect(_c.isKnown).toStrictEqual(false)
          expect(_c.isUnknown).toStrictEqual(true)
          expect(_c.name).toBe('X0')
          expect(_c.coord).toBe('r0c0')
          --_l
          if ( _c.length <= 1 ) return
          _a.pop()
          expect(_a.slice().reverse().toString()).toBe(_c.toArray().reverse().toString())
        })
    })

//  console.log(_a.toString())
})

// vim: expandtab number tabstop=2
// END
