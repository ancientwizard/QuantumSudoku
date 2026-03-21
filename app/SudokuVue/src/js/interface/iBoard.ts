
// iBoard.ts

// Sudoku Board of Cell's interface
//  the "Grid(9x9)" implementation of a sudoku puzzle
//  A Board is made of three parts of nine columns and nine parts of nine rows
//   intersecting with each other and the nine boxes.

import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import type { iUnit             } from '@/js/interface/iUnit'
import type { iBox              } from '@/js/interface/iBox';

export
interface iBoard
{
    set     ( idx: iCellIndex, idy: iCellIndex, value: iObservedState ) : boolean;
    // exclude ( idx: iCellIndex, idy: iCellIndex, value: iObservedState ) : boolean;

    get isSolved () : boolean;
    // get isBroken () : boolean;

    forEachRow( callback: ( row: iUnit, index: number) => void): void;
    forEachCol( callback: ( col: iUnit, index: number) => void): void;
    forEachBox( callback: ( box: iBox,  index: number) => void): void;
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
