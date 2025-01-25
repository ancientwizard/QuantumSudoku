
// board-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { BoardMode, BoardModel  } from '@/js/model/BoardModel'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { INI                    } from '@/js/util/INI'
import { BasicMap               } from '@/js/model/BasicMap'
import { ChangeHistory          } from '@/js/model/ChangeHistory'


describe('sudoku/library/solve', () => {

    test('load_ini', async () => {
        // Use test-map-1.ini as the test input
        const ini: INI = await load_ini('test-map-1.ini')

        expect(ini.sections.length).toBe(301)    // 300 puzzles + 'global'

        for ( const sectionKey in ini.as_object )
        {
            // if ( sectionKey === 'global' ) console.log(ini.as_object[sectionKey])
            if ( sectionKey === 'global' ) continue

            const source = ini.param(sectionKey, 'source')
            const page   = ini.param(sectionKey, 'page')
            const map_encoded = ini.param(sectionKey, 'map')
            const map = new BasicMap().decodeMapString(map_encoded)

            expect(map_encoded).toBeDefined()
            expect(map.encodeMapStringRL()).toBe(map_encoded)

            // console.log( source, 'PAGE:'+page, map_encoded)
            // console.log(map.toStringMap())

            const board = new BoardModel(BoardMode.EDIT)
            const historyInit = new ChangeHistory()
            const historyPlay = new ChangeHistory()

            // Behaviors to be added???
            // - A board factory to play in the saved map to create another Class I've yet to name-&-design
            //    (not a behavior to put directly in the board model)
            // - Two caches: (used in the above new class)
            //  - one for the INITAL board state (think reset() back to initial state)
            //     (the board is empty until the initial stat is loaded)
            //  - one for the USER/SOLVER moves for an UNDO
            //    (the user changes their mind and calls undo to undo their last move)
            // I'm thinking the caching should be a composition class of the board model
            //  that adds these behaviors (repete of what I stated above)

            // Store retrived sudoku puzzle map into the history
            //  (used to build the initial state of the board)
            map.foreach(( x, y, value ) => {
                historyInit.include(CellIndex.by(x), CellIndex.by(y), CellValue.by(value))
            })

            // Init the board with the puzzle map using the initial history (the START)
            historyInit.foreach(( x, y, value ) => { board.set( x, y, value ) })

            // console.log(board.toStringValues())
            // console.log(board.toString())

            // next steps
            // - setup the strategy patterns
            // - use strategy patterns to solve/play the board
            // - use strategy historyPlay to store the user(solver) moves
            

            // expect(board.solve()).toBe(true)

            break;
        }

        // const board = new BoardModel(BoardMode.SOLVE)
        // console.log(board)
    })
})

async function load_ini(filename: string): Promise<INI>
{
    return INI.parse_file_async(`tests/unit/fixtures/${filename}`)
}


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
