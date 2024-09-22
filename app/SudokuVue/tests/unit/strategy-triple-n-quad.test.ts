// strategy-triple-n-quad.test.ts

import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { CellModel              } from '@/js/model/CellModel'
import { UnitModel              } from '@/js/model/UnitModel'
import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyHiddenTriple   } from '@/js/strategy/StrategyHiddenTriple'
import { StrategyNakedTriple    } from '@/js/strategy/StrategyNakedTriple'
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


describe('strategy/triple', () => {

    let unit : UnitModel

    beforeEach(() => { unit = mk_unit() })

    test('naked-triple', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyNakedTriple(new StrategyLogger())

        // Naked pair (FIRST)
//      expect(unit.is(CellIndex.NINE, CellValue.NINE)).toBe(true)
//      expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? 9')
//      expect(unit.as_cell_array[CellIndex.NINE.index].isKnown).toBe(true)

//      CellValue.arrayFactory.forEach( cv => {
//          if ( cv === CellValue.SEVEN ) return // Naked pair value
//          if ( cv === CellValue.EIGHT ) return // Naked pair value
//          if ( cv === CellValue.NINE  ) return // USED!!!
//          expect(unit.exclude(CellIndex.FOUR, cv)).toBe(true)
//          expect(unit.exclude(CellIndex.FIVE, cv)).toBe(true)
//      })

//      expect(unit.as_cell_array[CellIndex.FOUR.index].toString2()).toBe('# A4: ? [ 7,8 ]')
//      expect(unit.as_cell_array[CellIndex.FIVE.index].toString2()).toBe('# A5: ? [ 7,8 ]')

//		expect(strategy.apply( unit )).toBe(true)
//      expect(unit.as_cell_array[CellIndex.ONE.index].toString2()).toBe('# A1: ? [ 1,2,3,4,5,6 ]')
//      expect(unit.as_cell_array[CellIndex.TWO.index].toString2()).toBe('# A2: ? [ 1,2,3,4,5,6 ]')
//      expect(unit.as_cell_array[CellIndex.SIX.index].toString2()).toBe('# A6: ? [ 1,2,3,4,5,6 ]')

        // Naked pair (SECOND)
//      CellValue.arrayFactory.forEach( cv => {
//          if ( cv === CellValue.SEVEN ) return // Naked pair value (A)
//          if ( cv === CellValue.EIGHT ) return // Naked pair value (A)
//          if ( cv === CellValue.NINE  ) return // USED!!!
//          if ( cv === CellValue.THREE ) return // Naked pair value (B)
//          if ( cv === CellValue.SIX   ) return // Naked pair value (B)
//          expect(unit.exclude(CellIndex.SEVEN, cv)).toBe(true)
//          expect(unit.exclude(CellIndex.EIGHT, cv)).toBe(true)
//      })

//      expect(unit.as_cell_array[CellIndex.SEVEN.index].toString2()).toBe('# A7: ? [ 3,6 ]')
//      expect(unit.as_cell_array[CellIndex.EIGHT.index].toString2()).toBe('# A8: ? [ 3,6 ]')

//		expect(strategy.apply( unit )).toBe(true)
//      expect(unit.as_cell_array[CellIndex.TWO.index].toString2()).toBe('# A2: ? [ 1,2,4,5 ]')
//      expect(unit.as_cell_array[CellIndex.SIX.index].toString2()).toBe('# A6: ? [ 1,2,4,5 ]')

        // console.log(unit.toString())

        unit.reset();
        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')
    })

    test('hidden-triple', () => {

        expect(unit.isSolved()).toBe(false)
        expect(unit.toStringII()).toBe('? ? ? ? ? ? ? ? ?')

        const strategy = new StrategyHiddenTriple(new StrategyLogger())

        // console.log(unit.toString())
    })
})

// VICB HERE
// Make this test about triple and quad in ONE
//		for ( int x = 1 ; x < 10 ; x+=2 )
//		{
//			int cnt = 4;
//			for ( Cell cell : unit.as_cell_array)
//			{
//				cell.exclude(x);
//				cnt--;
//				if ( cnt < 1 ) { break; }
//			}
//		}
//		unit.strategy_set_naked_quad();
//	//	System.out.print(unit.toString());

//		int cnt = 7;
//		for ( Cell cell : unit.as_cell_array)
//		{
//			cnt--;
//			if ( cnt > 0 ){ continue; }
//			cell.exclude(1);
//			cell.exclude(6);
//			cell.exclude(9);
//		}
//	//	System.out.print(unit.toString());
//		unit.strategy_set_naked_triple();
//	//	System.out.print(unit.toString());

//		// Hidden Triple
//		unit.reset();
//		for ( int i=1 ; i < 7 ; i++ )
//		{
//			unit.exclude(i, 4);
//			unit.exclude(i, 5);
//			unit.exclude(i, 6);
//		}
//		unit.strategy_set_hidden_triple();

//		// Hidden Quad
//		for ( int i=1 ; i < 3 ; i++ )
//		{
//			unit.exclude(i, 2);
//			unit.exclude(i, 3);
//			unit.exclude(i, 7);
//			unit.exclude(i, 8);
//		}
//		unit.strategy_set_hidden_quad();

//		System.out.print(unit.toString());

// vim: expandtab number tabstop=4
// END
