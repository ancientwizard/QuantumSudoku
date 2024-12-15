
//
// Sudoku Block Model (3x3 grid [box])
//

import      { UnitModel     } from '@/js/model/UnitModel'
import type { CellModel     } from '@/js/model/CellModel'
import      { CellIdent     } from '@/js/model/CellIdent'
import      { CellValue     } from '@/js/model/CellValue'

export
class BlockModel extends UnitModel
{
    // static iC1: Array<number> = [ 1, 4, 7 ] // Col 1
    // static iC2: Array<number> = [ 2, 5, 8 ] // Col 2
    // static iC3: Array<number> = [ 3, 6, 9 ] // Col 3
    // static iR1: Array<number> = [ 1, 2, 3 ] // Row 1
    // static iR2: Array<number> = [ 4, 5, 6 ] // Row 2
    // static iR3: Array<number> = [ 7, 8, 9 ] // Row 3

    static iC1: Array<CellValue> = [ CellValue.ONE,   CellValue.FOUR,   CellValue.SEVEN ] // Col 1
    static iC2: Array<CellValue> = [ CellValue.TWO,   CellValue.FIVE,   CellValue.EIGHT ] // Col 2
    static iC3: Array<CellValue> = [ CellValue.THREE, CellValue.SIX,    CellValue.NINE  ] // Col 3
    static iR1: Array<CellValue> = [ CellValue.ONE,   CellValue.TWO,    CellValue.THREE ] // Row 1
    static iR2: Array<CellValue> = [ CellValue.FOUR,  CellValue.FIVE,   CellValue.SIX   ] // Row 2
    static iR3: Array<CellValue> = [ CellValue.SEVEN, CellValue.EIGHT,  CellValue.NINE  ] // Row 3

    // The BlockModel constructor is a bit different from the UnitModel constructor
    //  because the BlockModel constructor is also an arrangement of three rows of three cells
    //  and three columns of three cells. This makes up nine cells in total like the unit.
    //  With the added complexity of intersecting with three Row's and Column's as three cells.
    //  Whereas a typical unit making up a row or column only interscts with one cell.

    constructor ( member_cells: Array<CellModel> )
    {
        super( member_cells )
    }

    public toStringBlock(): string
    {
        const map : string[][] = [
            [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
        ];

        let x = 1
        let y = 1

        this.cells.forEach( cell => {
            if ( cell.isKnown )
            {
                map[y][x-1] = '['
                map[y][x  ] = cell.cv.label
                map[y][x+1] = ']'
            }
            else
            {
                cell.as_candidate_array.forEach( I => {
                    switch ( I.value )
                    {
                        case 1: map[y-1][x-1] = '1'; break;
                        case 2: map[y-1][x  ] = '2'; break;
                        case 3: map[y-1][x+1] = '3'; break;
                        case 4: map[y  ][x-1] = '4'; break;
                        case 5: map[y  ][x  ] = '5'; break;
                        case 6: map[y  ][x+1] = '6'; break;
                        case 7: map[y+1][x-1] = '7'; break;
                        case 8: map[y+1][x  ] = '8'; break;
                        case 9: map[y+1][x+1] = '9'; break;
                    }
                })
            }

            // Next Cell alignment
            x += 3

            if ( x > 9 )
            {
                x = 1
                y += 3
            }
        })

        let s = "+-----+-----+-----+\n";

        for (y = 0; y < 9; y++) {
            for (x = 0; x < 9; x++) {

                if (x == 0 || x == 3 || x == 6) {
                    s += "| ";
                }
                s += map[y][x];
                if (x == 2 || x == 5) {
                    s += " ";
                }
                if (x == 8) {
                    s += " |\n";
                }
            }

            if (y == 2 || y == 5 || y == 8) {
                s += "+-----+-----+-----+\n";
            }
        }

        return s;
    }

    public toStringNames () : string
    {
        const map : string[][] = [
            ['  ', '  ', '  '],
            ['  ', '  ', '  '],
            ['  ', '  ', '  ']
        ]

        let x = 1
        let y = 1

        this.cells.forEach( c => {
            map[y-1][x-1] = c.name

            x += 1

            if (x > 3)
            {
                x = 1
                y += 1
            }
        })

        let s = "+--+--+--+\n"

        for ( y = 0 ; y < 3 ; y++ )
        {
            for ( x = 0 ; x < 3 ; x++ )
            {
                s += '|' + map[y][x];
                if (x == 2) s += "|\n"
            }

            s += "+--+--+--+\n";
        }

        return s
    }

    public toStringCoords(): string
    {
        const map : string[][] = [
            ['  ', '  ', '  '],
            ['  ', '  ', '  '],
            ['  ', '  ', '  ']
        ]

        let x = 1
        let y = 1

        this.cells.forEach( c => {
            map[y-1][x-1] = c.coord

            x += 1

            if (x > 3)
            {
                x = 1
                y += 1
            }
        })

        let s = "+-----+-----+-----+\n"

        for ( y = 0 ; y < 3 ; y++ )
        {
            for ( x = 0 ; x < 3 ; x++ )
            {
                s += '|' + map[y][x];
                if (x == 2) s += "|\n"
            }

            s += "+-----+-----+-----+\n"
        }

        return s
    }
}

// vim: expandtab number tabstop=4
// END
