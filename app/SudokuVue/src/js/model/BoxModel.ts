
//
// Sudoku Block Model (3x3 grid [box])
//

import type { iBox          } from '@/js/interface/iBox'
// import type { CellModel     } from '@/js/model/CellModel'
import      { CellIndex     } from '@/js/model/CellIndex'
import      { UnitModel     } from '@/js/model/UnitModel'

export
class BoxModel extends UnitModel implements iBox
{
    // Where ROWS & COLUMNS come to intersect the BOX
    static iC1: Array<CellIndex> = [ CellIndex.ONE,   CellIndex.FOUR,   CellIndex.SEVEN ] // Col 1
    static iC2: Array<CellIndex> = [ CellIndex.TWO,   CellIndex.FIVE,   CellIndex.EIGHT ] // Col 2
    static iC3: Array<CellIndex> = [ CellIndex.THREE, CellIndex.SIX,    CellIndex.NINE  ] // Col 3
    static iR1: Array<CellIndex> = [ CellIndex.ONE,   CellIndex.TWO,    CellIndex.THREE ] // Row 1
    static iR2: Array<CellIndex> = [ CellIndex.FOUR,  CellIndex.FIVE,   CellIndex.SIX   ] // Row 2
    static iR3: Array<CellIndex> = [ CellIndex.SEVEN, CellIndex.EIGHT,  CellIndex.NINE  ] // Row 3

    // The BoxModel constructor is a bit different from the UnitModel constructor
    //  because the BoxModel constructor is also an arrangement of three rows of three cells
    //  and three columns of three cells. This makes up nine cells in total like the unit.
    //  With the added complexity of intersecting with three Row's and Column's as three cells.
    //  Whereas a typical line-unit making up a row or column only interscts with one cell.

    // HOWEVER: the board is resposible for organizing the cells into rows, columns and boxes.
    //  It successfully does this by referencing the static arrays above.

    // constructor ( member_cells: Array<CellModel> )
    // {
    //     super( member_cells )
    // }

    // public isBox()              : boolean { return true }
    // public isLine()             : boolean { return false }
    // public isRow()              : boolean { return false }
    // public isCol()              : boolean { return false }
    // public isDiagional()        : boolean { return false }
    // public isTopLeftBotRight()  : boolean { return false }
    // public isBotLeftTopRight()  : boolean { return false }

    public toString(): string { throw new Error('BoxModel.toString() See: SudokuTextAdapter.factory(box)') }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
