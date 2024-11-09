
// Sudoku Block of Cell's interface
//  the "Grid(3x3)" implementation of a puzzle "Unit"
//  A Block is made of three parts of three colums and 3 parts of three rows

import type { iCellIndex        } from '@/js/interface/iCellIdentification'
import type { iObservedState    } from '@/js/interface/iObservedState'

export
interface iBlock
{
    is      ( idx: iCellIndex, value: iObservedState ) : boolean;
    exclude ( idx: iCellIndex, value: iObservedState ) : boolean;

    isSolved () : boolean;
    isBroken () : boolean;
}

// vim: expandtab number tabstop=4
// END
