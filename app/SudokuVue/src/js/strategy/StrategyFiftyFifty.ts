//
//  This isn't an actual acclamed strategy, documeneted on the Internet or in Books etc.
//   However it models a natural behavior of many Sudoku puzzle players, including myself.
//   While I consider myself rather smart with an IQ north of 150 it's simpler to see the
//   puzzles current state as 50/50 proposition.
//
//  Not all of us are of geniuns mental capacity and some of the most complicated strategies
//   require several levels of thought and logic to "see" the solution. When in this state,
//   I often observe several long chaings of cells that are either of one of two possible
//   values. Simply choosing one will result in a failed solution, while to ther will lead
//   to a solution. This is the "fifty-fifty" strategy.
//

// StrategyFiftyFifty.ts

// import type { CellValue         } from '@/js/model/CellValue'
import type { iStrategyUnit         } from '@/js/interface/iStrategyUnit'
import type { iStrategyBoard        } from '@/js/interface/iStrategyBoard'
import type { iBoard                } from '@/js/interface/iBoard'
import type { CellModel             } from '@/js/model/CellModel'
import      { BoardModel            } from '@/js/model/BoardModel'
import      { CellIndex             } from '@/js/model/CellIndex'
import      { CellValue             } from '@/js/model/CellValue'
import      { aStrategyBoard        } from '@/js/abstract/aStrategyBoard'
import      { StrategyUnique        } from '@/js/strategy/StrategyUnique'
import      { StrategyHiddenPair    } from '@/js/strategy/StrategyHiddenPair'
import      { StrategyHiddenTriple  } from '@/js/strategy/StrategyHiddenTriple'
import      { StrategyNakedPair     } from '@/js/strategy/StrategyNakedPair'
import      { StrategyNakedTriple   } from '@/js/strategy/StrategyNakedTriple'
import      { StrategyNakedQuad     } from '@/js/strategy/StrategyNakedQuad'
import      { StrategyHiddenQuad    } from '@/js/strategy/StrategyHiddenQuad'
import      { StrategyBoxLine       } from '@/js/strategy/StrategyBoxLine'
import      { StrategyPointingLine  } from '@/js/strategy/StrategyPointingLine'
import      { StrategyYWing         } from '@/js/strategy/StrategyYWing'
import      { StrategyWWing         } from '@/js/strategy/StrategyWWing'
import      { StrategyXYChain       } from '@/js/strategy/StrategyXYChain'
import      { StrategyXWing         } from '@/js/strategy/StrategyXWing'
import      { StrategySwordfish     } from '@/js/strategy/StrategySwordfish'
import      { StrategyLogger        } from '@/js/strategy/StrategyLogger'

export
class StrategyFiftyFifty extends aStrategyBoard
{
    protected applyStrategy ( board: iBoard ) : boolean
    {
        return this.strategy_set_fifty_fifty(board)
    }

    // A Level 3 Strategy
    //  Fifty-Fifty: Cells having two canidate values allowing us to try before we buy
    //    a guess if you weill.
    private strategy_set_fifty_fifty ( board : iBoard ) : boolean
    {
        const pivots = this.pickPivotCells(board)

        type TryResult = { candidate: CellValue, solved: boolean, broken: boolean, board: BoardModel }

        for ( const pivot of pivots )
        {
          const candidates = pivot.as_candidate_array
          if ( candidates.length !== 2 ) continue

          this.logger?.add('# (Fifty-Fifty) Pivot: ' + pivot.name + ' candidates: ' + candidates.map(v => v.label).join(', '))

          const results: Array<TryResult> = []

          for ( const candidate of candidates )
          {
            const scratch = this.cloneBoard(board)

            if ( !scratch.set(CellIndex.by(pivot.col - 1), CellIndex.by(pivot.row - 1), candidate) )
            {
              results.push({ candidate, solved: false, broken: true, board: scratch })
              continue
            }

            this.runDeterministicSolve(scratch)

            results.push({
                candidate,
                solved: scratch.isSolved,
                broken: this.isBroken(scratch),
                board: scratch
            })
          }

          const solvedBranch = results.find(result => result.solved)
          if ( solvedBranch )
          {
            const changed = this.applyKnownFromBoard(board, solvedBranch.board)
            this.logger?.add('# (Fifty-Fifty) Solved branch chosen: ' + solvedBranch.candidate.label + ' at ' + pivot.name)
            if ( changed ) return true
          }

          const brokenBranch = results.find(result => result.broken)
          if ( brokenBranch )
          {
            const changed = this.excludeCandidate(board, pivot.row, pivot.col, brokenBranch.candidate)
            changed && this.logger?.add('# (Fifty-Fifty) Excluded broken branch candidate: ' + brokenBranch.candidate.label + ' at ' + pivot.name)
            if ( changed ) return true
          }

          if ( results.length === 2 && !results[0].broken && !results[1].broken )
          {
            const changed = this.applyConsensusKnownValues(board, results[0].board, results[1].board)
            if ( changed )
            {
              this.logger?.add('# (Fifty-Fifty) Applied branch consensus from pivot: ' + pivot.name)
              return true
            }
          }
        }

        return false
    }

    private runDeterministicSolve( board: BoardModel ): void
    {
      const unitSolver = this.createUnitStrategyChain()
      const boardSolver = this.createBoardStrategyChain()

      for ( let attempt = 0 ; attempt < 50 ; attempt++ )
      {
        let changed = false

        board.forEachRow(row => {
          const rowChanged = unitSolver.apply(row)
          changed = rowChanged || changed
        })
        board.forEachCol(col => {
          const colChanged = unitSolver.apply(col)
          changed = colChanged || changed
        })
        board.forEachBox(box => {
          const boxChanged = unitSolver.apply(box)
          changed = boxChanged || changed
        })

        const boardChanged = boardSolver.apply(board)
        changed = boardChanged || changed

        if ( board.isSolved || this.isBroken(board) || !changed ) break
      }
    }

    private createUnitStrategyChain() : iStrategyUnit
    {
      const logger = new StrategyLogger()
      const strategies: Array<iStrategyUnit> = [
        new StrategyUnique(logger),
        new StrategyNakedPair(logger),
        new StrategyHiddenPair(logger),
        new StrategyNakedTriple(logger),
        new StrategyHiddenTriple(logger),
        new StrategyNakedQuad(logger),
        new StrategyHiddenQuad(logger)
      ]

      strategies.reduce((prev, curr) => prev.setNext(curr))

      return strategies[0]
    }

    private createBoardStrategyChain() : iStrategyBoard
    {
      const logger = new StrategyLogger()
      const strategies: Array<iStrategyBoard> = [
        new StrategyBoxLine(logger),
        new StrategyPointingLine(logger),
        new StrategyYWing(logger),
        new StrategyWWing(logger),
        new StrategyXYChain(logger),
        new StrategyXWing(logger),
        new StrategySwordfish(logger)
      ]

      strategies.reduce((prev, curr) => prev.setNext(curr))

      return strategies[0]
    }

    private cloneBoard( board: iBoard ) : BoardModel
    {
      const scratch = new BoardModel().toSolveMode()

      board.forEachRow(row => {
        row.forEachCell(cell => {
          if ( cell.isUnknown ) return
          scratch.set(CellIndex.by(cell.col - 1), CellIndex.by(cell.row - 1), CellValue.by(cell.value))
        })
      })

      return scratch
    }

    private pickPivotCells( board: iBoard ) : Array<CellModel>
    {
      const pivots: Array<CellModel> = []
      let minLength = 10

      board.forEachRow(row => {
        row.forEachCell(cell => {
          if ( cell.isKnown ) return
          if ( cell.length < 2 ) return

          if ( cell.length < minLength )
          {
            minLength = cell.length
            pivots.length = 0
            pivots.push(cell)
            return
          }

          if ( cell.length === minLength ) pivots.push(cell)
        })
      })

      return pivots
    }

    private isBroken( board: iBoard ) : boolean
    {
      let broken = false

      board.forEachRow(row => broken ||= row.isBroken)
      board.forEachCol(col => broken ||= col.isBroken)
      board.forEachBox(box => broken ||= box.isBroken)

      return broken
    }

    private applyKnownFromBoard( target: iBoard, solved: iBoard ) : boolean
    {
      let changed = false

      solved.forEachRow(row => {
        row.forEachCell(cell => {
          if ( cell.isUnknown ) return
          changed ||= target.set(CellIndex.by(cell.col - 1), CellIndex.by(cell.row - 1), CellValue.by(cell.value))
        })
      })

      return changed
    }

    private applyConsensusKnownValues( target: iBoard, branchA: iBoard, branchB: iBoard ) : boolean
    {
      let changed = false
      const branchBKnown = new Map<string, number>()

      branchB.forEachRow(row => {
        row.forEachCell(cell => {
          if ( cell.isUnknown ) return
          branchBKnown.set(cell.row + ':' + cell.col, cell.value)
        })
      })

      branchA.forEachRow(row => {
        row.forEachCell(cell => {
          if ( cell.isUnknown ) return

          const key = cell.row + ':' + cell.col
          const other = branchBKnown.get(key)
          if ( other == null || other !== cell.value ) return

          changed ||= target.set(CellIndex.by(cell.col - 1), CellIndex.by(cell.row - 1), CellValue.by(cell.value))
        })
      })

      return changed
    }

    private excludeCandidate( board: iBoard, rowNumber: number, colNumber: number, candidate: CellValue ) : boolean
    {
      let changed = false

      board.forEachRow(row => {
        row.forEachCell(cell => {
          if ( cell.row !== rowNumber || cell.col !== colNumber ) return
          changed ||= cell.exclude(candidate)
        })
      })

      return changed
    }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
