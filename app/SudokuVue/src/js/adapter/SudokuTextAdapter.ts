
// SudokuTextAdator.ts

import type { iBoard        } from "@/js/interface/iBoard"
import type { iBox          } from "@/js/interface/iBox"
import type { iLine         } from "@/js/interface/iLine"
import type { iUnit         } from "@/js/interface/iUnit"

class TextBoardAdapter
{
  private board: iBoard
  constructor( board: iBoard )
  {
    this.board = board
  }

  public toString(): string
  { return this.board.constructor.name + '->toString()' }

  public toStringBlock(): string
  { return this.board.constructor.name + '->toStringBlock()' }

  public toStringCoords(): string
  { return this.board.constructor.name + '->toStringCoords()' }

  public toStringNames(): string
  { return this.board.constructor.name + '->toStringNames()' }

  public toStringValues(): string
  { return this.board.constructor.name + '->toStringValues()' }
}

class TextUnitAdapter
{
  protected unit: iUnit

  constructor( unit: iUnit )
  {
    this.unit = unit
  }

  public toString () : string
  {
      let s  = ""

      this.unit.forEachCell((c) => { s += c.toString2() + "\n" })

      return s
  }

  public toStringBlock () : string
  {
    return this.unit.constructor.name + '->toStringBlock() // is NOT A BLOCK'
  }

  public toStringNames () : string
  {
      const names : Array<string> = []
      this.unit.forEachCell( c => names.push( c.name ))
      return names.toString()
  }

  public toStringCoords () : string
  {
      const coords : Array<string> = []
      this.unit.forEachCell( c => coords.push( c.coord ))
      return coords.toString()
  }

  public toStringValues () : string
  {
    return this.unit.as_cell_array.map( m => m.cv.label ).join(' ')
  }
}

class TextLineAdapter extends TextUnitAdapter
{
  constructor( line: iLine )
  {
    super( line as iUnit )
  }

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

  public toStringBlock(): string
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
    const map : string[][] = [
      ['  ', '  ', '  '],
      ['  ', '  ', '  '],
      ['  ', '  ', '  ']
    ]

    let x = 1
    let y = 1

    box.forEachCell( c => {
      map[y-1][x-1] = c.coord

      x += 1

      if (x > 3)
      {
          x = 1
          y += 1
      }
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
    const map : string[][] = [
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  ']
    ]

    let x = 1
    let y = 1

    box.forEachCell( c => {
        map[y-1][x-1] = c.name

        x += 1

        if (x > 3)
        {
            x = 1
            y += 1
        }
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



export class SudokuTextAdapter
{
  static factory( unit: iBoard | iLine | iBox | iUnit )
    : TextBoardAdapter | TextLineAdapter | TextBoxAdapter | TextUnitAdapter
  {
    switch ( unit.constructor.name )
    {
      case 'BoardModel':
        return new TextBoardAdapter( unit as iBoard )
      case 'LineModel':
        return new TextLineAdapter( unit as iLine )
      case 'BoxModel':
        return new TextBoxAdapter( unit as iBox )
      case 'UnitModel':
        return new TextUnitAdapter( unit as iUnit )
      default:
        throw new Error('Unknown Sudoku UNIT for SudokuTextAdapter factory')
    }
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
