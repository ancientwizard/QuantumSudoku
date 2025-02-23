
// UnitStringAdaptor.ts

import type { iLine     } from '@/js/interface/iLine'
import type { iBox      } from '@/js/interface/iBox'
import type { CellModel } from '@/js/model/CellModel'

export
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

    const is_row = unit.isRow
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
          candidates[cv.value - 1] = cv.value.toString();
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

    if (is_row)
    {
      const cells = unit.as_cell_array
      const rowString = cellStrings.join('|\n') + '|';
      const separator = '+-----'.repeat(cells.length) + '+';

      return `${separator}\n${rowString}\n${separator}`;
    }
    else
    {
      const colStrings = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < unit.as_cell_array.length; j++) {
          // colStrings.push(cellStrings[j].split('|')[i + 1]);
        }
        colStrings.push('\n');
      }

      const colString = colStrings.join('|');
      const separator = '+-----+\n'.repeat(unit.as_cell_array.length);
      return `${separator}${colString}${separator}`;
    }
  }

  static BoxString( unit: iBox ): string
  {
    // GOAL: Format the unit as a BOX string
    //   It must look like the following:
    //   When the 5th cell is a known value of 5
    //   +-----+-----+-----+
    //   | 123 | 123 | 123 |
    //   | 4 6 | 4 6 | 4 6 |
    //   | 789 | 789 | 789 |
    //   +-----+-----+-----+
    //   | 123 |     | 123 |
    //   | 4 6 | [5] | 4 6 |
    //   | 789 |     | 789 |
    //   +-----+-----+-----+
    //   | 123 | 123 | 123 |
    //   | 4 6 | 4 6 | 4 6 |
    //   | 789 | 789 | 789 |
    //   +-----+-----+-----+
    //

    const separator = '+-----+-----+-----+\n'

    const cellStrings = [ 1, 2, 3 ].map( ri => {
      const sections: Array<string> = []
      const cells = unit.as_cell_array
      cells.forEach( cell => {

        if ( cell.isKnown )
        {
          sections.push( ri == 2 ? `| [${cell.cv.label}] ` : '|     ')
          return
        }
        const candidates = Array(9).fill(' ')

        cells.forEach( cv => {
          candidates[cv.value - 1] = cv.value.toString()
        })

        switch ( ri )
        {
          case 1: sections.push( `| ${candidates.slice(0, 3).join('')} ` ); break
          case 2: sections.push( `| ${candidates.slice(3, 6).join('')} ` ); break
          case 3: sections.push( `| ${candidates.slice(6, 9).join('')} ` )
        }
      })
      return sections.join('')
    })
    const rowString = cellStrings.join('|\n') + '|'
    const boxString = `${separator}${rowString}\n${separator}`
    return boxString
  }

  private static formatCell( cell: CellModel ): string
  {
    return `Cell: ${cell.constructor.name}, Value: ${cell.cv.label}`
  }

}

class CellArrayFormatter
{
  // A cell's value || candivalues are displayed witin a 3x3 text array
  private static cellDiminsion = 3

  // The matrix of cell values
  private cell_matrix: Array<Array<string>> = Array.from({ length: 27 }, () => Array(27).fill(' '))

  // constructor()  {}

  public apply( cell: CellModel ): void
  {
    if ( cell.isKnown )
    {
      const row_idx = ( cell.row - 1 ) * CellArrayFormatter.cellDiminsion
      const col_idx = ( cell.col - 1 ) * CellArrayFormatter.cellDiminsion
      const matrix = this.cell_matrix

      // Remember a cell uses three rows of text
      // This cells is known so we place that value in the middle row
      matrix[row_idx + 1][col_idx  ] = '['
      matrix[row_idx + 1][col_idx+1] = cell.cv.label
      matrix[row_idx + 1][col_idx+2] = ']'

      return
    }

    // The cell is not known so we need to apply the candidate values
    //  to the cell matrix
    const row_idx = ( cell.row - 1 ) * CellArrayFormatter.cellDiminsion
    const col_idx = ( cell.col - 1 ) * CellArrayFormatter.cellDiminsion
    const matrix = this.cell_matrix

    cell.as_candidate_array.forEach( cv => {
        switch ( cv.value )
        {
            case 1: matrix[row_idx  ][col_idx     ] = '1'; break;
            case 2: matrix[row_idx  ][col_idx + 1 ] = '2'; break;
            case 3: matrix[row_idx  ][col_idx + 2 ] = '3'; break;
            case 4: matrix[row_idx+1][col_idx     ] = '4'; break;
            case 5: matrix[row_idx+1][col_idx + 1 ] = '5'; break;
            case 6: matrix[row_idx+1][col_idx + 2 ] = '6'; break;
            case 7: matrix[row_idx+2][col_idx     ] = '7'; break;
            case 8: matrix[row_idx+2][col_idx + 1 ] = '8'; break;
            case 9: matrix[row_idx+2][col_idx + 2 ] = '9'; break;
        }
    })
  }

  public toString(): string
  {
    const board_strings: string[] = []
    const matrix = this.cell_matrix

    // Column labels
    // board_strings.push(board.columnNamesAsArray().map( name => `   ${name}` ).join('  '))

    board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n')

    let row_idx = 0

    matrix.forEach( row => {
      let idx = 0
      const row_string: string[] = ['| ']

      row.forEach( value => {
        idx++
        row_string.push(value)
        if ( idx < 27 && idx % 3 == 0 ) row_string.push(' | ')
      })
      row_string.push('|\n')
      board_strings.push(row_string.join(''))
      board_strings[row_idx * 4 + 3] += ' ' + (++row_idx).toString()
    })

    board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n')

    return board_strings.join('')
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
