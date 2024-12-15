// strategy-unique.test.ts

import { describe, expect, test, beforeEach } from '@jest/globals'
import { CellIndex          } from '@/js/model/CellIndex'
import { CellValue          } from '@/js/model/CellValue'
import { CellModel          } from '@/js/model/CellModel'
import { UnitModel          } from '@/js/model/UnitModel'
import { StrategyLogger     } from '@/js/strategy/StrategyLogger'
import { StrategyUnique     } from '@/js/strategy/StrategyUnique'

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


describe('strategy/unique', () => {

    let unit : UnitModel

    beforeEach(() => { unit = mk_unit() })

    test('unique-cell', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyUnique(new StrategyLogger())

        // LEAVE Cell.SIX as the only cell having FIVE as a possible/candidate value
        //  and solve for it
        expect(unit.exclude(CellIndex.ONE,      CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.TWO,      CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.THREE,    CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.FOUR,     CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,     CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN,    CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT,    CellValue.FIVE)).toBe(true)
        expect(unit.exclude(CellIndex.NINE,     CellValue.FIVE)).toBe(true)

        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.SIX.index].isKnown).toBe(true)
        expect(unit.toStringValues()).toBe('? ? ? ? ? 5 ? ? ?')

        // LEAVE Cell's TWO & SEVEN with a unique value (EIGHT,THREE) respectively
        //  and solve for it
        expect(unit.exclude(CellIndex.ONE,      CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.ONE,      CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.TWO,      CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.THREE,    CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.THREE,    CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.FOUR,     CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.FOUR,     CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,     CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,     CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN,    CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT,    CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT,    CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.NINE,     CellValue.EIGHT)).toBe(true)
        expect(unit.exclude(CellIndex.NINE,     CellValue.THREE)).toBe(true)

        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.TWO.index].isKnown).toBe(true)
        expect(unit.as_cell_array[CellIndex.SIX.index].isKnown).toBe(true)
        expect(unit.toStringValues()).toBe('? 8 ? ? ? 5 3 ? ?')

        // LEAVE Cell's THREE, FIVE, NINE as unique of (SEVEN,SIX,FOUR) respectively
        //  and solve for it
        expect(unit.exclude(CellIndex.ONE,      CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.ONE,      CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.ONE,      CellValue.SEVEN)).toBe(true)
        expect(unit.exclude(CellIndex.FOUR,     CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.FOUR,     CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.FOUR,     CellValue.SEVEN)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT,    CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT,    CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT,    CellValue.SEVEN)).toBe(true)
        expect(unit.exclude(CellIndex.THREE,    CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.THREE,    CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,     CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,     CellValue.SEVEN)).toBe(true)
        expect(unit.exclude(CellIndex.NINE,     CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.NINE,     CellValue.SEVEN)).toBe(true)

        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.THREE.index].isKnown).toBe(true)
        expect(unit.as_cell_array[CellIndex.FIVE.index].isKnown).toBe(true)
        expect(unit.as_cell_array[CellIndex.NINE.index].isKnown).toBe(true)
        expect(unit.toStringValues()).toBe('? 8 7 ? 6 5 3 ? 4')

        // console.log(unit.toString())

        unit.reset()
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')
    })

    test('unique-cell[edges]', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyUnique(new StrategyLogger())

        unit.as_cell_array.forEach( cell => {
            cell.name != 'A1' && expect(cell.exclude(CellValue.ONE )).toBe(true)
            cell.name != 'A5' && expect(cell.exclude(CellValue.FIVE)).toBe(true)
            cell.name != 'A9' && expect(cell.exclude(CellValue.NINE)).toBe(true)
        })

        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.ONE.index ].isKnown).toBe(true)
        expect(unit.as_cell_array[CellIndex.FIVE.index].isKnown).toBe(true)
        expect(unit.as_cell_array[CellIndex.NINE.index].isKnown).toBe(true)

        unit.reset()
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')
    })
})

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
