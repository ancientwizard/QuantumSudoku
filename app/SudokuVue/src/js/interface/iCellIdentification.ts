// iCellIdentification.ts - "Cell" identification
//   While a cell's identification isn't part of Sudoku;
//   Cells do have their place in the overall puzzle.
//   Knowing one's relationship in the puzzle's structure
//   proves to be useful when writing a Sudoku model

export
interface iCellIdentification
{
    public    label: string;

    readonly    col: number;
    readonly    row: number;
    readonly      x: number;  // Redundent "col"
    readonly      y: number;  // Redundent "row"

    readonly  coord: string;
    readonly   name: string;
    readonly  cname: string;
}

// vim: expandtab number tabstop=4
// END
