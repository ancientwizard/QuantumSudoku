
// UnitStringAdaptor.ts

import type { iLine     } from '@/js/interface/iLine'
import type { iBox      } from '@/js/interface/iBox'
import type { CellModel } from '@/js/model/CellModel'
import { sep } from 'path';
// import      { CellModel } from '@/js/model/CellModel'
// import { CellValue } from '../model/CellValue';

class UnitStringAdaptor
{
  static LineString( unit: iLine ): string
  {
    // GOAL: Format the unit as a ROW (horizontal) or COLUMN (vertical) string
    //   It must look like the following:
    //    (if the value of a cell is known it is displayed as [VALUE] within a 5x3 text array
    //     otherwise display the candidate values as a 3x3 grid of values within the 5x3 text array
    //     using a space for excluded values)
    //    JUST Look at the examples the AI failed to read properly!
    //
    //   SOLVED:   HAS CANDIDATE VALUES:
    //   +-----+   +-----+
    //   |     |   | 1 3 |
    //   | [X] |   |  5  |
    //   |     |   | 7 9 |
    //   +-----+   +-----+
    //
    //   ROW:
    //   +-----+-----+-----+-----+-----+-----+-----+-----+-----+
    //   | 1   |     |     |     | 1   |     |     |     | 1   |
    //   |  5  | [2] | [3] | [4] |  5  | [6] | [7] | [8] |  5  |
    //   |   9 |     |     |     |   9 |     |     |     |   9 |
    //   +-----+-----+-----+-----+-----+-----+-----+-----+-----+
    //
    //   COL:
    //   +-----+
    //   |     |
    //   | [1] |
    //   |     |
    //   +-----+
    //   |     |
    //   | [2] |
    //   |     |
    //   +-----+
    //   |     |
    //     and so on.
    //

    // This is some very ugly string manipulation code
    //   It should be refactored to use a CellArrayFormatter
    //   and a CellFormatter; we'll get there


    if ( unit.isRow )
    {
      const cellStrings = [ 1, 2, 3 ].map( ri => {

        const sections: Array<string> = []
        const cells = unit.as_cell_array
  
        cells.forEach( cell => {
  
          if ( cell.isKnown )
          {
            sections.push( ri == 2 ? `| [${cell.cv.label}] ` : '|     ');
            return
          }
  
          const candidates = Array(9).fill(' ');
          cell.as_candidate_array.forEach( cv => {
            candidates[cv.value - 1] = cv.label;
          });
  
          switch ( ri )
          {
            case 1: sections.push( `| ${candidates.slice(0, 3).join('')} `); break;
            case 2: sections.push( `| ${candidates.slice(3, 6).join('')} `); break;
            case 3: sections.push( `| ${candidates.slice(6, 9).join('')} `);
          }
        })
  
        // console.log('sections:', sections.slice(0,3).join(''))
        return [ sections.slice(0,3).join(''), sections.slice(3,6).join(''), sections.slice(6,9).join('') ].join('')
      });

      const cells = unit.as_cell_array
      const rowString = cellStrings.join('|\n') + '|';
      const separator = '+-----'.repeat(cells.length) + '+';

      return `${separator}\n${rowString}\n${separator}`;
    }
    else
    {
      // This is JUNK but I dont't I want to fix it!
      //   I want to use the CellArrayFormatter trim feature
      const cells = unit.as_cell_array
      const separator = '+-----+';
      const colStrings: Array<string> = [];

      if ( cells[0].cname)
        colStrings.push(`   ${cells[0].cname}`)

      colStrings.push(separator)

      cells.forEach( cell => {

        if ( cell.isKnown )
        {
          colStrings.push('|     |', `| [${cell.cv.label}] | ${cell.row}`, '|     |', separator)
          return
        }

        const candidates = Array(9).fill(' ');
        cell.as_candidate_array.forEach( cv => {
          candidates[cv.value - 1] = cv.label;
        });

        [ 1, 2, 3 ].forEach( ri => {
          switch ( ri )
          {
            case 1: colStrings.push( `| ${candidates.slice(0, 3).join('')} |`); break;
            case 2: colStrings.push( `| ${candidates.slice(3, 6).join('')} | ${cell.row}`); break;
            case 3: colStrings.push( `| ${candidates.slice(6, 9).join('')} |`);
          }
        })
        colStrings.push(separator)
      });

      return colStrings.join('\n') + '\n';
    }
  }

  static BoxString( unit: iBox ): string
  {
    // GOAL: Format the unit as a BOX string
    //   It must look like the following:
    //   When the 5th cell is a known value of 5

    //      X     X     X
    //   +-----+-----+-----+
    //   | 123 | 123 | 123 |
    //   | 4 6 | 4 6 | 4 6 | Y
    //   | 789 | 789 | 789 |
    //   +-----+-----+-----+
    //   | 123 |     | 123 |
    //   | 4 6 | [5] | 4 6 | Y
    //   | 789 |     | 789 |
    //   +-----+-----+-----+
    //   | 123 | 123 | 123 |
    //   | 4 6 | 4 6 | 4 6 | Y
    //   | 789 | 789 | 789 |
    //   +-----+-----+-----+

    // Its a step in the right direction; however we're not using CellArrayFormatter

    const separator = '+-----+-----+-----+'
    const box_strings: string[] = []
    const cells: Array<CellModel> = unit.as_cell_array

    box_strings.push(cells.slice(0,3).map( cell => `   ${cell.cname}`).join('  '))
    box_strings.push(separator)

    const fmt_cells: Array<Array<CellFormatter>> = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => new CellFormatter()))

    // Apply the cell values to the formatter
    unit.as_cell_array.forEach( cell => {
      const row_idx = Math.floor((cell.row - 1) % 3)
      const col_idx = Math.floor((cell.col - 1) % 3)
      fmt_cells[row_idx][col_idx].apply( cell )
    })

    fmt_cells.map(( row, ridx ) => {
      const line_set: Array<Array<string>> = [[],[],[]]

      row.map( cell => cell.matrix.forEach(( line, idx ) => {
        line_set[idx].push( '| ', line.join('') + ' ')
      }))

      line_set.map(( line, cidx ) => {
        const box_row_label_index = ridx * 3 * cidx
        box_strings.push(line.join('') + '|' + (cidx == 1 ? ' ' + cells[box_row_label_index].row : ''))
      })

      box_strings.push(separator)
    })

    return box_strings.join('\n') + '\n'
  }

  private static formatCell( cell: CellModel ): string
  {
    return `Cell: ${cell.constructor.name}, Value: ${cell.cv.label}`
  }
}

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

    // Column labels
    // console.log( matrix[0].map( cell => cell.colLabel ).join(',') )
    // console.log( matrix[0].map( cell => cell.rowLabel ).join(',') )

    // Still not right; a work in progress!!!! recall this.trim; you have no idea what I mean by that!
    //  Now lets add the trim unused rows and columns
    //  First the rows....

    board_strings.push(matrix[0].map( cell => `   ${cell.colLabel}` ).join('  '))
    board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+') // hardcoded TRASH!

    // Convert the row of cells into three rows of strings
    //   1st row is the top of the cell
    //   2nd row is the middle of the cell
    //   3rd row is the bottom of the cell

    matrix.forEach( row => {
      // we could skip a row if it's cells are empty
      // That worked well, trimming the columns will not be so easy!
      if ( row.every( cell => cell.isEmpty() ) ) return

      const row_strings = [['| '], ['| '], ['| ']]

      row.forEach( cell => {
        const cell_matrix = cell.matrix

        for ( let ri = 0 ; ri < 3; ri++ )
        {
          row_strings[ri].push( cell_matrix[ri].join(''))
          row_strings[ri].push( ri < 3 ? ' | ' : ' |')
        }
      })

      row_strings[1].push(' ' + row[0].rowLabel)
      board_strings.push(row_strings[0].join(''))
      board_strings.push(row_strings[1].join(''))
      board_strings.push(row_strings[2].join(''))
      board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+') // hardcoded TRASH!
    })

    return board_strings.join('\n') + '\n'
  }
}

export { CellFormatter, CellArrayFormatter, UnitStringAdaptor }

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
