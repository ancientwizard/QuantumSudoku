// strategy-triple.test.ts

import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { CellModel              } from '@/js/model/CellModel'
import { UnitModel              } from '@/js/model/UnitModel'
import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyHiddenTriple   } from '@/js/strategy/StrategyHiddenTriple'
import { StrategyNakedTriple    } from '@/js/strategy/StrategyNakedTriple'

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


describe('strategy/triple', () => {

    let unit : UnitModel

    beforeEach(() => { unit = mk_unit() })

    test('naked-triple', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyNakedTriple(new StrategyLogger())

        // Naked Triple (FIRST) (A4,A5,A6)
        expect(unit.is(CellIndex.ONE, CellValue.ONE)).toBe(true)
        expect(unit.toStringII()).toBe('1 ? ? ? ? ? ? ? ?')
        expect(unit.as_cell_array[CellIndex.ONE.index].isKnown).toBe(true)

        CellValue.arrayFactory.forEach( cv => {
            if ( cv === CellValue.FIVE  ) return // Naked triple value
            if ( cv === CellValue.SEVEN ) return // Naked triple value
            if ( cv === CellValue.EIGHT ) return // Naked triple value
            if ( cv === CellValue.ONE   ) return // USED!!!
            expect(unit.exclude(CellIndex.FOUR, cv)).toBe(true)
            expect(unit.exclude(CellIndex.FIVE, cv)).toBe(true)
            expect(unit.exclude(CellIndex.SIX,  cv)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.FOUR.index].toString2()).toBe('# A4: ? [ 5,7,8 ]')
        expect(unit.as_cell_array[CellIndex.FIVE.index].toString2()).toBe('# A5: ? [ 5,7,8 ]')
        expect(unit.as_cell_array[CellIndex. SIX.index].toString2()).toBe('# A6: ? [ 5,7,8 ]')

  		expect(strategy.apply( unit )).toBe(true)

        strategy.logger && expect(strategy.logger.as_array.length).toBe(3)

        expect(unit.as_cell_array[CellIndex.TWO.index  ].toString2()).toBe('# A2: ? [ 2,3,4,6,9 ]')
        expect(unit.as_cell_array[CellIndex.THREE.index].toString2()).toBe('# A3: ? [ 2,3,4,6,9 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index ].toString2()).toBe('# A9: ? [ 2,3,4,6,9 ]')

        // Naked Triple (SECOND) (A3,A8,A9)
        CellValue.arrayFactory.forEach( cv => {
            if ( cv === CellValue.FIVE  ) return // Naked triple value (#1)
            if ( cv === CellValue.SEVEN ) return // Naked triple value (#1)
            if ( cv === CellValue.EIGHT ) return // Naked triple value (#1)
            if ( cv === CellValue.ONE   ) return // USED!!!
            if ( cv === CellValue.THREE ) return // Naked triple value (#2)
            if ( cv === CellValue.FOUR  ) return // Naked triple value (#2)
            if ( cv === CellValue.SIX   ) return // Naked triple value (#3)
            expect(unit.exclude(CellIndex.THREE, cv)).toBe(true)
            expect(unit.exclude(CellIndex.EIGHT, cv)).toBe(true)
            expect(unit.exclude(CellIndex.NINE,  cv)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.THREE.index ].toString2()).toBe('# A3: ? [ 3,4,6 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index ].toString2()).toBe('# A8: ? [ 3,4,6 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index  ].toString2()).toBe('# A9: ? [ 3,4,6 ]')
        expect(unit.as_cell_array[CellIndex.TWO.index   ].toString2()).toBe('# A2: ? [ 2,3,4,6,9 ]')
        expect(unit.as_cell_array[CellIndex.SEVEN.index ].toString2()).toBe('# A7: ? [ 2,3,4,6,9 ]')

  		expect(strategy.apply( unit )).toBe(true)
        expect(unit.as_cell_array[CellIndex.TWO.index   ].toString2()).toBe('# A2: ? [ 2,9 ]')
        expect(unit.as_cell_array[CellIndex.SEVEN.index ].toString2()).toBe('# A7: ? [ 2,9 ]')

        strategy.logger && expect( strategy.logger.as_array.length ).toBe(6)
        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')
    })

    test('hidden-triple', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyHiddenTriple(new StrategyLogger())

        expect(unit.is(CellIndex.FOUR, CellValue.FOUR)).toBe(true)

        // Hidden Triple in (A7,A8,A9) as (3,2,1)
        let others = [ CellIndex.ONE, CellIndex.TWO, CellIndex.THREE, CellIndex.FIVE, CellIndex.SIX ]
        others.forEach( ci => {
            expect(unit.exclude(ci, CellValue.ONE)).toBe(true)
            expect(unit.exclude(ci, CellValue.TWO)).toBe(true)
            expect(unit.exclude(ci, CellValue.THREE)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.SIX.index ].toString2()).toBe('# A6: ? [ 5,6,7,8,9 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index].toString2()).toBe('# A9: ? [ 1,2,3,5,6,7,8,9 ]')

        expect(strategy.apply( unit )).toBe(true)

        expect(unit.as_cell_array[CellIndex.SIX.index  ].toString2()).toBe('# A6: ? [ 5,6,7,8,9 ]')
        expect(unit.as_cell_array[CellIndex.SEVEN.index].toString2()).toBe('# A7: ? [ 1,2,3 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 1,2,3 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index ].toString2()).toBe('# A9: ? [ 1,2,3 ]')

        strategy.logger && expect( strategy.logger.as_array.length ).toBe(6)
        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')
    })
})


// vim: expandtab number tabstop=4
// END
