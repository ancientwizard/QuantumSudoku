
// sudoku-text.test.ts

import { describe, expect, test } from '@jest/globals'
import { BoardModel             } from '@/js/model/BoardModel'
import { TextAdapter            } from '@/js/adapter/TextAdapter'
import { TextBoardModel         } from '@/js/decorator/TextBoardModel'

const TF = TextAdapter.factory

// BOARD ADAPTOR
describe( 'TextAdapter/board', () =>
{
  const adapter = TF( new BoardModel() )

  test( 'default/toString()',             () => expect(() => adapter.toString() ).toThrow( 'BoardModel->toString()' ))
  test( 'default/toStringBox()',          () => expect(() => adapter.toStringBox() ).toThrow( 'BoardModel->toStringBox()' ))
  test( 'default/toStringCoords()',       () => expect( adapter.toStringCoords() ).toBe( board_coords_str() ))
  test( 'default/toStringNames()',        () => expect( adapter.toStringNames() ).toBe( board_names_str() ))
  test( 'default/toStringState()',        () => expect( adapter.toStringState() ).toBe( board_state_str() ))
  test( 'default/toStringValues()',       () => expect( adapter.toStringValues() ).toBe( board_values_str() ))
  test( 'default/toStringValuesBasic()',  () => expect( adapter.toStringValuesBasic() ).toBe( board_values_basic_str() ))
})

// TEXT-BOARD-DECORATOR
describe( 'default/TextBoardModel.text', () =>
{
  const board = new TextBoardModel()

  test( 'default/toString()',             () => expect(() => board.toString() ).toThrow( 'TextBoardModel->toString()' ))
  test( 'default/toStringBox()',          () => expect(() => board.toStringBox() ).toThrow( 'TextBoardModel->toStringBox()' ))
  test( 'default/toStringCoords()',       () => expect( board.toStringCoords() ).toBe( board_coords_str() ))
  test( 'default/toStringNames()',        () => expect( board.toStringNames() ).toBe( board_names_str() ))
  test( 'default/toStringState()',        () => expect( board.toStringState() ).toBe( board_state_str() ))
  test( 'default/toStringValues()',       () => expect( board.toStringValues() ).toBe( board_values_str() ))
  test( 'default/toStringValuesBasic()',  () => expect( board.toStringValuesBasic() ).toBe( board_values_basic_str() ))
})


describe( 'TextAdapter/row', () =>
{
  const board = new BoardModel()

  board.forEachRow( ( row, i ) =>
  {
    const adapter = TF( row )

    test( `row[${i}]/isRow()`,                () => expect( row.isRow ).toBe( true ))
    test( `row[${i}]/toString()`,             () => expect(() => adapter.toString() ).toThrow( 'Use a Text Decorator!' ))
    test( `row[${i}]/toStringBox()`,          () => expect(() => adapter.toStringBox() ).toThrow( 'LineModel->toStringBox()' ))
    test( `row[${i}]/toStringCoords()`,       () => expect( adapter.toStringCoords() ).toMatch( /^[()0-9,]{53}$/ ))
    test( `row[${i}]/toStringState()`,        () => expect( adapter.toStringState() ).toBe( unit_row_str( i )))
    test( `row[${i}]/toStringNames()`,        () => expect( adapter.toStringNames() ).toMatch( /^A[0-9],B[0-9],C[0-9],D[0-9],E[0-9],F[0-9],G[0-9],H[0-9],I[0-9]$/ ))
    test( `row[${i}]/toStringValues()`,       () => expect( adapter.toStringValues() ).toBe( '? ? ? ? ? ? ? ? ?' ))
    test( `row[${i}]/toStringValuesBasic()`,  () => expect( adapter.toStringValuesBasic() ).toBe( '? ? ? ? ? ? ? ? ?' ))
  })
})

describe( 'TextAdapter/col', () =>
{
  const board = new BoardModel()

  board.forEachCol( ( col, i ) =>
  {
    const adapter = TF( col )

    test( `col[${i}]/isCol()`,                () => expect( col.isCol ).toBe( true ))
    test( `col[${i}]/toString()`,             () => expect(() => adapter.toString() ).toThrow( 'Use a Text Decorator!' ))
    test( `col[${i}]/toStringBox()`,          () => expect(() => adapter.toStringBox() ).toThrow( 'LineModel->toStringBox()' ))
    test( `col[${i}]/toStringCoords()`,       () => expect( adapter.toStringCoords() ).toMatch( /^[()0-9,]{53}$/ ))
    test( `col[${i}]/toStringState()`,        () => expect( adapter.toStringState() ).toBe( unit_col_str( i )))
    // console.log( adapter.toStringState() )
    test( `col[${i}]/toStringNames()`,        () => expect( adapter.toStringNames() ).toMatch( /^[A-I]1,[A-I]2,[A-I]3,[A-I]4,[A-I]5,[A-I]6,[A-I]7,[A-I]8,[A-I]9$/ ))
    test( `col[${i}]/toStringValues()`,       () => expect( adapter.toStringValues() ).toBe( '? ? ? ? ? ? ? ? ?' ))
    test( `col[${i}]/toStringValuesBasic()`,  () => expect( adapter.toStringValuesBasic() ).toBe( '? ? ? ? ? ? ? ? ?' ))
  })
})


function board_coords_str()
{
  return `+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,1)|(2,1)|(3,1)|(4,1)|(5,1)|(6,1)|(7,1)|(8,1)|(9,1)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,2)|(2,2)|(3,2)|(4,2)|(5,2)|(6,2)|(7,2)|(8,2)|(9,2)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,3)|(2,3)|(3,3)|(4,3)|(5,3)|(6,3)|(7,3)|(8,3)|(9,3)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,4)|(2,4)|(3,4)|(4,4)|(5,4)|(6,4)|(7,4)|(8,4)|(9,4)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,5)|(2,5)|(3,5)|(4,5)|(5,5)|(6,5)|(7,5)|(8,5)|(9,5)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,6)|(2,6)|(3,6)|(4,6)|(5,6)|(6,6)|(7,6)|(8,6)|(9,6)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,7)|(2,7)|(3,7)|(4,7)|(5,7)|(6,7)|(7,7)|(8,7)|(9,7)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,8)|(2,8)|(3,8)|(4,8)|(5,8)|(6,8)|(7,8)|(8,8)|(9,8)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
|(1,9)|(2,9)|(3,9)|(4,9)|(5,9)|(6,9)|(7,9)|(8,9)|(9,9)|
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
`
}

function board_names_str()
{
  return `A1,B1,C1,D1,E1,F1,G1,H1,I1
A2,B2,C2,D2,E2,F2,G2,H2,I2
A3,B3,C3,D3,E3,F3,G3,H3,I3
A4,B4,C4,D4,E4,F4,G4,H4,I4
A5,B5,C5,D5,E5,F5,G5,H5,I5
A6,B6,C6,D6,E6,F6,G6,H6,I6
A7,B7,C7,D7,E7,F7,G7,H7,I7
A8,B8,C8,D8,E8,F8,G8,H8,I8
A9,B9,C9,D9,E9,F9,G9,H9,I9
`
}

function board_values_basic_str()
{
  return `? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
? ? ? ? ? ? ? ? ?
`
}

function board_values_str () : string
{
  return`     A     B     C     D     E     F     G     H     I
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
1 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
2 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
3 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
4 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
5 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
6 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
7 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
8 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
9 |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |  ?  |
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
`
}

function board_state_str () : string
{
  return `   A     B     C     D     E     F     G     H     I
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 1
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 2
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 3
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 4
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 5
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 6
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 7
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 8
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 9
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
`
}

function unit_row_str( i: number ): string
{
  return `   A     B     C     D     E     F     G     H     I
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 | 123 |
| 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | 456 | ${i+1}
| 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 | 789 |
+-----+-----+-----+-----+-----+-----+-----+-----+-----+
`
}

function unit_col_str( i: number ): string
{
  const labels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ]
  return `   ${labels[i]}
+-----+
| 123 |
| 456 | 1
| 789 |
+-----+
| 123 |
| 456 | 2
| 789 |
+-----+
| 123 |
| 456 | 3
| 789 |
+-----+
| 123 |
| 456 | 4
| 789 |
+-----+
| 123 |
| 456 | 5
| 789 |
+-----+
| 123 |
| 456 | 6
| 789 |
+-----+
| 123 |
| 456 | 7
| 789 |
+-----+
| 123 |
| 456 | 8
| 789 |
+-----+
| 123 |
| 456 | 9
| 789 |
+-----+
`
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
