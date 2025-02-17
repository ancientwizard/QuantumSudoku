// Sudoku Unit of Cell's interface
//  "ANY" of "BOX(3x3)" | "Row" | "Column"

import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import type { CellModel         } from '@/js/model/CellModel'
export
interface iUnit
{
    is      ( idx: iCellIndex, value: iObservedState ) : boolean;
    exclude ( idx: iCellIndex, value: iObservedState ) : boolean;

    get isSolved () : boolean;
    get isBroken () : boolean;

    forEachCell( callback: ( cell: CellModel, index: number) => void): void;
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
