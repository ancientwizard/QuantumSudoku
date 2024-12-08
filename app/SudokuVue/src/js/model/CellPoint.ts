
//
// Sudoku Cell Point
//

export
class CellPoint
{

  private COL: number
  private ROW: number

  constructor ( col: number, row: number )
  {
    if ( col  > 9 || col < 0 || row > 9 || row < 0 )
      throw new Error(`Invalid Sudoku location [ ${col}, ${row} ]`)
    if ( col == 0 && row != 0 || row == 0 && col != 0 )
      throw new Error(`Invalid Sudoku NON-location [ ${col}, ${row} ]`)

    this.COL = col
    this.ROW = row
  }

  get x      () : number { return this.COL }
  get y      () : number { return this.ROW }
  get column () : number { return this.COL }
  get row    () : number { return this.ROW }
  get coord  () : string { return '(' + this.COL + ',' + this.ROW + ')' }
}

// vim: expandtab number tabstop=2 shiftwidth=4
// END
