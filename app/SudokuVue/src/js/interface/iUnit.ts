// Sudoku Unit of Cell's interface
//  "ANY" of "Grid(3x3)" | "Row" | "Column"

import type { iCellIndex        } from '@/js/interface/iCellIdentification'
import type { iObservedState    } from '@/js/interface/iObservedState'

export
interface iUnit
{
    is      ( idx: iCellIndex, value: iObservedState ) : boolean;
    exclude ( idx: iCellIndex, value: iObservedState ) : boolean;

    isSolved () : boolean;
    isBroken () : boolean;
}

// vim: expandtab number tabstop=4
// END
