// Sudoku Cell Index
//  "a-way" to ensure there being only 9 members
//  The validation "BUCK" stops here

import type { iCellIndex      } from '@/js/interface/iCellIndex'

// Could have been a enum just as easily
//  I like being a bit more expressive

export
class CellIndex implements iCellIndex
{
    // Provides for [] zero based index
    static ONE   : CellIndex = new CellIndex(0)
    static TWO   : CellIndex = new CellIndex(1)
    static THREE : CellIndex = new CellIndex(2)
    static FOUR  : CellIndex = new CellIndex(3)
    static FIVE  : CellIndex = new CellIndex(4)
    static SIX   : CellIndex = new CellIndex(5)
    static SEVEN : CellIndex = new CellIndex(6)
    static EIGHT : CellIndex = new CellIndex(7)
    static NINE  : CellIndex = new CellIndex(8)

    private IDX: number

    protected constructor ( index: number )
    {
        // Yes; redundent
        if ( index  > 8 || index < 0 )
            throw new Error(`Invalid Sudoku INDEX [ ${index} ]`)

        this.IDX = index
    }

    get index  () : number { return this.IDX }
    get name   () : string { return '' + ( this.IDX + 1 ) }

    // Somthing of an iteratoe
    static get arrayFactory () : Array<CellIndex>
    {
        return [
            CellIndex.ONE,   CellIndex.TWO,   CellIndex.THREE,
            CellIndex.FOUR,  CellIndex.FIVE,  CellIndex.SIX,
            CellIndex.SEVEN, CellIndex.EIGHT, CellIndex.NINE
        ]
    }
}

// vim: expandtab number tabstop=4 shiftwidth=4
// END
