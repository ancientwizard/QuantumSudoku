
// board-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { BoardMode, BoardModel  } from '@/js/model/BoardModel'
import { CellIndex } from '@/js/model/CellIndex'
import { CellValue } from '@/js/model/CellValue'

describe('model/board-model', () => {

  test('board/basics+modes', () => {
    expect(BoardMode.EDIT).toBe(0)
    expect(BoardMode.PLAY).toBe(1)
    expect(BoardMode.DIAGONAL).toBe(2)
    expect(BoardMode.SOLVE).toBe(3)

    // new BoardModel(BoardModel.MODE.EDIT)
    // console.log(new BoardModel(BoardModel.MODE.EDIT))
  })

  test('board/to-string-defaults', () => {
    expect(new BoardModel(BoardMode.EDIT).toStringNames()).toBe(board_string_names())
    expect(new BoardModel(BoardMode.EDIT).toStringValues()).toBe(board_string_values())
    expect(new BoardModel(BoardMode.EDIT).toStringCoords()).toBe(board_string_coords())
    expect(new BoardModel(BoardMode.EDIT).toString()).toBe(board_string())
  })

  test('board/model/set', () => {
    const board = new BoardModel(BoardMode.SOLVE)

    expect(board.set(CellIndex.ONE, CellIndex.ONE, CellValue.ONE)).toBe(true)
    expect(board.set(CellIndex.ONE,CellIndex.ONE,CellValue.ONE)).toBe(false)
    expect(board.set(CellIndex.ONE,CellIndex.ONE,CellValue.TWO)).toBe(false)

    expect(board.set(CellIndex.TWO,CellIndex.TWO,CellValue.TWO)).toBe(true)
    expect(board.set(CellIndex.THREE,CellIndex.THREE,CellValue.THREE)).toBe(true)
    expect(board.set(CellIndex.FOUR,CellIndex.FOUR,CellValue.FOUR)).toBe(true)
    expect(board.set(CellIndex.FIVE,CellIndex.FIVE,CellValue.FIVE)).toBe(true)
    expect(board.set(CellIndex.SIX,CellIndex.SIX,CellValue.SIX)).toBe(true)
    expect(board.set(CellIndex.SEVEN,CellIndex.SEVEN,CellValue.SEVEN)).toBe(true)
    expect(board.set(CellIndex.EIGHT,CellIndex.EIGHT,CellValue.EIGHT)).toBe(true)
    expect(board.set(CellIndex.NINE,CellIndex.NINE,CellValue.NINE)).toBe(true)

    console.log(board.toString())

    CellIndex.arrayFactory.forEach( ci => {
      console.log(board.getBlock(ci).toStringBlock())
    })
  })

  // console.log(new BoardModel(BoardMode.EDIT).toStringValues())
  // console.log(new BoardModel(BoardMode.EDIT).toStringNames())
  // console.log(new BoardModel(BoardMode.EDIT).toStringCoords())
  // console.log(new BoardModel(BoardMode.EDIT).toString())

})

function board_string_names()
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

function board_string_coords()
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

function board_string_values()
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

function board_string () : string
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

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
