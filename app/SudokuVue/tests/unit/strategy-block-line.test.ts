
// strategy-box-line.test.ts
// box & Line Strategy unit testing

import      { describe, expect, test    } from '@jest/globals'
import      { BoardModel, BoardMode     } from '@/js/model/BoardModel'
import      { StrategyMappingFactory    } from '@/js/strategy/StrategyMappingFactory'
import type { BoxModel                  } from '@/js/model/BoxModel'
import type { UnitModel                 } from '@/js/model/UnitModel'


describe('strategy/box-line/setup', () => {
    const board = new BoardModel(BoardMode.SOLVE)
    const boxes: Array<BoxModel> = []
    const rows: Array<UnitModel> = []
    const cols: Array<UnitModel> = []

    // Messy but we'll refactor later; we need access to these items
    //  to play with strategy-box-line implementation for testing
    //  we'll make it more elegant later
    board.forEachBox( box => boxes.push(box))
    board.forEachRow( row => rows.push(row))
    board.forEachCol( col => cols.push(col))

    // box & Line Strategy
    // GOAL: setup mapping for box-line strategy

    const sets = StrategyMappingFactory.createBoxLineIntercepts()

    // 54 combinations of box-line mappings
    //  9 box's intersected with 3 rows & 3 columns each == 9 * 6 == 54
    test('strategy/box-line/interset-map-set/length ->> ' + sets.length, () => expect(sets.length).toBe(54))

    // Proofs that intersect maps are setup correctly by testing selected cells by name.
    //  The single best way to idenfy a selected cell is by its location within the sudoku board.
    //  Each cell has a NAME defined as COLS: A-I + ROWS.1-9
    //  Each intercept returns three cells, each non-intercect returns six cells.
    sets.forEach( (map_pair,idx) => {
        test('strategy/box-line/intersect-map-set/sets['+idx+']', () => {
            const box = boxes[map_pair[0]].as_cell_array
            const line  = idx < 27 ? rows[map_pair[1]].as_cell_array : cols[map_pair[1]].as_cell_array
            const blk_imap = map_pair[2]
            const lne_imap = map_pair[3]
            const expected_intersect_names = map_pair[4][0]
            const expected_blk_non_intersect_names = map_pair[4][1]
            const expected_lne_non_intersect_names = map_pair[4][2] // need to add this data above
            expect(blk_imap.getIntersectCells(box).map( c => c.name ).join(',')).toBe(expected_intersect_names)
            expect(lne_imap.getIntersectCells(line).map( c => c.name ).join(',')).toBe(expected_intersect_names)
            expect(blk_imap.getNonIntersectCells(box).map( c => c.name ).join(',')).toBe(expected_blk_non_intersect_names)
            expect(lne_imap.getNonIntersectCells(line).map( c => c.name ).join(',')).toBe(expected_lne_non_intersect_names)
        })
    })

    // Use maps to apply box-line strategy to each of these set mappings
    //  where
    //  [0] is the box index
    //  [1] is the line index
    //  [2] is the box intersect map
    //  [3] is the line intersect map
    sets.forEach( set => {
        const block = boxes[set[0]]
        const line  = rows[set[1]]
        const block_intersect_map = set[2]
        const line_intersect_map = set[3]

        // Apply box-line strategy to box-line mapping
        // strategy_box_line( box, line, box_intersect_map, line_intersect_map )
    })

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
        //    System.out.println(c.toString2());

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
        //    line.exclude(i, 4);
        //    line.exclude(i, 8);
            line.exclude(i, 9);
        }
        block.strategy_box_line( line, IntersectMap.iB, IntersectMap.iA );

        System.out.println(block.toStringName());
        System.out.println(block.toString());
        System.out.println( line.toStringName());
        System.out.println( line.toString());
    }
*/


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
