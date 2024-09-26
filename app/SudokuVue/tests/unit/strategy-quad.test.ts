// strategy-quad.test.ts

import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { CellModel              } from '@/js/model/CellModel'
import { UnitModel              } from '@/js/model/UnitModel'
import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyHiddenQuad     } from '@/js/strategy/StrategyHiddenQuad'
import { StrategyNakedQuad      } from '@/js/strategy/StrategyNakedQuad'

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


describe('strategy/quad', () => {

    let unit : UnitModel

    beforeEach(() => { unit = mk_unit() })

    test('naked-quad', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyNakedQuad(new StrategyLogger())

//      expect(unit.is(CellIndex.ONE, CellValue.ONE)).toBe(true)
//      expect(unit.toStringII()).toBe('1 ? ? ? ? ? ? ? ?')
//      expect(unit.as_cell_array[CellIndex.ONE.index].isKnown).toBe(true)

        // Naked Quad (FIRST) (A2,A3,A8,A9) as (4,5,7,9)
        CellValue.arrayFactory.forEach( cv => {
            if ( cv === CellValue.FOUR  ) return // Naked Quad value
            if ( cv === CellValue.FIVE  ) return // Naked Quad value
            if ( cv === CellValue.SEVEN ) return // Naked Quad value
            if ( cv === CellValue.NINE  ) return // Naked Quad value
            expect(unit.exclude(CellIndex.TWO,  cv)).toBe(true)
            expect(unit.exclude(CellIndex.THREE,cv)).toBe(true)
            expect(unit.exclude(CellIndex.EIGHT,cv)).toBe(true)
            expect(unit.exclude(CellIndex.NINE, cv)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.  ONE.index].toString2()).toBe('# A1: ? [ 1,2,3,4,5,6,7,8,9 ]')
        expect(unit.as_cell_array[CellIndex.  TWO.index].toString2()).toBe('# A2: ? [ 4,5,7,9 ]')
        expect(unit.as_cell_array[CellIndex.THREE.index].toString2()).toBe('# A3: ? [ 4,5,7,9 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 4,5,7,9 ]')
        expect(unit.as_cell_array[CellIndex. NINE.index].toString2()).toBe('# A9: ? [ 4,5,7,9 ]')

  		expect(strategy.apply( unit )).toBe(true)
        strategy.logger && expect(strategy.logger.as_array.length).toBe(3)
        expect(unit.as_cell_array[CellIndex.  ONE.index].toString2()).toBe('# A1: ? [ 1,2,3,6,8 ]')
        expect(unit.as_cell_array[CellIndex. FOUR.index].toString2()).toBe('# A4: ? [ 1,2,3,6,8 ]')
        expect(unit.as_cell_array[CellIndex. FIVE.index].toString2()).toBe('# A5: ? [ 1,2,3,6,8 ]')
        expect(unit.as_cell_array[CellIndex.  SIX.index].toString2()).toBe('# A6: ? [ 1,2,3,6,8 ]')
        expect(unit.as_cell_array[CellIndex.SEVEN.index].toString2()).toBe('# A7: ? [ 1,2,3,6,8 ]')
        expect(unit.as_cell_array[CellIndex.  TWO.index].toString2()).toBe('# A2: ? [ 4,5,7,9 ]')

        // Naked Quad (SECOND) (A4,A5,A6,A7) as (1,2,3,6)
        CellValue.arrayFactory.forEach( cv => {
            // yes could be written as [ LIST ].includes(cv) && return
            if ( cv === CellValue.FOUR  ) return // Naked Quad value (#1)
            if ( cv === CellValue.FIVE  ) return // Naked Quad value (#1)
            if ( cv === CellValue.SEVEN ) return // Naked Quad value (#1)
            if ( cv === CellValue.NINE  ) return // Naked Quad value (#1)
            if ( cv === CellValue.ONE   ) return // Naked Quad value (#2)
            if ( cv === CellValue.TWO   ) return // Naked Quad value (#2)
            if ( cv === CellValue.THREE ) return // Naked Quad value (#2)
            if ( cv === CellValue.SIX   ) return // Naked Quad value (#2)
            expect(unit.exclude(CellIndex.FOUR,  cv)).toBe(true)
            expect(unit.exclude(CellIndex.FIVE,  cv)).toBe(true)
            expect(unit.exclude(CellIndex.SIX,   cv)).toBe(true)
            expect(unit.exclude(CellIndex.SEVEN, cv)).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.  ONE.index].toString2()).toBe('# A1: ? [ 1,2,3,6,8 ]')
        expect(unit.as_cell_array[CellIndex. FOUR.index].toString2()).toBe('# A4: ? [ 1,2,3,6 ]')

  		expect(strategy.apply( unit )).toBe(true)

        expect(unit.as_cell_array[CellIndex.  ONE.index].toString2()).toBe('# A1: 8 [ ]')
        expect(unit.as_cell_array[CellIndex.  ONE.index].isKnown).toBe(true)

        strategy.logger && expect( strategy.logger.as_array.length ).toBe(6)

        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')
    })

    test('hidden-quad', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyHiddenQuad(new StrategyLogger())

        expect(unit.is(CellIndex.TWO, CellValue.TWO)).toBe(true)
        expect(unit.as_cell_array[CellIndex.TWO.index].toString2()).toBe('# A2: 2 [ ]')

        // Hidden QUAD in (A4,A5,A8,A9) as (1,3,4,5)
        let others = [ CellIndex.ONE, CellIndex.THREE, CellIndex.SIX, CellIndex.SEVEN ]
        others.forEach( ci => {
            expect(unit.exclude(ci, CellValue.ONE   )).toBe(true)
            expect(unit.exclude(ci, CellValue.THREE )).toBe(true)
            expect(unit.exclude(ci, CellValue.FOUR  )).toBe(true)
            expect(unit.exclude(ci, CellValue.FIVE  )).toBe(true)
        })

        expect(unit.as_cell_array[CellIndex.ONE.index ].toString2()).toBe('# A1: ? [ 6,7,8,9 ]')
        expect(unit.as_cell_array[CellIndex.NINE.index].toString2()).toBe('# A9: ? [ 1,3,4,5,6,7,8,9 ]')

        expect(strategy.apply( unit )).toBe(true)

        expect(unit.as_cell_array[CellIndex. FOUR.index].toString2()).toBe('# A4: ? [ 1,3,4,5 ]')
        expect(unit.as_cell_array[CellIndex. FIVE.index].toString2()).toBe('# A5: ? [ 1,3,4,5 ]')
        expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 1,3,4,5 ]')
        expect(unit.as_cell_array[CellIndex. NINE.index].toString2()).toBe('# A9: ? [ 1,3,4,5 ]')

        strategy.logger && expect( strategy.logger.as_array.length ).toBe(7)

        // console.log( strategy.logger )
        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')
    })
})

// vim: expandtab number tabstop=4
// END
