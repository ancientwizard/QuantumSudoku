// strategy-base.test.ts

import { describe, expect, test, beforeAll } from '@jest/globals'
import { CellIndex        } from '@/js/model/CellIndex'
import { CellValue        } from '@/js/model/CellValue'
import { CellModel        } from '@/js/model/CellModel'
import { UnitModel        } from '@/js/model/UnitModel'

function mk_cells () : Array<CellModel>
{
  const cell_set : Array<CellModel> = []

  for ( let i = 1 ; i <= 9 ; i++ )
      cell_set.push(CellModel.factory(1,i,true))

  return cell_set
}

function mk_unit () : UnitModel
{
  return new UnitModel(mk_cells())
}

describe('strategy/base', () => {

    let unit : UnitModel

    beforeAll(() => { unit = mk_unit() })

    test('call-is',      () => expect(unit.is(CellIndex.ONE,CellValue.ONE)).toBe(true))
    test('call-exclude', () => expect(unit.exclude(CellIndex.ONE,CellValue.ONE)).toBe(false))

    test('is-plain', () => {

        const members : Array<CellModel> = mk_cells()

        // console.log(members)

        unit = new UnitModel(members)

        expect(members.length).toBe(9)
        expect(unit.as_cell_array.length).toBe(9)
        members.forEach( m => { expect(m.autosolve).toBe(true); expect(m.observers_as_array().length).toBe(8) })
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        expect(unit.is(CellIndex.ONE,   CellValue.FIVE)).toBe(true)
        expect(unit.is(CellIndex.FIVE,  CellValue.FIVE)).toBe(false)
        expect(unit.toStringII()).toBe('5 ? ? ? ? ? ? ? ?')

     // console.log(unit.toString());

        expect(unit.is(CellIndex.FOUR,  CellValue.EIGHT)).toBe(true)
        expect(unit.is(CellIndex.FIVE,  CellValue.EIGHT)).toBe(false)
        expect(unit.toStringII()).toBe('5 ? ? 8 ? ? ? ? ?')

        expect(unit.is(CellIndex.NINE,  CellValue.ONE)).toBe(true)
        expect(unit.is(CellIndex.FIVE,  CellValue.ONE)).toBe(false)
        expect(unit.toStringII()).toBe('5 ? ? 8 ? ? ? ? 1')

        expect(unit.is(CellIndex.EIGHT, CellValue.THREE)).toBe(true)
        expect(unit.is(CellIndex.SIX,   CellValue.THREE)).toBe(false)
        expect(unit.toStringII()).toBe('5 ? ? 8 ? ? ? 3 1')

        expect(unit.is(CellIndex.SIX,   CellValue.NINE)).toBe(true)
        expect(unit.is(CellIndex.ONE,   CellValue.NINE)).toBe(false)
        expect(unit.toStringII()).toBe('5 ? ? 8 ? 9 ? 3 1')

        expect(unit.is(CellIndex.TWO,   CellValue.SIX)).toBe(true)
        expect(unit.is(CellIndex.SEVEN, CellValue.SIX)).toBe(false)
        expect(unit.toStringII()).toBe('5 6 ? 8 ? 9 ? 3 1')

        expect(unit.is(CellIndex.SEVEN, CellValue.FOUR)).toBe(true)
        expect(unit.is(CellIndex.EIGHT, CellValue.FOUR)).toBe(false)
        expect(unit.toStringII()).toBe('5 6 ? 8 ? 9 4 3 1')

        // Cell 5 == Value 7 triggers Cell 3 == Value 2
        expect(unit.is(CellIndex.FIVE,  CellValue.SEVEN)).toBe(true)
        expect(unit.as_cell_array[2].value).toBe(CellValue.TWO.value)
        expect(unit.isSolved()).toBe(true)
        expect(unit.toStringII()).toBe('5 6 2 8 7 9 4 3 1')

    //  console.log(unit.toString());
    //  console.log(unit.toStringII());
    })
})


// vim: expandtab number tabstop=4
// END
