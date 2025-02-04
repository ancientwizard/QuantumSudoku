
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
	const cols: Array<UnitModel> = []

	// Messy but we'll refactor later; we need access to these items
	//  to play with strategy-block-line implementation & tests
	//  we'll make it more elegant later
	board.forEachBlock( block => blocks.push(block))
	board.forEachRow( row => rows.push(row))
	board.forEachColumn( col => cols.push(col))

	// Block & Line Strategy
	// GOAL: setup mapping for block-line strategy


	const sets: Array<[number, number, IntersectMap, IntersectMap, [string, string, string]]> = [
		//  ALL Instances of the following layouts

		// KEY:
		//  X = non-intersected-block (cells)
		//  Y = non-intersected-line  (cells)
		//  Z = intersection		  (cells)

		//  Z  Z  Z  Y  Y  Y  Y  Y  Y
		//  X  X  X
		//  X  X  X
		// BLK.iR1 <=> LINE.iR1
		[ 0, 0, IntersectMap.iR1, IntersectMap.iR1, ['A1,B1,C1', 'A2,B2,C2,A3,B3,C3', 'D1,E1,F1,G1,H1,I1'] ],
		[ 3, 3, IntersectMap.iR1, IntersectMap.iR1, ['A4,B4,C4', 'A5,B5,C5,A6,B6,C6', 'D4,E4,F4,G4,H4,I4'] ],
		[ 6, 6, IntersectMap.iR1, IntersectMap.iR1, ['A7,B7,C7', 'A8,B8,C8,A9,B9,C9', 'D7,E7,F7,G7,H7,I7'] ],

		//  X  X  X
		//  Z  Z  Z  Y  Y  Y  Y  Y  Y
		//  X  X  X
		//  BLK.iR2 <=> LINE.iR1
		[ 0, 1, IntersectMap.iR2, IntersectMap.iR1, ['A2,B2,C2', 'A1,B1,C1,A3,B3,C3', 'D2,E2,F2,G2,H2,I2'] ],
		[ 3, 4, IntersectMap.iR2, IntersectMap.iR1, ['A5,B5,C5', 'A4,B4,C4,A6,B6,C6', 'D5,E5,F5,G5,H5,I5'] ],
		[ 6, 7, IntersectMap.iR2, IntersectMap.iR1, ['A8,B8,C8', 'A7,B7,C7,A9,B9,C9', 'D8,E8,F8,G8,H8,I8'] ],

		//  X  X  X
		//  X  X  X
		//  Z  Z  Z  Y  Y  Y  Y  Y  Y
		//  BLK.iR3 <=> LINE.iR1
		[ 0, 2, IntersectMap.iR3, IntersectMap.iR1, ['A3,B3,C3', 'A1,B1,C1,A2,B2,C2', 'D3,E3,F3,G3,H3,I3'] ],
		[ 3, 5, IntersectMap.iR3, IntersectMap.iR1, ['A6,B6,C6', 'A4,B4,C4,A5,B5,C5', 'D6,E6,F6,G6,H6,I6'] ],
		[ 6, 8, IntersectMap.iR3, IntersectMap.iR1, ['A9,B9,C9', 'A7,B7,C7,A8,B8,C8', 'D9,E9,F9,G9,H9,I9'] ],

		//  Y  Y  Y  Z  Z  Z  Y  Y  Y
		//           X  X  X
		//           X  X  X
		//  BLK.iR1 <=> LINE.iR2
		[ 1, 0, IntersectMap.iR1, IntersectMap.iR2, ['D1,E1,F1', 'D2,E2,F2,D3,E3,F3', 'A1,B1,C1,G1,H1,I1'] ],
		[ 4, 3, IntersectMap.iR1, IntersectMap.iR2, ['D4,E4,F4', 'D5,E5,F5,D6,E6,F6', 'A4,B4,C4,G4,H4,I4'] ],
		[ 7, 6, IntersectMap.iR1, IntersectMap.iR2, ['D7,E7,F7', 'D8,E8,F8,D9,E9,F9', 'A7,B7,C7,G7,H7,I7'] ],

		//           X  X  X
		//  Y  Y  Y  Z  Z  Z  Y  Y  Y
		//           X  X  X
		//  BLK.iR2 <=> LINE.iR2
		[ 1, 1, IntersectMap.iR2, IntersectMap.iR2, ['D2,E2,F2', 'D1,E1,F1,D3,E3,F3', 'A2,B2,C2,G2,H2,I2'] ],
		[ 4, 4, IntersectMap.iR2, IntersectMap.iR2, ['D5,E5,F5', 'D4,E4,F4,D6,E6,F6', 'A5,B5,C5,G5,H5,I5'] ],
		[ 7, 7, IntersectMap.iR2, IntersectMap.iR2, ['D8,E8,F8', 'D7,E7,F7,D9,E9,F9', 'A8,B8,C8,G8,H8,I8'] ],

		//           X  X  X
		//           X  X  X
		//  Y  Y  Y  Z  Z  Z  Y  Y  Y
		//  BLK.iR3 <=> LINE.iR2
		[ 1, 2, IntersectMap.iR3, IntersectMap.iR2, ['D3,E3,F3', 'D1,E1,F1,D2,E2,F2', 'A3,B3,C3,G3,H3,I3'] ],
		[ 4, 5, IntersectMap.iR3, IntersectMap.iR2, ['D6,E6,F6', 'D4,E4,F4,D5,E5,F5', 'A6,B6,C6,G6,H6,I6'] ],
		[ 7, 8, IntersectMap.iR3, IntersectMap.iR2, ['D9,E9,F9', 'D7,E7,F7,D8,E8,F8', 'A9,B9,C9,G9,H9,I9'] ],

		//  Y  Y  Y  Y  Y  Y  Z  Z  Z
		//  				  X  X  X
		//  				  X  X  X
		//  BLK.iR1 <=> LINE.iR3
		[ 2, 0, IntersectMap.iR1, IntersectMap.iR3, ['G1,H1,I1', 'G2,H2,I2,G3,H3,I3', 'A1,B1,C1,D1,E1,F1'] ],
		[ 5, 3, IntersectMap.iR1, IntersectMap.iR3, ['G4,H4,I4', 'G5,H5,I5,G6,H6,I6', 'A4,B4,C4,D4,E4,F4'] ],
		[ 8, 6, IntersectMap.iR1, IntersectMap.iR3, ['G7,H7,I7', 'G8,H8,I8,G9,H9,I9', 'A7,B7,C7,D7,E7,F7'] ],

		//  				  X  X  X
		//  Y  Y  Y  Y  Y  Y  Z  Z  Z
		//  				  X  X  X
		//  BLK.iR2 <=> LINE.iR3
		[ 2, 1, IntersectMap.iR2, IntersectMap.iR3, ['G2,H2,I2', 'G1,H1,I1,G3,H3,I3', 'A2,B2,C2,D2,E2,F2'] ],
		[ 5, 4, IntersectMap.iR2, IntersectMap.iR3, ['G5,H5,I5', 'G4,H4,I4,G6,H6,I6', 'A5,B5,C5,D5,E5,F5'] ],
		[ 8, 7, IntersectMap.iR2, IntersectMap.iR3, ['G8,H8,I8', 'G7,H7,I7,G9,H9,I9', 'A8,B8,C8,D8,E8,F8'] ],

		//  				  X  X  X
		//  				  X  X  X
		//  Y  Y  Y  Y  Y  Y  Z  Z  Z
		//  BLK.iR3 <=> LINE.iR3
		[ 2, 2, IntersectMap.iR3, IntersectMap.iR3, ['G3,H3,I3', 'G1,H1,I1,G2,H2,I2', 'A3,B3,C3,D3,E3,F3'] ],
		[ 5, 5, IntersectMap.iR3, IntersectMap.iR3, ['G6,H6,I6', 'G4,H4,I4,G5,H5,I5', 'A6,B6,C6,D6,E6,F6'] ],
		[ 8, 8, IntersectMap.iR3, IntersectMap.iR3, ['G9,H9,I9', 'G7,H7,I7,G8,H8,I8', 'A9,B9,C9,D9,E9,F9'] ],

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
		[ 0, 0, IntersectMap.iC1, IntersectMap.iR1, ['A1,A2,A3', 'B1,C1,B2,C2,B3,C3', 'A4,A5,A6,A7,A8,A9'] ],
		[ 1, 3, IntersectMap.iC1, IntersectMap.iR1, ['D1,D2,D3', 'E1,F1,E2,F2,E3,F3', 'D4,D5,D6,D7,D8,D9'] ],
		[ 2, 6, IntersectMap.iC1, IntersectMap.iR1, ['G1,G2,G3', 'H1,I1,H2,I2,H3,I3', 'G4,G5,G6,G7,G8,G9'] ],


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
		[ 0, 1, IntersectMap.iC2, IntersectMap.iR1, ['B1,B2,B3', 'A1,C1,A2,C2,A3,C3', 'B4,B5,B6,B7,B8,B9'] ],
		[ 1, 4, IntersectMap.iC2, IntersectMap.iR1, ['E1,E2,E3', 'D1,F1,D2,F2,D3,F3', 'E4,E5,E6,E7,E8,E9'] ],
		[ 2, 7, IntersectMap.iC2, IntersectMap.iR1, ['H1,H2,H3', 'G1,I1,G2,I2,G3,I3', 'H4,H5,H6,H7,H8,H9'] ],

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
		[ 0, 2, IntersectMap.iC3, IntersectMap.iR1, ['C1,C2,C3', 'A1,B1,A2,B2,A3,B3', 'C4,C5,C6,C7,C8,C9'] ],
		[ 1, 5, IntersectMap.iC3, IntersectMap.iR1, ['F1,F2,F3', 'D1,E1,D2,E2,D3,E3', 'F4,F5,F6,F7,F8,F9'] ],
		[ 2, 8, IntersectMap.iC3, IntersectMap.iR1, ['I1,I2,I3', 'G1,H1,G2,H2,G3,H3', 'I4,I5,I6,I7,I8,I9'] ],

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
		[ 3, 0, IntersectMap.iC1, IntersectMap.iR2, ['A4,A5,A6', 'B4,C4,B5,C5,B6,C6', 'A1,A2,A3,A7,A8,A9'] ],
		[ 4, 3, IntersectMap.iC1, IntersectMap.iR2, ['D4,D5,D6', 'E4,F4,E5,F5,E6,F6', 'D1,D2,D3,D7,D8,D9'] ],
		[ 5, 6, IntersectMap.iC1, IntersectMap.iR2, ['G4,G5,G6', 'H4,I4,H5,I5,H6,I6', 'G1,G2,G3,G7,G8,G9'] ],

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
		[ 3, 1, IntersectMap.iC2, IntersectMap.iR2, ['B4,B5,B6', 'A4,C4,A5,C5,A6,C6', 'B1,B2,B3,B7,B8,B9'] ],
		[ 4, 4, IntersectMap.iC2, IntersectMap.iR2, ['E4,E5,E6', 'D4,F4,D5,F5,D6,F6', 'E1,E2,E3,E7,E8,E9'] ],
		[ 5, 7, IntersectMap.iC2, IntersectMap.iR2, ['H4,H5,H6', 'G4,I4,G5,I5,G6,I6', 'H1,H2,H3,H7,H8,H9'] ],

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
		[ 3, 2, IntersectMap.iC3, IntersectMap.iR2, ['C4,C5,C6', 'A4,B4,A5,B5,A6,B6', 'C1,C2,C3,C7,C8,C9'] ],
		[ 4, 5, IntersectMap.iC3, IntersectMap.iR2, ['F4,F5,F6', 'D4,E4,D5,E5,D6,E6', 'F1,F2,F3,F7,F8,F9'] ],
		[ 5, 8, IntersectMap.iC3, IntersectMap.iR2, ['I4,I5,I6', 'G4,H4,G5,H5,G6,H6', 'I1,I2,I3,I7,I8,I9'] ],

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
		[ 6, 0, IntersectMap.iC1, IntersectMap.iR3, ['A7,A8,A9', 'B7,C7,B8,C8,B9,C9', 'A1,A2,A3,A4,A5,A6'] ],
		[ 7, 3, IntersectMap.iC1, IntersectMap.iR3, ['D7,D8,D9', 'E7,F7,E8,F8,E9,F9', 'D1,D2,D3,D4,D5,D6'] ],
		[ 8, 6, IntersectMap.iC1, IntersectMap.iR3, ['G7,G8,G9', 'H7,I7,H8,I8,H9,I9', 'G1,G2,G3,G4,G5,G6'] ],

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
		[ 6, 1, IntersectMap.iC2, IntersectMap.iR3, ['B7,B8,B9', 'A7,C7,A8,C8,A9,C9', 'B1,B2,B3,B4,B5,B6'] ],
		[ 7, 4, IntersectMap.iC2, IntersectMap.iR3, ['E7,E8,E9', 'D7,F7,D8,F8,D9,F9', 'E1,E2,E3,E4,E5,E6'] ],
		[ 8, 7, IntersectMap.iC2, IntersectMap.iR3, ['H7,H8,H9', 'G7,I7,G8,I8,G9,I9', 'H1,H2,H3,H4,H5,H6'] ],

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
		[ 6, 2, IntersectMap.iC3, IntersectMap.iR3, ['C7,C8,C9', 'A7,B7,A8,B8,A9,B9', 'C1,C2,C3,C4,C5,C6'] ],
		[ 7, 5, IntersectMap.iC3, IntersectMap.iR3, ['F7,F8,F9', 'D7,E7,D8,E8,D9,E9', 'F1,F2,F3,F4,F5,F6'] ],
		[ 8, 8, IntersectMap.iC3, IntersectMap.iR3, ['I7,I8,I9', 'G7,H7,G8,H8,G9,H9', 'I1,I2,I3,I4,I5,I6'] ],
	]

	// 54 combinations of block-line mappings
	//  9 block's intersected with 3 rows & 3 columns each == 9 * 6 == 54
	// test('strategy/block-line/interset-map-set/length ->> ' + sets.length, () => expect(sets.length).toBe(54))

	// Proofs that intersect maps are setup correctly by testing selected cells by name.
	//  The single best way to idenfy a selected cell is by its location within the sudoku board.
	//  Each cell has a NAME defined as COLS: A-I + ROWS.1-9
	//  Each intercept returns three cells, each non-intercect returns six cells.
	sets.forEach( (map_pair,idx) => {
		test('strategy/block-line/intersect-map-set/sets['+idx+']', () => {
			const block = blocks[map_pair[0]].as_cell_array
			const line  = idx < 27 ? rows[map_pair[1]].as_cell_array : cols[map_pair[1]].as_cell_array
			const blk_imap = map_pair[2]
			const lne_imap = map_pair[3]
			const expected_intersect_names = map_pair[4][0]
			const expected_blk_non_intersect_names = map_pair[4][1]
			const expected_lne_non_intersect_names = map_pair[4][2] // need to add this data above
			expect(blk_imap.getIntersectCells(block).map( c => c.name ).join(',')).toBe(expected_intersect_names)
			expect(lne_imap.getIntersectCells(line).map( c => c.name ).join(',')).toBe(expected_intersect_names)
			expect(blk_imap.getNonIntersectCells(block).map( c => c.name ).join(',')).toBe(expected_blk_non_intersect_names)
			expect(lne_imap.getNonIntersectCells(line).map( c => c.name ).join(',')).toBe(expected_lne_non_intersect_names)
		})
	})

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
