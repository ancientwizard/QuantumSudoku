
// strategy-y-wing.test.ts

import { describe, expect, test, beforeEach } from '@jest/globals'

import { BoardModel, BoardMode  } from '@/js/model/BoardModel'
import { BoardStringAdapter     } from '@/js/adapter/BoardStringAdapter'
import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyYWing          } from '@/js/strategy/StrategyYWing'
// import { StrategyYWing          } from '@/js/strategy/StrategyYWing-II'
// import { StrategyYWing          } from '@/js/strategy/StrategyYWing-III'
// import { StrategyYWing          } from '@/js/strategy/StrategyYWing-IIII'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'


describe('strategy/y-wing', () => {
  let board : BoardModel

  beforeEach(() => { board = new BoardModel(BoardMode.SOLVE) })

  test('y-wing/detect-Y-pairs', () => {

    // Apply Sudoku board Y-Wing detection template
    const ywing_template = apply_template(board)

    // Proof our board is set up correctly
    expect(board.toStringValues()).toBe(template_to_string(ywing_template))

    // console.log(template_to_string(template))
    // console.log(board.toStringValues())
    console.log(BoardStringAdapter.toString(board))

    {
      const logger = new StrategyLogger()
      const ywing  = new StrategyYWing(logger)

      console.log('APPLY-Y-WING:',ywing.apply(board))
      console.log('APPLY-Y-WING:',ywing.apply(board))

      console.log(logger)
      // console.log(BoardStringAdapter.toString(board))

      console.log('SOLVED:',board.isSolved);
      // expect(logger.as_array.length).toBe(9)
      // expect(logger.as_array[0]).toBe('# (Y-Wing[ROW(detect)-COL(exclude)]): 3 (VALUE)')
      // expect(logger.as_array[1]).toBe('#  Include: COLS:[ 2, 5 ] => [ B3, B5, E3, E5 ]')
      // expect(logger.as_array[2]).toBe('#  Exclude: COLS:[ 2, 5 ] => [ B1, B2, B6, E1, E2, E6 ]')
      // expect(logger.as_array[3]).toBe('Y-Wing: B1.exclude(3) true')
      // expect(logger.as_array[4]).toBe('Y-Wing: B2.exclude(3) true')
      // expect(logger.as_array[5]).toBe('Y-Wing: B6.exclude(3) true')
      // expect(logger.as_array[6]).toBe('Y-Wing: E1.exclude(3) true')
      // expect(logger.as_array[7]).toBe('Y-Wing: E2.exclude(3) true')
      // expect(logger.as_array[8]).toBe('Y-Wing: E6.exclude(3) true')
    }
  })
})

// Helper functions
function template_to_string( template: number[][] ): string
{
    return template.map( row => {
      return row.map(( cv, idx ) => { return ( cv == 0 ? '?' : cv ) + (idx<8?' ':'')}).join('')
    }).join("\n") + '\n'
}

function apply_template( board: BoardModel, template: number[][] = get_template() ) : number[][]
{
  const ci_set = CellIndex.arrayFactory
  const cv_set = CellValue.arrayFactory

  template.forEach((row, Yidx) => {
    row.forEach((cv, Xidx) => {
      if (cv === 0)
        return
      board.set(ci_set[Xidx], ci_set[Yidx], cv_set[cv - 1])
    })
  })

  return template
}

// A Sudoku board Y-Wing detection template:
function get_template(): number[][]
{
  return [
    [1, 0, 0, 2, 4, 0, 0, 0, 0],
    [0, 5, 0, 6, 1, 0, 2, 3, 9],
    [0, 2, 0, 0, 5, 0, 0, 1, 0],
    [0, 1, 0, 7, 0, 0, 3, 2, 0],
    [0, 0, 2, 1, 3, 5, 6, 0, 7],
    [0, 7, 0, 0, 0, 2, 1, 0, 0],
    [0, 6, 1, 0, 2, 0, 0, 7, 3],
    [5, 9, 0, 0, 7, 1, 0, 6, 2],
    [2, 0, 7, 0, 8, 6, 0, 0, 1]
  ]
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
