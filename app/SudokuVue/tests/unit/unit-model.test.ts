// unit-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { shuffleArray           } from '@/js/util/shuffle-array'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { CellModel              } from '@/js/model/CellModel'
import { UnitModel              } from '@/js/model/UnitModel'

function mk_cells ( size: number = 0 ) : Array<CellModel>
{
  let cell_set : Array<CellModel> = []

  for ( var i = 1 ; i <= size ; i++ )
      cell_set.push(CellModel.factory(size<10?1:0,size<10?i:0,true))

  return cell_set
}

function mk_unit ( size: number = 0 ) : UnitModel
{
  return new UnitModel(mk_cells(size))
}

function unit () : UnitModel { return mk_unit(9) }

describe('model/cell-index-basic', () => {
  class MyBadIndex extends CellIndex
  {
    static less_than_0     () { return new MyBadIndex(-1) }
    static greater_than_8  () { return new MyBadIndex(9) }
  }

  test('invalid-index-low', () => expect(()=>{MyBadIndex.less_than_0()}).toThrow('Invalid Sudoku INDEX [ -1 ]'))
  test('invalid-index-hi',  () => expect(()=>{MyBadIndex.greater_than_8()}).toThrow('Invalid Sudoku INDEX [ 9 ]'))
})

describe('model/unit-model-basic', () => {

//console.log(mk_cells(3))
//let unit = new UnitModel([CellModel.factory()])

  test('empty membership', () => expect(() => mk_unit()).toThrow('Content size incorrect'))
  test('small membership', () => expect(() => mk_unit(8)).toThrow('Content size incorrect'))
  test('large membership', () => expect(() => mk_unit(10)).toThrow('Content size incorrect'))
  test('NINE  membership', () => expect(() => mk_unit(9)).not.toThrow())

  test('unit-solved',   () => expect(unit().isSolved()).toBe(false))
  test('unit-unsolved', () => expect(unit().isBroken()).toBe(false))

  test('unit-tostring', () =>
    expect("\n"+unit().toString()).toStrictEqual(`
# A1: ? [ 1,2,3,4,5,6,7,8,9 ]
# A2: ? [ 1,2,3,4,5,6,7,8,9 ]
# A3: ? [ 1,2,3,4,5,6,7,8,9 ]
# A4: ? [ 1,2,3,4,5,6,7,8,9 ]
# A5: ? [ 1,2,3,4,5,6,7,8,9 ]
# A6: ? [ 1,2,3,4,5,6,7,8,9 ]
# A7: ? [ 1,2,3,4,5,6,7,8,9 ]
# A8: ? [ 1,2,3,4,5,6,7,8,9 ]
# A9: ? [ 1,2,3,4,5,6,7,8,9 ]
`))
})


describe('model/unit-model-solved', () => {

  // IS
  test('solved-IS', () => {
    let u : UnitModel = unit()
    let v : Array<CellValue> = CellValue.arrayFactory
    let P : string[] = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
//  let S : CellValue = CellValue.ONE  // END of set (reverse)
//  let N : CellValue = CellValue.NINE // END of set (forward)
    let x : number

    // Foreward
    CellIndex.arrayFactory.forEach( c => {
      expect(c.name).toBe(P[c.index])
//    console.log(c,u.is(c, v[c.index]))
      expect(u.is(c, v[c.index])).toBe(c.index<8)
      expect(u.isSolved()).toBe(v[c.index]===CellValue.NINE || v[c.index]===CellValue.EIGHT)
    })

    // Backward
    u = unit()
//  console.log(u)
//  console.log(v)

    CellIndex.arrayFactory.reverse().forEach( c => {
      expect(c.name).toBe(P[c.index])
      expect(u.is(c, v[8-c.index])).toBe(c.index>0)
      expect(u.isSolved()).toBe(v[c.index]===CellValue.ONE || v[c.index]===CellValue.TWO)
    })
  })

  // Exclude
  test('solved-EXCLUDE', () => {
    let u : UnitModel = unit()
    let v : Array<CellValue> = CellValue.arrayFactory
    let P : string[] = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
    let x : number

    // Foreward
    CellIndex.arrayFactory.forEach( c => {
      let t:boolean = false
      expect(c.name).toBe(P[c.index])
      v.forEach( x => { expect(t=u.exclude(c, x)).toBe(t) })
      expect(u.isSolved()).toBe(c===CellIndex.NINE || c===CellIndex.EIGHT)
    })

    // Backward
    u = unit()

    CellIndex.arrayFactory.reverse().forEach( c => {
      let t:boolean = false
      expect(c.name).toBe(P[c.index])
      shuffleArray(v).forEach( x => { expect(t=u.exclude(c, x)).toBe(t) })
      expect(u.isSolved()).toBe(c===CellIndex.ONE || c===CellIndex.TWO)
    })
  })
})


// vim: expandtab number tabstop=2
// END
