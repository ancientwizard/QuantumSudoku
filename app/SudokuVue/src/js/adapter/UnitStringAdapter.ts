
// UnitStringAdaptor.ts

import type { CellModel } from '@/js/model/CellModel'

class CellFormatter
{
  private _colLabel: string
  private _rowLabel: string
  private _matrix: Array<Array<string>> = Array.from({ length: 3 }, () => Array(3).fill(' '))

  constructor ( colLabel = '', rowLabel = '' )
  {
    this._colLabel = colLabel
    this._rowLabel = rowLabel
  }

  get colLabel(): string { return this._colLabel }
  get rowLabel(): string { return this._rowLabel }
  get matrix(): Array<Array<string>> { return this._matrix }

  public apply( cell: CellModel ): CellFormatter
  {
    if ( ! this._colLabel ) this._colLabel += cell.cname
    if ( ! this._rowLabel ) this._rowLabel += cell.row

    // OOPS you have overlapped cell values by miscalculating the cell - SNAP!
    if ( !this.isEmpty() )
    {
      if ( new CellFormatter().apply( cell ).toString() != this.toString() )
        throw new Error('CellFormatter: apply() called on a non-empty cell formatter')
      return this
    }

    if ( cell.isKnown )
    {
      this._matrix[1] = [ '[', cell.cv.label, ']' ]
      return this
    }

    cell.as_candidate_array.forEach( cv => {
      this._matrix[Math.floor((cv.value - 1) / 3)][(cv.value - 1) % 3] = cv.value.toString()
    })

    return this
  }

  public isEmpty(): boolean
  {
    return this._matrix.every( row => row.every( cell => cell === ' ' ) )
  }

  public toString(): string
  {
    const matrix = this._matrix
    const lines: string[] = []

    if ( this._colLabel ) lines.push(`   ${this._colLabel}`)

    lines.push('+-----+')
    matrix.forEach(( row, idx ) => {
      const label = idx == 1 && this._rowLabel ? ' ' + this._rowLabel : ''
      lines.push(`| ${row.join('')} |${label}`)
    })

    lines.push('+-----+')

    return lines.join('\n') + '\n'
  }
}

class CellArrayFormatter
{
  // A cell's value || candivalues are displayed witin a 3x3 text array
  private static cellDiminsion = 3;

  // The matrix of cell values
  private cell_matrix: Array<Array<CellFormatter>> = Array.from({ length: 9 }, () => [] ) //Array(9).fill(new CellFormatter()))

  // The formatter should TRIM the cell ROWS and COLS that are unused.
  private trim = false

  constructor ( trim = false )
  {
    this.trim = trim

    const cell_matrix = this.cell_matrix
    const col_labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    const row_labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    cell_matrix.forEach(( row, ridx ) => {
      col_labels.forEach( col_label => {
        row.push( new CellFormatter( col_label, row_labels[ridx] ) )
      })
    })
  }

  public apply( cell: CellModel ): CellFormatter
  {
    const row_idx = cell.row - 1
    const col_idx = cell.col - 1
    const matrix  = this.cell_matrix
    const fmtCell = matrix[row_idx][col_idx]

    fmtCell.apply( cell )

    // The caller may wish to have a sniff
    //  but dont inhale to hard, the fumes might get you!
    return fmtCell
  }

  public toString(): string
  {
    const board_strings: string[] = []
    const matrix = this.cell_matrix
    const include_col: Array<boolean> = Array(9).fill( !this.trim )

    // Compute include_col[]; assign true to each column that has a non-empty cell
    if ( this.trim )
      matrix.forEach( row => {
        row.forEach( ( cell, cidx ) => {
          if ( !cell.isEmpty() ) include_col[cidx] = true
        })
      })

    // Row separator
    const separator = include_col.filter(x=>x).map(()=>'+-----').join('') + '+';

    // Column labels
    board_strings.push(matrix[0].filter((cell,idx)=>include_col[idx]).map( cell => `   ${cell.colLabel}` ).join('  '))
    board_strings.push(separator)

    // Convert the row of cells into three rows of strings
    //   1st row is the top of the cell
    //   2nd row is the middle of the cell
    //   3rd row is the bottom of the cell

    matrix.forEach( row => {
      // Skip rows that contain "ALL" empty cells
      //   EMPTY == no values has been recorded. This isn't an actual cell
      //   its a TEXT markup, its empty until a cell's state has been applied
      //   to the cell formatter.
      if ( this.trim && row.every( cell => cell.isEmpty() ) ) return

      const row_strings = [['| '], ['| '], ['| ']]

      row.forEach(( cell, cidx ) => {
        // Skip COLUMS that contain "ALL" empty cells
        if ( ! include_col[cidx] ) return

        const cell_matrix = cell.matrix

        for ( let ri = 0 ; ri < 3; ri++ )
        {
          row_strings[ri].push( cell_matrix[ri].join(''))
          row_strings[ri].push( ri < 3 ? ' | ' : ' |')
        }
      })

      row_strings[1].push(row[0].rowLabel)
      board_strings.push(row_strings[0].join('').trim())
      board_strings.push(row_strings[1].join('').trim())
      board_strings.push(row_strings[2].join('').trim())
      board_strings.push(separator)
    })

    return board_strings.join('\n') + '\n'
  }
}

export { CellFormatter, CellArrayFormatter }

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
