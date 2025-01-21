
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

            console.log( source, 'PAGE:'+page, map_encoded)
            console.log(map.toStringMap())

            const board = new BoardModel(BoardMode.EDIT)
            const history = new ChangeHistory()
            // const cindex = CellIndex.arrayFactory
            // const cvalue = CellValue.arrayFactory
            // const map_ary = map.get_map()

            // Behaviors to be added???
            // - A board factory to play in the saved map
            // - Two caches:
            //  - one for the INITAL board state (think reset() back to initial state)
            //     (the board is empty until the initial stat is loaded)
            //  - one for the USER/SOLVER moves for an UNDO
            //    (the user changes their mind and calls undo to undo their last move)
            // I'm thinking the caching should be a composition class of the board model
            //  that adds these behaviors

            map.foreach(( x, y, value ) => {
                history.include(CellIndex.by(x), CellIndex.by(y), CellValue.by(value))
            })

            history.foreach(( x, y, value ) => { board.set( x, y, value ) })

            // console.log(board.toStringValues())
            console.log(board.toString())
            // console.log(board.toStringCoords())
            // console.log(board.toStringNames())
            // console.log(cindex[1])

            // board.load_ini(ini, key)
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
