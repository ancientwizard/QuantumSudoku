// cell-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { TextCellModel          } from '@/js/decorator/TextCellModel'
import { CellValue              } from '@/js/model/CellValue'

describe('model/cell-model', () => {

  function _c_fac( x: number, y: number ) { return TextCellModel.factory(x,y); }

  test('(0,0).label',      () => expect(_c_fac(0,0).cv.label).toBe('?'))
  test('(0,0).toString()', () => expect(_c_fac(0,0).toString()).toBe('# X0: ? [ 1,2,3,4,5,6,7,8,9 ]'))
  test('(1,1).toString()', () => expect(_c_fac(1,1).toString()).toBe('# A1: ? [ 1,2,3,4,5,6,7,8,9 ]'))
  test('(9,9).toString()', () => expect(_c_fac(9,9).toString()).toBe('# I9: ? [ 1,2,3,4,5,6,7,8,9 ]'))

  test('(0,0).as_candidate_array()', () => expect(_c_fac(0,0).as_candidate_array.length).toBe(9))

  test('(0,0).forEachValue()', () => {
        const _c = _c_fac(0,0)
        const _a = [1,2,3,4,5,6,7,8,9]
        expect(_a.length).toBe(9)
        _c.forEachValue( v => expect(v.value).toBe(_a.shift()) )
        expect(_a.length).toBe(0)
    })

  // IS .arrayFactory
  CellValue.arrayFactory.forEach(
    (v) => test('(0,0).is(' + v.label + ').<props>',
      () => {
        const _c = _c_fac(0,0)
        expect(_c.toString()).toBe('# X0: ? [ 1,2,3,4,5,6,7,8,9 ]')
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
        expect(_c.is(v)).toStrictEqual(true)
        expect(_c.toString()).toBe('# X0: '+v.label+' [ ]')
        expect(_c.isKnown).toStrictEqual(true)
        expect(_c.isUnknown).toStrictEqual(false)
        expect(_c.value).toStrictEqual(v.value)
        expect(_c.name).toBe('X0')
        expect(_c.coord).toBe('(0,0)')
        expect(_c.as_label_array).toStrictEqual([])
        expect(()=>{_c.reset()}).not.toThrow()
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
      })
    )

  // EXCLUDE
  CellValue.arrayFactory.forEach(
    (v) => test('(0,0).exclude(' + v.label + ').<props>',
      () => {
        const _c = _c_fac(0,0)
        expect(_c.as_label_array.length).toBe(9)
        expect(_c.length).toBe(9)
        expect(_c.exclude(v)).toStrictEqual(true)
        expect(_c.as_label_array.length).toBe(8)
        expect(_c.length).toBe(8)
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
        expect(_c.name).toBe('X0')
        expect(_c.coord).toBe('(0,0)')
      })
    )

  test('(0,0).exclude(N).<props>',
    () => {
      const _c = _c_fac(0,0)
      const   _a = [1,2,3,4,5,6,7,8,9]
      let   _l = 9

      CellValue.arrayFactory.reverse().forEach(
        (v) => {
          expect(_c.as_label_array.length).toBe(_l)
          expect(_c.length).toBe(_l)
          expect(_c.exclude(v)).toStrictEqual(_l!=1)
          expect(_c.as_label_array.length).toBe(_l>1 ? _l-1 : _l)
          expect(_c.length).toBe(_l>1 ? _l-1 : _l)
          expect(_c.isKnown).toStrictEqual(false)
          expect(_c.isUnknown).toStrictEqual(true)
          expect(_c.name).toBe('X0')
          expect(_c.coord).toBe('(0,0)')
          --_l
          if ( _c.length <= 1 ) return
          _a.pop()
          expect(_a.slice().reverse().toString()).toBe(_c.as_label_array.reverse().toString())
        })
    })

  // UPDATE - Observermodel
  CellValue.arrayFactory.forEach(
    (v) => test('(0,0).exclude(' + v.label + ').<props>',
      () => {
        const _c = _c_fac(0,0)
        expect(_c.as_label_array.length).toBe(9)
        expect(_c.length).toBe(9)
        // Just another way to exclude; part of the observer model
        //    "A" neighbor became "v" and its telling me I can't be "v"
        expect(_c.update(_c,v)).toBeUndefined()
        expect(_c.as_label_array.length).toBe(8)
        expect(_c.length).toBe(8)
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
        expect(_c.name).toBe('X0')
        expect(_c.coord).toBe('(0,0)')
      })
    )

  // AUTOSOLVE - (is)
  CellValue.arrayFactory.forEach(
    (v) => test('(0,0).is(' + v.label + ').<props>',
      () => {
        const _c = _c_fac(0,0)
        expect(_c.autosolve = true).toStrictEqual(true)
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
        expect(_c.is(v)).toStrictEqual(true)
        expect(_c.isKnown).toStrictEqual(true)
        expect(_c.isUnknown).toStrictEqual(false)
        expect(_c.value).toStrictEqual(v.value)
        expect(_c.cv.label).toStrictEqual(v.label)
        expect(_c.name).toBe('X0')
        expect(_c.coord).toBe('(0,0)')
        expect(_c.as_label_array).toStrictEqual([])
        expect(()=>{_c.reset()}).not.toThrow()
        expect(_c.isKnown).toStrictEqual(false)
        expect(_c.isUnknown).toStrictEqual(true)
      })
    )

  // AUTOSOLVE - (exclude)
  test('[AUTOSOLVE] (0,0).exclude(N).<props>',
    () => {
      const _c = _c_fac(0,0)
      const _a = [1,2,3,4,5,6,7,8,9]
      let   _l = 9

      expect(_c.autosolve = true).toStrictEqual(true)

      CellValue.arrayFactory.reverse().forEach(
        (v) => {
          expect(_c.autosolve).toStrictEqual(true)
          expect(_c.name).toBe('X0')
          expect(_c.coord).toBe('(0,0)')
          expect(_c.as_label_array.reverse().toString()).toBe(_a.length>1?_a.slice().reverse().toString():'')
          expect(_c.as_label_array.length).toBe(_l>1?_l:0)
          expect(_c.length).toBe(_l>1?_l:0)
       // console.log(_c.exclude(v))
          expect(_c.exclude(v)).toStrictEqual(_l>1)
          expect(_c.as_label_array.length).toBe(_l>2?_l-1:0)
          expect(_c.length).toBe(_l>2?_l-1:0)
          expect(_c.isKnown).toStrictEqual(_l<=2)
          expect(_c.isUnknown).toStrictEqual(_l>2)
          _a.pop()
          --_l
//console.log('L=['+_l+']','S=['+_a.slice().reverse().toString()+']')
//console.log(v,'C=['+_c.as_label_array.reverse().toString()+']','A=['+_a.slice().reverse().toString()+']')
          expect(_c.as_label_array.reverse().toString()).toBe(_a.length>1?_a.slice().reverse().toString():'')
        })
    })

//  console.log(_a.toString())
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
