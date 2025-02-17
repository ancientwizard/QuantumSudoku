
// strategy-x-wing.test.ts

import { describe, expect, test, beforeEach } from '@jest/globals'

import { BoardModel, BoardMode  } from '@/js/model/BoardModel'
import { BoardStringAdapter     } from '@/js/adapter/BoardStringAdapter'

import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'

import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyXWing          } from '@/js/strategy/StrategyXWing'
import { BasicMap } from '@/js/model/BasicMap'


function template_to_string( template: number[][] ): string
{
    return template.map( (row) => {
        return row.map( (cv,idx) => { return ( cv == 0 ? '?' : cv ) + (idx<8?' ':'')}).join('')
    }).join("\n") + '\n'
}

describe('strategy/x-wing', () => {
    let board : BoardModel

    beforeEach(() => { board = new BoardModel(BoardMode.SOLVE) })

    test('x-wing/detect-X-pairs', () => {

        // Using this as a template:
        const ci_set = CellIndex.arrayFactory
        const cv_set = CellValue.arrayFactory
        const template = [
            [ 0, 0, 3, 8, 0, 0, 5, 1, 0 ],
            [ 0, 0, 8, 7, 0, 0, 9, 3, 0 ],
            [ 1, 0, 0, 3, 0, 5, 7, 2, 8 ],
            [ 0, 0, 0, 2, 0, 0, 8, 4, 9 ],
            [ 8, 0, 1, 9, 0, 6, 2, 5, 7 ],
            [ 0, 0, 0, 5, 0, 0, 1, 6, 3 ],
            [ 9, 6, 4, 1, 2, 7, 3, 8, 5 ],
            [ 3, 8, 2, 6, 5, 9, 4, 7, 1 ],
            [ 0, 1, 0, 4, 0, 0, 6, 9, 2 ]
        ]

        template.forEach( (row,Yidx) => {
            row.forEach( (cv,Xidx) => {
                if ( cv === 0 ) return
                board.set(ci_set[Xidx], ci_set[Yidx], cv_set[cv-1])
            })
        })

        // Proof our board is set up correctly
        expect(board.toStringValues()).toBe(template_to_string(template))

        // console.log(template_to_string(template))
        // console.log(board.toStringValues())

        {
          const logger = new StrategyLogger()
          const xwing = new StrategyXWing(logger)
          // const basicmap = new BasicMap(template)

          // console.log(basicmap.toStringMap())

          xwing.applyStrategy(board)
          console.log(logger)
          // console.log(BoardStringAdapter.toString(board))
        }

        // Lets play with COL based X-Wing detection by using BasicMap to rotate the template
        //  to seed a board for X-Wing detection

        {
          const logger = new StrategyLogger()
          const xwing = new StrategyXWing(logger)
          const board2 = new BoardModel(BoardMode.SOLVE)
          const basicmap = new BasicMap(template)

          // console.log(basicmap.rotate().toStringMap())

          basicmap.rotate().get_map().forEach( (row,Yidx) => {
              row.forEach(( cv, Xidx ) => {
                  if ( ! cv || cv === 0 ) return
                  board2.set(ci_set[Xidx], ci_set[Yidx], cv_set[cv-1])
              })
          })

          xwing.applyStrategy(board2)
          console.log(logger)
          // console.log(BoardStringAdapter.toString(board2))
        }
      })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
