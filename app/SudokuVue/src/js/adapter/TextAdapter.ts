
// TextAdator.ts

import type { iBoard              } from "@/js/interface/iBoard"
import type { iBox                } from "@/js/interface/iBox"
import type { iLine               } from "@/js/interface/iLine"
import type { iUnit               } from "@/js/interface/iUnit"
import type { BoardModel          } from "@/js/model/BoardModel"
import      { CellArrayFormatter  } from "@/js/adapter/UnitStringAdapter"

class TextBoardAdapter
{
  private board: iBoard

  constructor( board: iBoard )
  {
    this.board = board
  }

  public toString(): string
  {
    // Could call this.toStringState() (TBD!)
    throw this.board.constructor.name + '->toString()'
  }

  public toStringBox(): string
  {
    throw this.board.constructor.name + '->toStringBox()'
  }

  public toStringCoords(): string
  {
    // return this.board.constructor.name + '->toStringCoords()'
    const board = this.board as BoardModel

    let s = '+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'
    board.forEachRow( row => {
      row.as_cell_array.forEach( cell => s += '|' + cell.coord  )
      s += '|\n+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'
    })

    return s
  }

  public toStringNames(): string
  {
    const board = this.board as BoardModel

    let s = ''
    board.forEachRow( row => s += TextAdapter.factory(row).toStringNames() + '\n' )
    return s
  }

  public toStringState(): string
  {
    // TODO: convert to use CellArrayFormatter
    const board = this.board as BoardModel
    const cellHeight = 3;
    const board_strings: string[] = []
    let row_idx = 0

    // Column labels
    board_strings.push(board.columnNamesAsArray().map( name => `   ${name}` ).join('  '))

    board.forEachRow( row => {

        // Each cell in a row having nine possible cell values will require three lines
        //  of text to represent the cell state in a 3x3 grid.

        const row_matrix: string[][] = []

        board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+')

        // Each row in the board is made up of three lines of text values
        //  I.E. one row of cells in a 3x27 grid of cell candidate values.
        for ( let i = 0 ; i < cellHeight ; i++ )
            row_matrix.push(
                [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
                , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
                , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
                ])

        // Map cell candidate values into the row matrix
        row.as_cell_array.forEach( cell => {

            if ( cell.isKnown )
            {
                row_matrix[1][((cell.col-1) * 3 )     ] = '['
                row_matrix[1][((cell.col-1) * 3 ) + 1 ] =  cell.cv.label
                row_matrix[1][((cell.col-1) * 3 ) + 2 ] = ']'
                return
            }

            cell.as_candidate_array.forEach( cv => {
                switch ( cv.value )
                {
                    case 1: row_matrix[0][((cell.col-1) * 3 )     ] = '1'; break;
                    case 2: row_matrix[0][((cell.col-1) * 3 ) + 1 ] = '2'; break;
                    case 3: row_matrix[0][((cell.col-1) * 3 ) + 2 ] = '3'; break;
                    case 4: row_matrix[1][((cell.col-1) * 3 )     ] = '4'; break;
                    case 5: row_matrix[1][((cell.col-1) * 3 ) + 1 ] = '5'; break;
                    case 6: row_matrix[1][((cell.col-1) * 3 ) + 2 ] = '6'; break;
                    case 7: row_matrix[2][((cell.col-1) * 3 )     ] = '7'; break;
                    case 8: row_matrix[2][((cell.col-1) * 3 ) + 1 ] = '8'; break;
                    case 9: row_matrix[2][((cell.col-1) * 3 ) + 2 ] = '9'; break;
                }
            })
        })

        row_matrix.forEach( row => {
            let idx = 0
            const row_string: string[] = ['| ']

            row.forEach( value => {
                idx++
                row_string.push(value)
                if ( idx < 27 && idx % 3 == 0 ) row_string.push(' | ')
            })
            row_string.push(' |')
            board_strings.push(row_string.join(''))
        })

        board_strings[row_idx * 4 + 3] += ' ' + (++row_idx).toString()
    })

    board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+')

    return board_strings.join('\n') + '\n';
  }

  public toStringValues(): string
  {
    const board = this.board as BoardModel
    const separator = '  +-----+-----+-----+-----+-----+-----+-----+-----+-----+'
    const board_strings: string[] = []

    board_strings.push( '  ' + board.columnNamesAsArray().map( name => `   ${name}` ).join('  '))
    board_strings.push( separator )

    board.forEachRow( row => {

      let first = true
      let line = ''

      row.as_cell_array.forEach( cell => {
          line += (first ? cell.row + ' ' : '  ') + '|  ' + cell.cv.label
          first = false
      })

      board_strings.push( line + '  |' )
      board_strings.push( separator )
    })

    return board_strings.join('\n') + '\n';
  }

  public toStringValuesBasic (): string
  {
    const board = this.board as BoardModel
    let s = ''
    board.forEachRow( row => s += TextAdapter.factory(row).toStringValues() + '\n' )
    return s
  }
}

// Many of the UNIT types ( iUnit | iLine | iBox ) as strings format the same.
//  They will fallback to this class. The primary difference will be the shape
//  of the output when it matters, like in the case of a BOX, Column or Row
class TextUnitAdapter
{
  protected unit: iUnit

  constructor( unit: iUnit )
  {
    this.unit = unit
  }

  public toString () : string
  {
      let s  = ''
      this.unit.forEachCell((c) => { s += c.toString() + '\n' })
      return s
  }

  public toStringBox () : string
  {
    throw this.unit.constructor.name + '->toStringBox() // is NOT A BOX/BLOCK'
  }

  public toStringCoords () : string
  {
      const coords : Array<string> = []
      this.unit.forEachCell( c => coords.push( c.coord ))
      return coords.toString()
  }

  public toStringNames () : string
  {
      const names : Array<string> = []
      this.unit.forEachCell( c => names.push( c.name ))
      return names.toString()
  }

  public toStringState () : string
  {
    // Trim this turkey (UNIT)!
    const formatter = new CellArrayFormatter(true)
    const unit = this.unit

    unit.as_cell_array.forEach( cell => formatter.apply( cell ) )
    return formatter.toString()
    // throw this.unit.constructor.name + '->toStringState()'
  }

  public toStringValues () : string
  {
    return this.unit.as_cell_array.map( m => m.cv.label ).join(' ')
  }

  public toStringValuesBasic () : string
  {
    return this.toStringValues()
  }
}

class TextLineAdapter extends TextUnitAdapter
{
  constructor( line: iLine )
  {
    super( line as iUnit )
  }

  // TODO: When a line is a COLUMN the sting may be best formatted vertically
  //  See: work completed in UnitStringAdapter & BoadStringAdapter
  //  Otherwise, this is a fallback to the TextUnitAdapter

  // public toString(): string
  // { return this.unit.constructor.name + '->toString()' }
}


// BOX ADAPTER
class TextBoxAdapter extends TextUnitAdapter
{
  constructor( box: iBox )
  {
    super( box as iUnit )
  }

  public toStringBox(): string
  {
    const box = this.unit as iBox
    const map : string[][] = [
        [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ,   [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ];

    let x = 1
    let y = 1

    box.forEachCell( cell => {
      if ( cell.isKnown )
      {
        map[y][x-1] = '['
        map[y][x  ] = cell.cv.label
        map[y][x+1] = ']'
      }
      else
      {
        cell.as_candidate_array.forEach( I => {
          switch ( I.value )
          {
            case 1: map[y-1][x-1] = '1'; break;
            case 2: map[y-1][x  ] = '2'; break;
            case 3: map[y-1][x+1] = '3'; break;
            case 4: map[y  ][x-1] = '4'; break;
            case 5: map[y  ][x  ] = '5'; break;
            case 6: map[y  ][x+1] = '6'; break;
            case 7: map[y+1][x-1] = '7'; break;
            case 8: map[y+1][x  ] = '8'; break;
            case 9: map[y+1][x+1] = '9'; break;
          }
        })
      }

        // Next Cell alignment
        x += 3

        if ( x > 9 )
        {
          x = 1
          y += 3
        }
    })

    let s = "+-----+-----+-----+\n";

    for (y = 0; y < 9; y++)
    {
      for (x = 0; x < 9; x++)
      {
        if ( x == 0 || x == 3 || x == 6 ) s += "| ";

        s += map[y][x];

        if ( x == 2 || x == 5 ) s += " ";

        if ( x == 8 ) s += " |\n";
      }

      if ( y == 2 || y == 5 || y == 8 ) s += "+-----+-----+-----+\n";
    }

    return s;
  }

  public toStringCoords(): string
  {
    const box = this.unit as iBox
    const map : string[][] = [['  ', '  ', '  '], ['  ', '  ', '  '],  ['  ', '  ', '  ']]

    let x = 1
    let y = 1

    box.forEachCell( c => {
      map[y-1][x-1] = c.coord
      x++
      if ( x <= 3 ) return
      x = 1; y++
    })

    let s = "+-----+-----+-----+\n"

    for ( y = 0 ; y < 3 ; y++ )
    {
      for ( x = 0 ; x < 3 ; x++ )
      {
          s += '|' + map[y][x];
          if (x == 2) s += "|\n"
      }

      s += "+-----+-----+-----+\n"
    }

    return s
  }

  public toStringNames () : string
  {
    const box = this.unit as iBox
    const map : string[][] = [['  ', '  ', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']]

    let x = 1
    let y = 1

    box.forEachCell( c => {
        map[y-1][x-1] = c.name
        x ++
        if ( x <= 3 ) return
        x = 1; y++
    })

    let s = "+--+--+--+\n"

    for ( y = 0 ; y < 3 ; y++ )
    {
        for ( x = 0 ; x < 3 ; x++ )
        {
            s += '|' + map[y][x];
            if (x == 2) s += "|\n"
        }

        s += "+--+--+--+\n";
    }

    return s
  }

}


export class TextAdapter
{
  static factory( unit: iBoard | iLine | iBox | iUnit )
    : TextBoardAdapter | TextLineAdapter | TextBoxAdapter | TextUnitAdapter
  {
    const type_name   = unit.constructor.name

    switch ( type_name )
    {
      case 'TextBoardModel':
      case 'BoardModel':
        return new TextBoardAdapter( unit as iBoard )

      case 'LineModel':
        return new TextLineAdapter( unit as iLine )

      case 'TestBoxModel':
      case 'BoxModel':
        return new TextBoxAdapter( unit as iBox )

      case 'TestUnitModel':
      case 'UnitModel':
        return new TextUnitAdapter( unit as iUnit )
      default:
        throw new Error('Unknown Sudoku UNIT for TextAdapter factory - ' + unit.constructor.name )
    }
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
