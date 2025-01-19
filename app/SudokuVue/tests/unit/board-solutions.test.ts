
// board-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { BoardMode, BoardModel  } from '@/js/model/BoardModel'
import { INI                    } from '@/js/util/INI'


describe('sudoku/library/solve', () => {
    test('dummy', () => expect(true).toBe(true))

    test('load_ini', async () => {
        // Use test-map-1.ini as the test input
        const ini: INI = await load_ini('test-map-1.ini')

        console.log(ini.as_object.length)

        for ( const key in ini.as_object )
        {
            if ( key == 'global' ) console.log(key)
            // const board = new BoardModel(BoardMode.SOLVE)
            // board.load_ini(ini, key)
            // expect(board.solve()).toBe(true)
        }

        // const board = new BoardModel(BoardMode.SOLVE)
        // console.log(board)
    })
})

async function load_ini(filename: string): Promise<INI>
{
    return INI.parse_file_async(`tests/unit/fixtures/${filename}`)
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
