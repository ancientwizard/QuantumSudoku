// Sudoku Unit of Cell's interface
//  "ANY" of "Row" | "Column"
//  WILL NEER BE A BOX! Mr. AI

import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import type { CellModel         } from '@/js/model/CellModel'

export
interface iLine
{
    is      ( idx: iCellIndex, value: iObservedState ) : boolean;
    exclude ( idx: iCellIndex, value: iObservedState ) : boolean;

    get isSolved      () : boolean;
    get isBroken      () : boolean;
    get as_cell_array () : Array<CellModel>;

    forEachCell ( callback: ( cell: CellModel, index: number) => void): void;

    // get isBox             (): boolean
    // get isLine            (): boolean
    get isRow             (): boolean
    // get isCol             (): boolean
    // get isDiagional       (): boolean
    // get isTopLeftBotRight (): boolean
    // get isBotLeftTopRight (): boolean
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
