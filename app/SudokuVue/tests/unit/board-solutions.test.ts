
// board-model.test.ts

import      { describe, expect, test            } from '@jest/globals'
import type { iStrategyUnit                     } from '@/js/interface/iStrategyUnit'
import type { iStrategyBoard                    } from '@/js/interface/iStrategyBoard'
import      { BoardMode, BoardType              } from '@/js/model/BoardModel'
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
import      { StrategyBoxLine                   } from '@/js/strategy/StrategyBoxLine'
import      { StrategyPointingLine              } from '@/js/strategy/StrategyPointingLine'
import      { StrategyXWing                     } from '@/js/strategy/StrategyXWing'
import      { StrategyYWing                     } from '@/js/strategy/StrategyYWing'
import      { StrategyWWing                     } from '@/js/strategy/StrategyWWing'
import      { StrategyXYChain                   } from '@/js/strategy/StrategyXYChain'
import      { StrategySwordfish                 } from '@/js/strategy/StrategySwordfish'
import      { StrategyRemotePair                } from '@/js/strategy/StrategyRemotePair'
import      { StrategySimpleColoring            } from '@/js/strategy/StrategySimpleColoring'
import      { StrategyFiftyFifty                } from '@/js/strategy/StrategyFiftyFifty'
// import      { BoardStringAdapter                } from '@/js/adapter/BoardStringAdapter'
import      { TextBoardModel as BoardModel      } from '@/js/decorator/TextBoardModel'
import      { TextAdapter                       } from '@/js/adapter/TextAdapter'

const TF = TextAdapter.factory

describe('sudoku/library/solve', () => {

    test('load_ini', async () => {
        // Use test-map-1.ini as the test input
        const ini: INI = await load_ini('test-map-1.ini')
        let solved_puzzle_count = 0
        let failed_puzzle_count = 0

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

            // DEFAULT: BoardMode.EDIT, BoardType.NORMAL
            const board = new BoardModel(BoardMode.SOLVE,BoardType.NORMAL)
            const init_history = new ChangeHistory()
            // const play_history = new ChangeHistory() // TBD

            expect(board).toBeDefined()
            expect(board.isSolveMode).toBe(true)
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

            // We need the board to store both history types. 
            // The key point being that history is only saved WHEN the board successfully
            // SETS a CELL to a value using .set() and returns true only when setting is not
            // in conflict with Sudoku board rules & state (logic).
            // The .set is used to play in the initial values I.E. those needed to be played into
            // the INIT history. Think "board mode".  The .set() is also used to play in the user moves and those
            // need to be played into the PLAY history. Yes Mr. AI you've got it now.
            // It will look somthing like this:
            //  - instanciate the board with the EDIT mode
            //  - SET the puzzle map into the board using .set and the board stores into INIT history
            //  - change the board mode to SOLVE OR PLAY which KEEP the INIT history
            //    and additional .set calls will store into the PLAY history
            //      (I think you got it now!)
            // We'll get there eventually.

            // console.log('SOURCE: ' + ini.param(sectionKey, 'source') + '\n  PAGE: ' + ini.param(sectionKey, 'page'))
            // console.log(map_encoded + '\n' + map.toStringMap())

            // Map comes from staved puzzle state. Please it into the history
            map.foreach(( x, y, value ) => {
                // console.log(x, y, value, CellValue.by(value).label)
                init_history.include(CellIndex.by(x), CellIndex.by(y), CellValue.by(value))
            })

            // Seed givens in solve mode so observer housekeeping is applied.
            expect(board.isSolveMode).toBe(true)
            init_history.foreach(( x, y, value ) => { board.set( x, y, value ) })

            expect(board.toSolveMode().isSolveMode).toBe(true)
            expect(board.isSolved).toBe(false)

            // expect(board.set(CellIndex.ONE, CellIndex.ONE, CellValue.ONE)).toBe(true)
            // console.log(TF(board).toStringValues())
            // console.log(TF(board).toStringState())
            const init_state = TF(board).toStringValues()

            // expect(board.set(CellIndex.ONE,   CellIndex.ONE,    CellValue.NINE )).toBe(true)
            // expect(board.set(CellIndex.THREE, CellIndex.ONE,    CellValue.EIGHT)).toBe(true)
            // expect(board.set(CellIndex.TWO,   CellIndex.TWO,    CellValue.ONE  )).toBe(true)
            // expect(board.set(CellIndex.THREE, CellIndex.THREE,  CellValue.FOUR )).toBe(true)
            // expect(board.set(CellIndex.FOUR,  CellIndex.FOUR,   CellValue.TWO  )).toBe(true)
            // expect(board.set(CellIndex.SEVEN, CellIndex.SEVEN,  CellValue.TWO  )).toBe(true)
            // expect(board.set(CellIndex.EIGHT, CellIndex.EIGHT,  CellValue.SEVEN)).toBe(true)
            // expect(board.set(CellIndex.NINE,  CellIndex.NINE,   CellValue.FIVE )).toBe(true)

            const logger = new StrategyLogger()
            const unit_strategies: Array<iStrategyUnit> = [
                new StrategyUnique(logger),
                new StrategyNakedPair(logger),
                new StrategyHiddenPair(logger),
                new StrategyNakedTriple(logger),
                new StrategyHiddenTriple(logger),
                new StrategyNakedQuad(logger),
                new StrategyHiddenQuad(logger)
            ];
            const unit_solver_chain = unit_strategies[0]

            const ywing_logger = new StrategyLogger()
            const wwing_logger = new StrategyLogger()
            const xychain_logger = new StrategyLogger()
            const xwing_logger = new StrategyLogger()
            const swordfish_logger = new StrategyLogger()
            const coloring_logger = new StrategyLogger()
            const remote_pair_logger = new StrategyLogger()
            const board_strategies: Array<iStrategyBoard> = [
                new StrategyBoxLine(logger),
                new StrategyPointingLine(logger),
                new StrategyYWing(ywing_logger),
                new StrategyWWing(wwing_logger),
                new StrategyXYChain(xychain_logger),
                new StrategySimpleColoring(coloring_logger),
                new StrategyRemotePair(remote_pair_logger),
                new StrategyXWing(xwing_logger),
                new StrategySwordfish(swordfish_logger),
              ]
            const board_solver_chain = board_strategies[0]

            unit_strategies.reduce((prev, curr) => prev.setNext(curr));
            board_strategies.reduce((prev, curr) => prev.setNext(curr));
            let attempts = 0

            for ( ; attempts < 50; attempts++ )
            {
                let changed = false

                // Apply UNIT based strategies
                board.forEachRow(   row => changed ||= unit_solver_chain.apply(row));
                board.forEachCol(column => changed ||= unit_solver_chain.apply(column));
                board.forEachBox( block => changed ||= unit_solver_chain.apply(block));

                // Apply BOARD based strategies
                changed ||= board_solver_chain.apply(board)

                let broken = false
                board.forEachRow( row => {
                  broken ||= row.isBroken
                })

                if ( broken )
                {
                  failed_puzzle_count++
                  break
                }

                if ( board.isSolved )
                {
                  // console.log('SOLVED-ON-LOOP: ' + i)
                  solved_puzzle_count++
                  break
                }

                if ( !changed ) break
            }

            expect(TF(board).toStringValuesBasic()).not.toBe(init_state)

            // ywing_logger.as_array.length && console.log('Y-WING\n', ywing_logger.as_array )
            // xwing_logger.as_array.length && console.log('X-WING\n', xwing_logger.as_array )

            // eslint-disable-next-line no-constant-condition
            if ( ! board.isSolved ) //&& false )
            {
                const fifty_logger   = new StrategyLogger()
                const fifty_strategy = new StrategyFiftyFifty(fifty_logger)
                for ( let fallback_attempts = 0 ; fallback_attempts < 8 && !board.isSolved ; fallback_attempts++ )
                {
                  if ( !fifty_strategy.apply(board) ) break
                }

                if ( board.isSolved ) solved_puzzle_count++
            }

            if ( ! board.isSolved )
            {
              // attempts > 20 &&
              console.log('   SOURCE:', source, '\n     PAGE:', page, '\n ATTEMPTS:', attempts, '\n\n', TF(board).toStringState())

              // eslint-disable-next-line no-constant-condition
              if ( page == '156' && false)
              {
                // board.set(CellIndex.FIVE, CellIndex.ONE, CellValue.EIGHT)
                // board.set(CellIndex.FIVE, CellIndex.SIX, CellValue.THREE)

                // board.set(CellIndex.FIVE, CellIndex.ONE, CellValue.FIVE)
                // board.set(CellIndex.FIVE, CellIndex.SIX, CellValue.SEVEN)

                // const fifty_logger   = new StrategyLogger()
                // const fifty_strategy = new StrategyFiftyFifty(fifty_logger)
                // fifty_strategy.apply(board)
                // console.log('FIFTY-FIFTY STRATEGY:\n', fifty_logger.as_array)
                console.log(TF(board).toStringState())
              }
            }

            // Next Steps
            // - use strategy historyPlay to store the user(solver) moves

            // expect(board.solve()).toBe(true)

            // break;
        }

        console.log('SOLVED PUZZLE COUNT: ' + solved_puzzle_count
                , '\nFAILED PUZZLE COUNT: ' + failed_puzzle_count)
        // expect(solved_puzzle_count).toBe(300)
        expect(failed_puzzle_count).toBe(0)

        // const board = new BoardModel(BoardMode.SOLVE)
        // console.log(board)
    })
})

async function load_ini(filename: string): Promise<INI>
{
    return INI.parse_file_async(`tests/unit/fixtures/${filename}`)
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
