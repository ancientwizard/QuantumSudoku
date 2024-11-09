
// board-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { BoardMode, BoardModel  } from '@/js/model/BoardModel'

describe('model/board-model', () => {

  test('board/basics', () => {
    expect(BoardMode.EDIT).toBe(0)
    expect(BoardMode.PLAY).toBe(1)
    expect(BoardMode.DIAGONAL).toBe(2)
    expect(BoardMode.SOLVE).toBe(3)

    console.log(new BoardModel(BoardModel.MODE.EDIT))
  })

  test('dummy', () => { expect(true).toBe(true) })

})

// vim: expandtab number tabstop=2
// END
