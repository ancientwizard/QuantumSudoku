
//
// Sudoku Block Model (3x3 grid [box])
//

import type { iBox          } from '@/js/interface/iBox'
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
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
