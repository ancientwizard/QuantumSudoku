
// strategy-x-wing.test.ts

import { describe, expect, test, beforeEach } from '@jest/globals'

import { BoardModel, BoardMode  } from '@/js/model/BoardModel'
import { BoardStringAdapter     } from '@/js/adapter/BoardStringAdapter'

import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'

import { StrategyLogger         } from '@/js/strategy/StrategyLogger'
import { StrategyXWing          } from '@/js/strategy/StrategyXWing'


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

        // X-Wing pairs are two rows and two columns
        //  where the same value appears in the same cells
        //  in each row and column.
        //  The cells are not necessarily the same cells.
        //  The cells must be in the same row or column.

        // PLAN: for each candidate value we'll need to
        //   NOTICE: to keep the description simpler we'll only describe
        //       using rows to find the X-Wings. However applying the
        //       same logic to columns the same in that columns make up
        //       the X-Wing and additonal colums are the targes for removal

        // 1. Tack two sets of rows
        // 2. SET-A; are TWO rows that make up the X-wing
        //    and SIX rows that are not part of the X-wing; this is
        //    importent because we need to remove the candidate values
        //    that make up the X-WIng from the non-X-wing rows.

        const logger = new StrategyLogger()
        const xwing = new StrategyXWing(logger)

        xwing.applyStrategy(board)

        console.log(BoardStringAdapter.toString(board))

        // console.log('board\n', board.toString(), '\n' + board.toStringValues())
        // board.forEachRow( (row) => { console.log('row\n', row.toString()) })

        // const xwing = board.detectXWing()

        // expect(xwing).toBeTruthy()
    })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
