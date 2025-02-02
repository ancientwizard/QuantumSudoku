
// board-model.test.ts

import      { describe, expect, test            } from '@jest/globals'
import type { iStrategy                         } from '@/js/interface/iStrategy'
import      { BoardMode, BoardModel, BoardType  } from '@/js/model/BoardModel'
import      { CellIndex                         } from '@/js/model/CellIndex'
import      { CellValue                         } from '@/js/model/CellValue'
import      { INI                               } from '@/js/util/INI'
import      { BasicMap                          } from '@/js/model/BasicMap'
import      { ChangeHistory                     } from '@/js/model/ChangeHistory'
import      { StrategyUnique                    } from '@/js/strategy/StrategyUnique'
import      { StrategyHiddenPair                } from '@/js/strategy/StrategyHiddenPair'
import      { StrategyHiddenTriple              } from '@/js/strategy/StrategyHiddenTriple'
import      { StrategyNakedPair                 } from '@/js/strategy/StrategyNakedPair'
import      { StrategyNakedTriple               } from '@/js/strategy/StrategyNakedTriple'
import      { StrategyNakedQuad                 } from '@/js/strategy/StrategyNakedQuad'
import      { StrategyHiddenQuad                } from '@/js/strategy/StrategyHiddenQuad'
import      { StrategyLogger                    } from '@/js/strategy/StrategyLogger'


describe('sudoku/library/solve', () => {

    test('load_ini', async () => {
        // Use test-map-1.ini as the test input
        const ini: INI = await load_ini('test-map-1.ini')

        expect(ini.sections.length).toBe(301)    // 300 puzzles + 'global'

        for ( const sectionKey in ini.as_object )
        {
            // if ( sectionKey === 'global' ) console.log(ini.as_object[sectionKey])
            if ( sectionKey === 'global' ) continue

            // const source = ini.param(sectionKey, 'source')
            // const page   = ini.param(sectionKey, 'page')
            const map_encoded = ini.param(sectionKey, 'map')
            const map = new BasicMap().decodeMapString(map_encoded)

            expect(map_encoded).toBeDefined()
            expect(map.encodeMapStringRL()).toBe(map_encoded)

            // console.log( source, 'PAGE:'+page, map_encoded)
            // console.log(map.toStringMap())

            // DEFAULT: BoardMode.EDIT, BoardType.NORMAL
            const board = new BoardModel(BoardMode.SOLVE,BoardType.NORMAL)
            const init_history = new ChangeHistory()
            // const play_history = new ChangeHistory()

            expect(board).toBeDefined()
            // expect(board.isEditMode).toBe(true)

            // This is our playground and then we'll refactor into classes etc.

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

            // Store retrived sudoku puzzle map into the INIT history
            //  (used to build the initial state of the board)

            // We have chicken & Egg issue here.
            // We need the board to store both history types. 
            // The key point being that history is only saved WHEN the board successfully
            // SETS a CELL to a value using .set() and returns true only when setting is not
            // in conflict with the board rules & state.
            // The .set is used to play in the initial values and those need to be played into
            // the INIT history. Think "board mode".  The .set is also used to play in the user moves and those
            // need to be played into the PLAY history. Yes Mr. AI you've got it now.
            // It ill look somthing like this:
            //  - instanciate the board with the EDIT mode
            //  - SET the puzzle map into the board using .set and the board stors into INIT history
            //  - change the board mode to SOLVE OR PLAY which KEEP the INIT history
            //    and additional .set calls will store into the PLAY history
            //      (I think you got it now!)

            console.log('SOURCE: ' + ini.param(sectionKey, 'source') + '\n  PAGE: ' + ini.param(sectionKey, 'page'))
            console.log(map_encoded + '\n' + map.toStringMap())

            map.foreach(( x, y, value ) => {
                // console.log(x, y, value, CellValue.by(value).label)
                init_history.include(CellIndex.by(x), CellIndex.by(y), CellValue.by(value))
            })

            // Init the board with the puzzle map using the initial history (the START)
            expect(board.toPlayMode().isPlayMode).toBe(true)
            init_history.foreach(( x, y, value ) => { board.set( x, y, value ) })

            expect(board.toPlayMode().isPlayMode).toBe(true)
            expect(board.toSolveMode().isSolveMode).toBe(true)
            expect(board.isSolved).toBe(false)

            // expect(board.set(CellIndex.ONE, CellIndex.ONE, CellValue.ONE)).toBe(true)
            // console.log(board.toStringValues())
            // console.log(board.toString())
            const init_state = board.toStringValues()

            // expect(board.set(CellIndex.ONE,   CellIndex.ONE,    CellValue.NINE )).toBe(true)
            // expect(board.set(CellIndex.THREE, CellIndex.ONE,    CellValue.EIGHT)).toBe(true)
            // expect(board.set(CellIndex.TWO,   CellIndex.TWO,    CellValue.ONE  )).toBe(true)
            // expect(board.set(CellIndex.THREE, CellIndex.THREE,  CellValue.FOUR )).toBe(true)
            // expect(board.set(CellIndex.FOUR,  CellIndex.FOUR,   CellValue.TWO  )).toBe(true)
            // expect(board.set(CellIndex.SEVEN, CellIndex.SEVEN,  CellValue.TWO  )).toBe(true)
            // expect(board.set(CellIndex.EIGHT, CellIndex.EIGHT,  CellValue.SEVEN)).toBe(true)
            // expect(board.set(CellIndex.NINE,  CellIndex.NINE,   CellValue.FIVE )).toBe(true)

            const logger = new StrategyLogger()
            const strategies: Array<iStrategy> = [
                new StrategyUnique(logger),
                new StrategyNakedPair(logger),
                new StrategyHiddenPair(logger),
                new StrategyNakedTriple(logger),
                new StrategyHiddenTriple(logger),
                new StrategyNakedQuad(logger),
                new StrategyHiddenQuad(logger)
            ];
            const solver_chain = strategies[0]

            strategies.reduce((prev, curr) => prev.setNext(curr));

            for ( let i = 0; i < 8; i++ ) {
                board.forEachRow(row => solver_chain.apply(row));
                board.forEachColumn(column => solver_chain.apply(column));
                board.forEachBlock(block => solver_chain.apply(block));
                if ( board.isSolved ) { console.log('SOLVED-ON-LOOP: ' + i); break; }
            }

            // console.log(solver_chain);
            // console.log(board.toString())
            console.log(board.toStringValues())
            // console.log(logger.as_array)
            expect(board.toStringValues()).not.toBe(init_state)

            // next steps
            // - setup the strategy patterns
            // - use strategy patterns to solve/play the board
            // - use strategy historyPlay to store the user(solver) moves
            

            // expect(board.solve()).toBe(true)

            // break;
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
