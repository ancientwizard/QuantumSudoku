// strategy-model.test.ts

import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals'
import type { iUnit             } from '@/js/interface/iUnit'
import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import      { CellIndex         } from '@/js/model/CellIndex'
import      { CellValue         } from '@/js/model/CellValue'
import      { CellModel         } from '@/js/model/CellModel'
import      { UnitModel         } from '@/js/model/UnitModel'
import      { StrategyUnique    } from '@/js/strategy/StrategyUnique'

function mk_cells () : Array<CellModel>
{
  let cell_set : Array<CellModel> = []

  for ( var i = 1 ; i <= 9 ; i++ )
      cell_set.push(CellModel.factory(1,i,true))

  return cell_set
}

function mk_unit () : UnitModel
{
  return new UnitModel(mk_cells())
}

describe('strategy/unique', () => {

    let unit : UnitModel

    beforeAll(() => { unit = mk_unit() })

    test('is',      () => expect(unit.is(CellIndex.ONE,CellValue.ONE)).toBe(true))
    test('exclude', () => expect(unit.exclude(CellIndex.ONE,CellValue.ONE)).toBe(false))

    test('exclude-unique', () => {

        let members : Array<CellModel> = mk_cells()

        // console.log(members)

        unit = new UnitModel(members)

        expect(members.length).toBe(9)
        expect(unit.getCells().length).toBe(9)
        members.forEach( m => { expect(m.autosolve).toBe(true); expect(m.observers_as_array().length).toBe(8) })

        expect(unit.is(CellIndex.ONE,CellValue.FIVE)).toBe(true)

    //  console.log(unit.toString());

        expect(unit.is(CellIndex.FOUR,  CellValue.EIGHT)).toBe(true)
        expect(unit.is(CellIndex.NINE,  CellValue.ONE)).toBe(true)
        expect(unit.is(CellIndex.EIGHT, CellValue.THREE)).toBe(true)
        expect(unit.is(CellIndex.SIX,   CellValue.NINE)).toBe(true)
        expect(unit.is(CellIndex.TWO,   CellValue.SIX)).toBe(true)
        expect(unit.is(CellIndex.SEVEN, CellValue.FOUR)).toBe(true)
        expect(unit.is(CellIndex.FIVE,  CellValue.SEVEN)).toBe(true)

   //   console.log(unit.toString());
   //   console.log(unit.toStringII());
        expect(unit.toStringII()).toBe('5 6 2 8 7 9 4 3 1')
    })

        // tell strategy(s) to output to console
        //  but its no longer in unit. we'll think about adding to strategy....
    //  unit.showUndetermined();

    //  c = members[1];
    //  console.log('# Observers : ' + c.length ); // Odd unexpected length (expected+1)
    //  console.log('# Observers : ' + c.observers_as_array().length)
    //  console.log(c.observers_as_array().filter( o => o === c ))

//		// Naked pair
//		unit.reset();
//		unit.is(9, 9);
//	//	System.out.print(unit.toString());
//	//	System.out.println(c.toString2());

//		for ( int i = 1 ; i < 7 ; i++ )
//		{
//			unit.exclude(4, i);
//			unit.exclude(5, i);
//		}

//	//	System.out.print(unit.toString());
//		unit.strategy_set_naked_pair();
//	//	System.out.print(unit.toString());

//		// Hidden Pair
//	//	System.out.println("# ---------------------");
//	//	System.out.println("# strategy_set_hidden_pair()");

//		unit.exclude(3, 3); unit.exclude(3, 4);
//		unit.exclude(6, 3); unit.exclude(6, 4);
//		unit.exclude(7, 3); unit.exclude(7, 4);
//		unit.exclude(8, 3); unit.exclude(8, 4);

//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());
//		unit.strategy_set_hidden_pair();
//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());

//		// Unique
//	//	System.out.println("# ---------------------");
//	//	System.out.println("# strategy_unique()");
//		unit.exclude(6, 1);
//		unit.exclude(7, 1);
//		unit.exclude(8, 1);
//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());
//		unit.strategy_unique();
//	//	System.out.println("# ---------------------");
//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());

//		unit.reset();
//		for ( int x = 1 ; x < 10 ; x+=2 )
//		{
//			int cnt = 4;
//			for ( Cell cell : unit.getCells())
//			{
//				cell.exclude(x);
//				cnt--;
//				if ( cnt < 1 ) { break; }
//			}
//		}
//		unit.strategy_set_naked_quad();
//	//	System.out.print(unit.toString());

//		int cnt = 7;
//		for ( Cell cell : unit.getCells())
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

//		// Hidden Tripple
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
})

// vim: expandtab number tabstop=4
// END
