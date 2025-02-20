
// Sudoku Block of Cell's interface
//  the "BOX(3x3)" implementation of a puzzle "Unit"
//  A Block is made of three parts of three colums and 3 parts of three rows

import type { CellModel         } from '../model/CellModel'

// import type { iCellIndex        } from '@/js/interface/iCellIndex'
// import type { iObservedState    } from '@/js/interface/iObservedState'

export
interface iBox
{
    isBox () : boolean

    // is      ( idx: iCellIndex, value: iObservedState ) : boolean;
    // exclude ( idx: iCellIndex, value: iObservedState ) : boolean;

    // get isSolved () : boolean;
    // get isBroken () : boolean;
    get as_cell_array () : Array<CellModel>;

    forEachCell ( callback: ( cell: CellModel, index: number) => void): void;    
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
