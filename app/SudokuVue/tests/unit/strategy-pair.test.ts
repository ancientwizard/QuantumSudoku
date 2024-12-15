// strategy-pair.test.ts

import { describe, expect, test, beforeEach } from '@jest/globals'
import { CellIndex          } from '@/js/model/CellIndex'
import { CellValue          } from '@/js/model/CellValue'
import { CellModel          } from '@/js/model/CellModel'
import { UnitModel          } from '@/js/model/UnitModel'
import { StrategyLogger     } from '@/js/strategy/StrategyLogger'
import { StrategyHiddenPair } from '@/js/strategy/StrategyHiddenPair'
import { StrategyNakedPair  } from '@/js/strategy/StrategyNakedPair'

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


describe('strategy/pair', () => {

    let unit : UnitModel

    beforeEach(() => { unit = mk_unit() })

    test('naked-pair', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyNakedPair(new StrategyLogger())

        // Naked pair (FIRST)
        expect(unit.is(CellIndex.NINE, CellValue.NINE)).toBe(true)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? 9')
        expect(unit.as_cell_array[CellIndex.NINE.index].isKnown).toBe(true)

        CellValue.arrayFactory.forEach( cv => {
            if ( cv === CellValue.SEVEN ) return // Naked pair value
            if ( cv === CellValue.EIGHT ) return // Naked pair value
            if ( cv === CellValue.NINE  ) return // USED!!!
            expect(unit.exclude(CellIndex.FOUR, cv)).toBe(true)
            expect(unit.exclude(CellIndex.FIVE, cv)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.FOUR.index].toString2()).toBe('# A4: ? [ 7,8 ]')
        expect(unit.as_cell_array[CellIndex.FIVE.index].toString2()).toBe('# A5: ? [ 7,8 ]')

        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.ONE.index].toString2()).toBe('# A1: ? [ 1,2,3,4,5,6 ]')
        expect(unit.as_cell_array[CellIndex.TWO.index].toString2()).toBe('# A2: ? [ 1,2,3,4,5,6 ]')
        expect(unit.as_cell_array[CellIndex.SIX.index].toString2()).toBe('# A6: ? [ 1,2,3,4,5,6 ]')

        // Naked pair (SECOND)
        CellValue.arrayFactory.forEach( cv => {
            if ( cv === CellValue.SEVEN ) return // Naked pair value (A)
            if ( cv === CellValue.EIGHT ) return // Naked pair value (A)
            if ( cv === CellValue.NINE  ) return // USED!!!
            if ( cv === CellValue.THREE ) return // Naked pair value (B)
            if ( cv === CellValue.SIX   ) return // Naked pair value (B)
            expect(unit.exclude(CellIndex.SEVEN, cv)).toBe(true)
            expect(unit.exclude(CellIndex.EIGHT, cv)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.SEVEN.index].toString2()).toBe('# A7: ? [ 3,6 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 3,6 ]')

        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.TWO.index].toString2()).toBe('# A2: ? [ 1,2,4,5 ]')
        expect(unit.as_cell_array[CellIndex.SIX.index].toString2()).toBe('# A6: ? [ 1,2,4,5 ]')

        strategy.logger && expect(strategy.logger.as_array.length).toBe(12)

        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        strategy.logger && strategy.logger.reset()
    })


    test('hidden-pair(A)', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        expect(unit.is(CellIndex.ONE,   CellValue.SEVEN)).toBe(true)
        expect(unit.is(CellIndex.FOUR,  CellValue.EIGHT)).toBe(true)
        expect(unit.is(CellIndex.NINE,  CellValue.TWO)).toBe(true)

        const strategy = new StrategyHiddenPair(new StrategyLogger())

        // Hidden Pair in (A2,A5) as (3,4)
        expect(unit.exclude(CellIndex.THREE, CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.THREE, CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.SIX,   CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.SIX,   CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT, CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.EIGHT, CellValue.FOUR)).toBe(true)

        expect(unit.as_cell_array[CellIndex.TWO.index].toString2()).toBe('# A2: ? [ 1,3,4,5,6,9 ]')
        expect(unit.as_cell_array[CellIndex.FIVE.index].toString2()).toBe('# A5: ? [ 1,3,4,5,6,9 ]')
        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.TWO.index ].toString2()).toBe('# A2: ? [ 3,4 ]')
        expect(unit.as_cell_array[CellIndex.FIVE.index].toString2()).toBe('# A5: ? [ 3,4 ]')

        // Hidden Pair in (A3,A8) as (6,9)
        expect(unit.exclude(CellIndex.SIX,   CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.SIX,   CellValue.NINE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.SIX)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.NINE)).toBe(true)

        expect(unit.as_cell_array[CellIndex.THREE.index].toString2()).toBe('# A3: ? [ 1,5,6,9 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 1,5,6,9 ]')
        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.THREE.index].toString2()).toBe('# A3: ? [ 6,9 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 6,9 ]')

        strategy.logger && expect(strategy.logger.as_array.length).toBe(6)

        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        strategy.logger && strategy.logger.reset()
    })


    test('hidden-pair(B)', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        expect(unit.is(CellIndex.ONE,   CellValue.SEVEN)).toBe(true)
        expect(unit.is(CellIndex.FOUR,  CellValue.EIGHT)).toBe(true)

        const strategy = new StrategyHiddenPair(new StrategyLogger())

        // Hidden Pair in (A8,A9) as (3,4)
        expect(unit.exclude(CellIndex.TWO,   CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.TWO,   CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.THREE, CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.THREE, CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,  CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.FIVE,  CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.SIX,   CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.SIX,   CellValue.FOUR)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.THREE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.FOUR)).toBe(true)

        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 1,2,3,4,5,6,9 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index ].toString2()).toBe('# A9: ? [ 1,2,3,4,5,6,9 ]')
        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 3,4 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index ].toString2()).toBe('# A9: ? [ 3,4 ]')

        // Hidden Pair in (A5,A6) as (1,9)
        expect(unit.exclude(CellIndex.TWO,   CellValue.ONE)).toBe(true)
        expect(unit.exclude(CellIndex.TWO,   CellValue.NINE)).toBe(true)
        expect(unit.exclude(CellIndex.THREE, CellValue.ONE)).toBe(true)
        expect(unit.exclude(CellIndex.THREE, CellValue.NINE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.ONE)).toBe(true)
        expect(unit.exclude(CellIndex.SEVEN, CellValue.NINE)).toBe(true)

        expect(unit.as_cell_array[CellIndex.FIVE.index].toString2()).toBe('# A5: ? [ 1,2,5,6,9 ]')
        expect(unit.as_cell_array[CellIndex.SIX.index ].toString2()).toBe('# A6: ? [ 1,2,5,6,9 ]')
        expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.FIVE.index ].toString2()).toBe('# A5: ? [ 1,9 ]')
        expect(unit.as_cell_array[CellIndex.SIX.index  ].toString2()).toBe('# A6: ? [ 1,9 ]')
        expect(unit.as_cell_array[CellIndex.TWO.index  ].toString2()).toBe('# A2: ? [ 2,5,6 ]')
        expect(unit.as_cell_array[CellIndex.THREE.index].toString2()).toBe('# A3: ? [ 2,5,6 ]')
        expect(unit.as_cell_array[CellIndex.SEVEN.index].toString2()).toBe('# A7: ? [ 2,5,6 ]')

        strategy.logger && expect(strategy.logger.as_array.length).toBe(6)

        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringValues()).toBe('? ? ? ? ? ? ? ? ?')

        strategy.logger && strategy.logger.reset()
    })
})

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
