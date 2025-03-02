// unit-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { shuffleArray           } from '@/js/util/shuffle-array'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { CellModel              } from '@/js/model/CellModel'
import { UnitModel              } from '@/js/model/UnitModel'
import { SudokuTextAdapter      } from '@/js/adapter/SudokuTextAdapter'

const TF = SudokuTextAdapter.factory

function mk_cells ( size = 0, autosolve = true ) : Array<CellModel>
{
  const cell_set : Array<CellModel> = []

  for ( let i = 1 ; i <= size ; i++ )
      cell_set.push(CellModel.factory(size<10?1:0,size<10?i:0,autosolve))

  return cell_set
}

function mk_unit ( size = 0, autosolve = true ) : UnitModel
{
  return new UnitModel(mk_cells(size, autosolve ))
}

function unit (autosolve = true) : UnitModel { return mk_unit( 9, autosolve ) }


describe('mk_cells function', () => {
  test('creates the correct number of cells', () => {
    [ 0, 1, 2, 5, 9, 10, 12 ].forEach((size) => {
      const cells = mk_cells(size)
      expect(cells.length).toBe(size)
    })
  })

  test('creates cells with correct properties', () => {
    const cells = mk_cells(5, false)
    cells.forEach((cell) => {
      expect(cell.value).toBe(0)
      expect(cell.autosolve).toBe(false)
    })
  })
})

describe('mk_unit function', () => {
  test('creates a UnitModel with the correct number of cells', () => {
    const unit = mk_unit(9)
    expect(unit.as_cell_array.length).toBe(9)
  })

  test('creates a UnitModel with cells having correct properties', () => {
    const unit = mk_unit(9, false)
    unit.as_cell_array.forEach((cell) => {
      expect(cell.value).toBe(0)
      expect(cell.length).toBe(9)
      // console.log(cell.as_label_array)
      expect(cell.as_label_array.length).toBe(9)
      expect(cell.autosolve).toBe(false)
    })
  })
})

describe('model/unit-model-basic', () => {

  test('empty membership', () => expect(() => mk_unit()).toThrow('Content size incorrect'))
  test('small membership', () => expect(() => mk_unit(8)).toThrow('Content size incorrect'))
  test('large membership', () => expect(() => mk_unit(10)).toThrow('Content size incorrect'))
  test('NINE  membership', () => expect(() => mk_unit(9)).not.toThrow())

  test('unit-solved',   () => expect(unit().isSolved).toBe(false))
  test('unit-unsolved', () => expect(unit().isBroken).toBe(false))

  test('unit-reset+tostring', () => {
    const u : UnitModel = unit()

    // 9 cells in a unit, each cell has 8 observers (no observing self HA-HA)
    u.as_cell_array.forEach( c => { expect(c.observers_as_array().length).toBe(8) })

    expect(u.is(CellIndex.ONE, CellValue.ONE)).toBe(true)
    expect(u.isSolved).toBe(false)
    expect(u.isBroken).toBe(false)
    expect(TF(u).toStringValues()).toBe('1 ? ? ? ? ? ? ? ?')

    u.reset()
    expect(TF(u).toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

    expect("\n" + TF(u).toString()).toStrictEqual(`
# A1: ? [ 1,2,3,4,5,6,7,8,9 ]
# A2: ? [ 1,2,3,4,5,6,7,8,9 ]
# A3: ? [ 1,2,3,4,5,6,7,8,9 ]
# A4: ? [ 1,2,3,4,5,6,7,8,9 ]
# A5: ? [ 1,2,3,4,5,6,7,8,9 ]
# A6: ? [ 1,2,3,4,5,6,7,8,9 ]
# A7: ? [ 1,2,3,4,5,6,7,8,9 ]
# A8: ? [ 1,2,3,4,5,6,7,8,9 ]
# A9: ? [ 1,2,3,4,5,6,7,8,9 ]
`)})
})

describe('model/unit-model-exceptions', () => {
  test('unit-empty', () => expect(() => new UnitModel(mk_cells(  ))).toThrow('Content size incorrect'))
  test('unit-small', () => expect(() => new UnitModel(mk_cells( 8))).toThrow('Content size incorrect'))
  test('unit-large', () => expect(() => new UnitModel(mk_cells(10))).toThrow('Content size incorrect'))
  test('unit-large', () => expect(() => new UnitModel(mk_cells(12))).toThrow('Content size incorrect'))
  test('unit-NINE',  () => expect(() => new UnitModel(mk_cells( 9))).not.toThrow())
})

describe('model/unit-model-forEachCell', () => {
    // In the future I expect to use retire unit's.as_cell_array
    //  and use the unit's forEachCell() method; I smell a refactor comming!
    test('unit-forEachCell', () => {
        const cells : Array<CellModel> = []
        const u : UnitModel = unit()
        u.forEachCell( (cell) => { cells.push(cell) })
        expect(cells.length).toBe(9)
        expect(cells.map((c) => c.name).join(',')).toBe('A1,A2,A3,A4,A5,A6,A7,A8,A9')
    })
})

describe('model/unit-model-broken', () => {
  
    test('unit-broken', () => {
      let u : UnitModel = unit()

      expect(u.isBroken).toBe(false)

      // Exclude same cell value from more than one cell
      //   an invalid Sudoku state
      CellIndex.arrayFactory.forEach( ci => {
        expect(u.isBroken).toBe(false)
        u.exclude(ci, CellValue.ONE)
      })

      expect(u.isBroken).toBe(true)

      // Set more than one unit cell member to the same value
      //  an invalid Sudoku state
      u = unit(false) // No autosolve, allow cells to have same value (an invalid Sudoku)
      expect(u.isBroken).toBe(false)
      CellIndex.arrayFactory.forEach( ci => {
        expect(u.is(ci, CellValue.ONE)).toBe(true)
        expect(u.isBroken).toBe(ci.index>0)
      })

      // console.log(u.toStringValues())
    })
})

describe('model/unit-model-solved', () => {

  // IS
  test('solved-IS', () => {
    let u : UnitModel = unit()
    const v : Array<CellValue> = CellValue.arrayFactory
    const P : string[] = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    // console.log(u.toStringNames())
    expect(TF(u).toStringNames()).toBe('A1,A2,A3,A4,A5,A6,A7,A8,A9')

    // Foreward
    CellIndex.arrayFactory.forEach( c => {
      expect(c.name).toBe(P[c.index])
  //  console.log(c,u.is(c, v[c.index]))
      expect(u.is(c, v[c.index])).toBe(c.index<8)
      expect(u.isSolved).toBe(v[c.index]===CellValue.NINE || v[c.index]===CellValue.EIGHT)
    })

    // Backward
    u = unit()
//  console.log(u)
//  console.log(v)

    CellIndex.arrayFactory.reverse().forEach( c => {
      expect(c.name).toBe(P[c.index])
      expect(u.is(c, v[8-c.index])).toBe(c.index>0)
      expect(u.isSolved).toBe(v[c.index]===CellValue.ONE || v[c.index]===CellValue.TWO)
    })
  })

  // Exclude
  test('solved-EXCLUDE', () => {
    let u : UnitModel = unit()
    const v : Array<CellValue> = CellValue.arrayFactory
    const P : string[] = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    // Foreward
    CellIndex.arrayFactory.forEach( c => {
      let t = false
      expect(c.name).toBe(P[c.index])
      v.forEach( x => { expect(t=u.exclude(c, x)).toBe(t) })
      expect(u.isSolved).toBe(c===CellIndex.NINE || c===CellIndex.EIGHT)
    })

    // Backward
    u = unit()

    CellIndex.arrayFactory.reverse().forEach( c => {
      let t = false
      expect(c.name).toBe(P[c.index])
      shuffleArray(v).forEach( x => { expect(t=u.exclude(c, x)).toBe(t) })
      expect(u.isSolved).toBe(c===CellIndex.ONE || c===CellIndex.TWO)
    })
  })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
