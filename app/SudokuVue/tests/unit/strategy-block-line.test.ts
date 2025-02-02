
// strategy-block-line.test.ts
// Block & Line Strategy unit testing

import { describe, expect, test } from '@jest/globals'
import { BoardModel, BoardMode	} from '@/js/model/BoardModel'
import { IntersectMap 			} from '@/js/model/IntersectMap'
import type { BlockModel 		} from '@/js/model/BlockModel'
import type { UnitModel 		} from '@/js/model/UnitModel'


describe('strategy/block-line/setup', () => {
	const board = new BoardModel(BoardMode.SOLVE)
	const blocks: Array<BlockModel> = []
	const rows: Array<UnitModel> = []
	const cols = []

	// Messy but we'll refactor later; we need access to these items
	//  to play with strategy-block-line implementation & tests
	//  we'll make it more elegant later
	board.forEachBlock( block => blocks.push(block))
	board.forEachRow( row => rows.push(row))
	board.forEachColumn( col => cols.push(col))

	// Block & Line Strategy
	// GOAL: setup mapping for block-line strategy


	const sets: Array<[number, number, IntersectMap, IntersectMap]> = [
		//  ALL Instances of the following layouts

		// KEY:
		//  X = non-intersected-block (cells)
		//  Y = non-intersected-line  (cells)
		//  Z = intersection		  (cells)

		//  Z  Z  Z  Y  Y  Y  Y  Y  Y
		//  X  X  X
		//  X  X  X
		// BLK.iR1 <=> LINE.iR1
		[ 0, 0, IntersectMap.iR1, IntersectMap.iR1 ],
		[ 3, 3, IntersectMap.iR1, IntersectMap.iR1 ],
		[ 6, 6, IntersectMap.iR1, IntersectMap.iR1 ],

		//  X  X  X
		//  Z  Z  Z  Y  Y  Y  Y  Y  Y
		//  X  X  X
		//  BLK.iR2 <=> LINE.iR1
		[ 0, 1, IntersectMap.iR2, IntersectMap.iR1 ],
		[ 3, 4, IntersectMap.iR2, IntersectMap.iR1 ],
		[ 6, 7, IntersectMap.iR2, IntersectMap.iR1 ],

		//  X  X  X
		//  X  X  X
		//  Z  Z  Z  Y  Y  Y  Y  Y  Y
		//  BLK.iR3 <=> LINE.iR1
		[ 0, 2, IntersectMap.iR3, IntersectMap.iR1 ],
		[ 3, 5, IntersectMap.iR3, IntersectMap.iR1 ],
		[ 6, 8, IntersectMap.iR3, IntersectMap.iR1 ],

		//  Y  Y  Y  Z  Z  Z  Y  Y  Y
		//           X  X  X
		//           X  X  X
		//  BLK.iR1 <=> LINE.iR2
		[ 1, 0, IntersectMap.iR1, IntersectMap.iR2 ],
		[ 4, 3, IntersectMap.iR1, IntersectMap.iR2 ],
		[ 7, 6, IntersectMap.iR1, IntersectMap.iR2 ],

		//           X  X  X
		//  Y  Y  Y  Z  Z  Z  Y  Y  Y
		//           X  X  X
		//  BLK.iR2 <=> LINE.iR2
		[ 1, 1, IntersectMap.iR2, IntersectMap.iR2 ],
		[ 4, 4, IntersectMap.iR2, IntersectMap.iR2 ],
		[ 7, 7, IntersectMap.iR2, IntersectMap.iR2 ],

		//           X  X  X
		//           X  X  X
		//  Y  Y  Y  Z  Z  Z  Y  Y  Y
		//  BLK.iR3 <=> LINE.iR2
		[ 1, 2, IntersectMap.iR3, IntersectMap.iR2 ],
		[ 4, 5, IntersectMap.iR3, IntersectMap.iR2 ],
		[ 7, 8, IntersectMap.iR3, IntersectMap.iR2 ],

		//  Y  Y  Y  Y  Y  Y  Z  Z  Z
		//  				  X  X  X
		//  				  X  X  X
		//  BLK.iR1 <=> LINE.iR3
		[ 2, 0, IntersectMap.iR1, IntersectMap.iR3 ],
		[ 5, 3, IntersectMap.iR1, IntersectMap.iR3 ],
		[ 8, 6, IntersectMap.iR1, IntersectMap.iR3 ],

		//  				  X  X  X
		//  Y  Y  Y  Y  Y  Y  Z  Z  Z
		//  				  X  X  X
		//  BLK.iR2 <=> LINE.iR3
		[ 2, 1, IntersectMap.iR2, IntersectMap.iR3 ],
		[ 5, 4, IntersectMap.iR2, IntersectMap.iR3 ],
		[ 8, 7, IntersectMap.iR2, IntersectMap.iR3 ],

		//  				  X  X  X
		//  				  X  X  X
		//  Y  Y  Y  Y  Y  Y  Z  Z  Z
		//  BLK.iR3 <=> LINE.iR3
		[ 2, 2, IntersectMap.iR3, IntersectMap.iR3 ],
		[ 5, 5, IntersectMap.iR3, IntersectMap.iR3 ],
		[ 8, 8, IntersectMap.iR3, IntersectMap.iR3 ],

		//  ALL Instances of the following layout COLUMNS
		// 		where col-part-A intersects with block-part-A
		//  Z  X  X
		//  Z  X  X
		//  Z  X  X
		//  Y
		//  Y
		//  Y
		//  Y
		//  BLK.iC1 <=> LINE.iR1 (remember, columns index just like rows 0-8) (top to bottom)
		[ 0, 0, IntersectMap.iC1, IntersectMap.iR1 ],
		[ 1, 3, IntersectMap.iC1, IntersectMap.iR1 ],
		[ 2, 6, IntersectMap.iC1, IntersectMap.iR1 ],


		//  X  Z  X
		//  X  Z  X
		//  X  Z  X
		//     Y
		//     Y
		//     Y
		//     Y
		//     Y
		//     Y
		//     Y
		//  BLK.iC2 <=> LINE.iR1
		[ 0, 1, IntersectMap.iC2, IntersectMap.iR1 ],
		[ 1, 4, IntersectMap.iC2, IntersectMap.iR1 ],
		[ 2, 7, IntersectMap.iC2, IntersectMap.iR1 ],

		//  X  X  Z
		//  X  X  Z
		//  X  X  Z
		//        Y
		//        Y
		//        Y
		//        Y
		//        Y
		//        Y
		//  BLK.iC3 <=> LINE.iR1
		[ 0, 2, IntersectMap.iC3, IntersectMap.iR1 ],
		[ 1, 5, IntersectMap.iC3, IntersectMap.iR1 ],
		[ 2, 8, IntersectMap.iC3, IntersectMap.iR1 ],

		//  Y
		//  Y
		//  Y
		//  Z  X  X
		//  Z  X  X
		//  Z  X  X
		//  Y
		//  Y
		//  Y
		//  BLK.iC1 <=> LINE.iR2
		[ 3, 0, IntersectMap.iC1, IntersectMap.iR2 ],
		[ 4, 3, IntersectMap.iC1, IntersectMap.iR2 ],
		[ 5, 6, IntersectMap.iC1, IntersectMap.iR2 ],

		//     Y
		//     Y
		//     Y
		//  X  Z  X
		//  X  Z  X
		//  X  Z  X
		//     Y
		//     Y
		//     Y
		//  BLK.iC2 <=> LINE.iR2
		[ 3, 1, IntersectMap.iC2, IntersectMap.iR2 ],
		[ 4, 4, IntersectMap.iC2, IntersectMap.iR2 ],
		[ 5, 7, IntersectMap.iC2, IntersectMap.iR2 ],

		//        Y
		//        Y
		//        Y
		//  X  X  Z
		//  X  X  Z
		//  X  X  Z
		//        Y
		//        Y
		//        Y
		//  BLK.iC3 <=> LINE.iR2
		[ 3, 2, IntersectMap.iC3, IntersectMap.iR2 ],
		[ 4, 5, IntersectMap.iC3, IntersectMap.iR2 ],
		[ 5, 8, IntersectMap.iC3, IntersectMap.iR2 ],

		//  Y
		//  Y
		//  Y
		//  Y
		//  Y
		//  Y
		//  Z  X  X
		//  Z  X  X
		//  Z  X  X
		//  BLK.iC1 <=> LINE.iR3
		[ 6, 0, IntersectMap.iC1, IntersectMap.iR3 ],
		[ 7, 3, IntersectMap.iC1, IntersectMap.iR3 ],
		[ 8, 6, IntersectMap.iC1, IntersectMap.iR3 ],

		//     Y
		//     Y
		//     Y
		//     Y
		//     Y
		//     Y
		//  X  Z  X
		//  X  Z  X
		//  X  Z  X
		//  BLK.iC2 <=> LINE.iR3
		[ 6, 1, IntersectMap.iC2, IntersectMap.iR3 ],
		[ 7, 4, IntersectMap.iC2, IntersectMap.iR3 ],
		[ 8, 7, IntersectMap.iC2, IntersectMap.iR3 ],

		//        Y
		//        Y
		//        Y
		//        Y
		//        Y
		//        Y
		//  X  X  Z
		//  X  X  Z
		//  X  X  Z
		//  BLK.iC3 <=> LINE.iR3
		[ 6, 2, IntersectMap.iC3, IntersectMap.iR3 ],
		[ 7, 5, IntersectMap.iC3, IntersectMap.iR3 ],
		[ 8, 8, IntersectMap.iC3, IntersectMap.iR3 ]
	]

	// 54 combinations of block-line mappings
	//  9 block's intersected with 3 rows & 3 columns each == 9 * 6 == 54
	test('strategy/block-line/interset-map-set/length ->> ' + sets.length, () => expect(sets.length).toBe(54))

	// Use maps to apply box-line strategy to each of these set mappings
	//  where
	//  [0] is the block index
	//  [1] is the line index
	//  [2] is the block intersect map
	//  [3] is the line intersect map
	// sets.forEach( set => {
	// 	const block = blocks[set[0]]
	// 	const line  = rows[set[1]]
	// 	const block_intersect_map = set[2]
	// 	const line_intersect_map = set[3]

	// 	// Apply box-line strategy to block-line mapping
	// 	// strategy_box_line( block, line, block_intersect_map, line_intersect_map )
	// })

})

/*
	public static void main(String args[])
	{
		ArrayList<Cell> members = new ArrayList<Cell>(9);

		for ( int y = 1, i = 1 ; y <= 3 ; y++ )
		for ( int x = 1 ; x <= 3 ; x++, i++ )
		{
			members.add(new Cell("D" + Integer.toString(i), new Point(x,y+3)));
		}

		Cell c = members.get(0);

		Block block = new Block(members);

		c = members.get(1);
		System.out.println("# Observers : " + Integer.toString(c.countObservers()));

		block.is(1,5);

		System.out.print(block.toString());

		block.is(4, 8);
		block.is(9, 1);
		block.is(8, 3);
		block.is(6, 9);
		block.is(2, 6);
		block.is(7, 4);
		block.is(5, 7);

		System.out.print(block.toString());

		block.reset();
		//	System.out.println(c.toString2());

		// Pointing Line
		System.out.println("");
		System.out.println("# Pointing-Line");
		members = new ArrayList<Cell>(9);

		for ( int x = 4 ; x <= 6 ; x++ )
		{
			members.add(block.cells.get(x-1));
		}

		for ( int x = 4 ; x <= 6 ; x++ )
		{
			members.add(new Cell("E" + Integer.toString(x), new Point(x,1)));
		}

		for ( int x = 4 ; x <= 6 ; x++ )
		{
			members.add(new Cell("F" + Integer.toString(x), new Point(x+3,1)));
		}
		Unit line = new Unit(members);

		ArrayList<Integer> bx = new ArrayList<Integer>(6);
		bx.add(1);bx.add(2);bx.add(3);bx.add(7);bx.add(8);bx.add(9);
		for ( Integer q : bx )
		{
			block.exclude(q, 1);
			block.exclude(q, 7);
		}
		block.exclude(5, 1);
		block.strategy_pointing_line( line, IntersectMap.iB, IntersectMap.iA );

		System.out.println(block.toStringName());
		System.out.println(block.toString());
		System.out.println( line.toStringName());
		System.out.println( line.toString());

		// Box Line
		System.out.println("# Box-Line");
		for ( int i = 4 ; i <= 9 ; i++ )
		{
		//	line.exclude(i, 4);
		//	line.exclude(i, 8);
			line.exclude(i, 9);
		}
		block.strategy_box_line( line, IntersectMap.iB, IntersectMap.iA );

		System.out.println(block.toStringName());
		System.out.println(block.toString());
		System.out.println( line.toStringName());
		System.out.println( line.toString());
	}
*/


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
