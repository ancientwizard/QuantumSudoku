
// strategy-x-wing.test.ts

import { describe, expect, test, beforeEach } from '@jest/globals'

import { BoardModel, BoardMode  } from '@/js/model/BoardModel'
// import { BoardStringAdapter     } from '@/js/adapter/BoardStringAdapter'

import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'

import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyXWing          } from '@/js/strategy/StrategyXWing'
import { BasicMap               } from '@/js/model/BasicMap'


describe('strategy/x-wing', () => {
  let board : BoardModel

  beforeEach(() => { board = new BoardModel(BoardMode.SOLVE) })

  test('x-wing/detect-X-pairs', () => {

    // Apply Sudoku board X-Wing detection template
    const xwing_template = apply_template(board)

    // Proof our board is set up correctly
    expect(board.toStringValues()).toBe(template_to_string(xwing_template))

    // console.log(template_to_string(template))
    // console.log(board.toStringValues())

    {
      const logger = new StrategyLogger()
      const xwing = new StrategyXWing(logger)

      // const basicmap = new BasicMap(xwing_template)
      // console.log(basicmap.toStringMap())

      xwing.apply(board)

      // console.log(logger)
      expect(logger.as_array.length).toBe(9)
      expect(logger.as_array[0]).toBe('# (X-Wing[ROW(detect)-COL(exclude)]): 4 (VALUE)')
      expect(logger.as_array[1]).toBe('#  Include: COLS:[ 2, 5 ] => [ B3, B5, E3, E5 ]')
      expect(logger.as_array[2]).toBe('#  Exclude: COLS:[ 2, 5 ] => [ B1, B2, B6, E1, E2, E6 ]')
      expect(logger.as_array[3]).toBe('X-Wing: B1.exclude(4) true')
      expect(logger.as_array[4]).toBe('X-Wing: B2.exclude(4) true')
      expect(logger.as_array[5]).toBe('X-Wing: B6.exclude(4) true')
      expect(logger.as_array[6]).toBe('X-Wing: E1.exclude(4) true')
      expect(logger.as_array[7]).toBe('X-Wing: E2.exclude(4) true')
      expect(logger.as_array[8]).toBe('X-Wing: E6.exclude(4) true')

      // console.log(BoardStringAdapter.toString(board))
    }

    // Lets play with COL based X-Wing detection by using BasicMap to rotate the template
    //  to seed a board for X-Wing detection

    {
      const logger = new StrategyLogger()
      const xwing = new StrategyXWing(logger)
      const board2 = new BoardModel(BoardMode.SOLVE)
      const basicmap = new BasicMap(xwing_template)

      // console.log(basicmap.rotate().toStringMap())

      // Apply Sudoku board X-Wing detection template
      apply_template( board2, basicmap.rotate().get_map_with_zeros())

      // xwing.setNext(new StrategyXWing(logger))
      xwing.apply(board2)

      // console.log(logger)
      expect(logger.as_array.length).toBe(9)
      expect(logger.as_array[0]).toBe('# (X-Wing[COL(detect)-ROW(exclude)]): 4 (VALUE)')
      expect(logger.as_array[1]).toBe('#  Include: ROWS:[ 2, 5 ] => [ E2, E5, G2, G5 ]')
      expect(logger.as_array[2]).toBe('#  Exclude: ROWS:[ 2, 5 ] => [ D2, D5, H2, H5, I2, I5 ]')
      expect(logger.as_array[3]).toBe('X-Wing: D2.exclude(4) true')
      expect(logger.as_array[4]).toBe('X-Wing: H2.exclude(4) true')
      expect(logger.as_array[5]).toBe('X-Wing: I2.exclude(4) true')
      expect(logger.as_array[6]).toBe('X-Wing: D5.exclude(4) true')
      expect(logger.as_array[7]).toBe('X-Wing: H5.exclude(4) true')
      expect(logger.as_array[8]).toBe('X-Wing: I5.exclude(4) true')

      // console.log(BoardStringAdapter.toString(board2))
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

// A Sudoku board X-Wing detection template:
function get_template(): number[][]
{
  return [
    [0, 0, 3, 8, 0, 0, 5, 1, 0],
    [0, 0, 8, 7, 0, 0, 9, 3, 0],
    [1, 0, 0, 3, 0, 5, 7, 2, 8],
    [0, 0, 0, 2, 0, 0, 8, 4, 9],
    [8, 0, 1, 9, 0, 6, 2, 5, 7],
    [0, 0, 0, 5, 0, 0, 1, 6, 3],
    [9, 6, 4, 1, 2, 7, 3, 8, 5],
    [3, 8, 2, 6, 5, 9, 4, 7, 1],
    [0, 1, 0, 4, 0, 0, 6, 9, 2]
  ]
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
