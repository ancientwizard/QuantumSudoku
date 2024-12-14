// unit-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { shuffleArray           } from '@/js/util/shuffle-array'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { CellModel              } from '@/js/model/CellModel'
import { UnitModel              } from '@/js/model/UnitModel'

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

describe('model/cell-index-basic', () => {
  class MyBadIndex extends CellIndex
  {
    static less_than_0     () { return new MyBadIndex(-1) }
    static greater_than_8  () { return new MyBadIndex(9) }
  }

  test('invalid-index-low', () => expect(()=>{MyBadIndex.less_than_0()}).toThrow('Invalid Sudoku INDEX [ -1 ]'))
  test('invalid-index-hi',  () => expect(()=>{MyBadIndex.greater_than_8()}).toThrow('Invalid Sudoku INDEX [ 9 ]'))
})

describe('mk_cells function', () => {
  test('creates the correct number of cells', () => {
    const cells = mk_cells(5);
    expect(cells.length).toBe(5);
  });

  test('creates cells with correct properties', () => {
    const cells = mk_cells(5, false);
    cells.forEach((cell, index) => {
      expect(cell.value).toBe(0);
      expect(cell.autosolve).toBe(false);
    });
  });
});

describe('mk_unit function', () => {
  test('creates a UnitModel with the correct number of cells', () => {
    const unit = mk_unit(9);
    expect(unit.as_cell_array.length).toBe(9);
  });

  test('creates a UnitModel with cells having correct properties', () => {
    const unit = mk_unit(9, false);
    unit.as_cell_array.forEach((cell, index) => {
      expect(cell.value).toBe(0);
      expect(cell.length).toBe(9);
      // console.log(cell.as_label_array)
      expect(cell.as_label_array.length).toBe(9);
      expect(cell.autosolve).toBe(false);
    });
  });
});

describe('model/unit-model-basic', () => {

  test('empty membership', () => expect(() => mk_unit()).toThrow('Content size incorrect'))
  test('small membership', () => expect(() => mk_unit(8)).toThrow('Content size incorrect'))
  test('large membership', () => expect(() => mk_unit(10)).toThrow('Content size incorrect'))
  test('NINE  membership', () => expect(() => mk_unit(9)).not.toThrow())

  test('unit-solved',   () => expect(unit().isSolved()).toBe(false))
  test('unit-unsolved', () => expect(unit().isBroken()).toBe(false))

  test('unit-reset+tostring', () => {
    const u : UnitModel = unit()

    // 9 cells in a unit, each cell has 8 observers (no observing self HA-HA)
    u.as_cell_array.forEach( c => { expect(c.observers_as_array().length).toBe(8) })

    expect(u.is(CellIndex.ONE, CellValue.ONE)).toBe(true)
    expect(u.isSolved()).toBe(false)
    expect(u.isBroken()).toBe(false)
    expect(u.toStringValue()).toBe('1 ? ? ? ? ? ? ? ?')

    u.reset()
    expect(u.toStringValue()).toBe('? ? ? ? ? ? ? ? ?')

    expect("\n" + u.toString()).toStrictEqual(`
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

describe('model/unit-model-broken', () => {
  
    test('unit-broken', () => {
      let u : UnitModel = unit()

      expect(u.isBroken()).toBe(false)

      // Exclude same cell value from more than one cell
      //   an invalid Sudoku state
      CellIndex.arrayFactory.forEach( ci => {
        expect(u.isBroken()).toBe(false)
        u.exclude(ci, CellValue.ONE)
      })

      expect(u.isBroken()).toBe(true)

      // Set more than one unit cell member to the same value
      //  an invalid Sudoku state
      u = unit(false) // No autosolve, allow cells to have same value (an invalid Sudoku)
      expect(u.isBroken()).toBe(false)
      CellIndex.arrayFactory.forEach( ci => {
        expect(u.is(ci, CellValue.ONE)).toBe(true)
        expect(u.isBroken()).toBe(ci.index>0)
      })

      // console.log(u.toStringValue())
    })
})

describe('model/unit-model-solved', () => {

  // IS
  test('solved-IS', () => {
    let u : UnitModel = unit()
    const v : Array<CellValue> = CellValue.arrayFactory
    const P : string[] = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    // console.log(u.toStringNames())
    expect(u.toStringNames()).toBe('A1,A2,A3,A4,A5,A6,A7,A8,A9')

    // Foreward
    CellIndex.arrayFactory.forEach( c => {
      expect(c.name).toBe(P[c.index])
  //  console.log(c,u.is(c, v[c.index]))
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
    const v : Array<CellValue> = CellValue.arrayFactory
    const P : string[] = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    // Foreward
    CellIndex.arrayFactory.forEach( c => {
      let t = false
      expect(c.name).toBe(P[c.index])
      v.forEach( x => { expect(t=u.exclude(c, x)).toBe(t) })
      expect(u.isSolved()).toBe(c===CellIndex.NINE || c===CellIndex.EIGHT)
    })

    // Backward
    u = unit()

    CellIndex.arrayFactory.reverse().forEach( c => {
      let t = false
      expect(c.name).toBe(P[c.index])
      shuffleArray(v).forEach( x => { expect(t=u.exclude(c, x)).toBe(t) })
      expect(u.isSolved()).toBe(c===CellIndex.ONE || c===CellIndex.TWO)
    })
  })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
