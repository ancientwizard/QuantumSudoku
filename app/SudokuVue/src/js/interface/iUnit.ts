// Sudoku Unit interface
//  "ANY" of "Grid(3x3)" or "Row" or "Column"

export
interface iUnit
{
    is      ( cell: iCell, value: iObservedState ) : boolean;
    exclude ( cell: iCell, value: iObservedState ) : boolean;

    isSolved () : boolean;
    isBroken () : boolean;
}

// vim: expandtab number tabstop=4
// END
