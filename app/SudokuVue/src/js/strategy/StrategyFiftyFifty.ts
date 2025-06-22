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
import type { iBoard                } from '@/js/interface/iBoard'
import type { CellModel             } from '@/js/model/CellModel'
import      { BoardModel            } from '@/js/model/BoardModel'
import      { CellIndex             } from '@/js/model/CellIndex'
import      { CellValue             } from '@/js/model/CellValue'
import      { aStrategyBoard        } from '@/js/abstract/aStrategyBoard'

export
class StrategyFiftyFifty extends aStrategyBoard
{
    protected applyStrategy ( board: iBoard ) : boolean
    {
        return this.strategy_set_fifty_fifty( board )
    }

    // A Level 3 Strategy
    //  Fifty-Fifty: Cells having two canidate values allowing us to try before we buy
    //    a guess if you weill.
    private strategy_set_fifty_fifty ( board : iBoard ) : boolean
    {
        let solved  = 0;
        const updated : Array<string> = [] as Array<string>

        // PROBLEM: unlike other strategies, the 50/50 outcome can leave the board in
        //  a FAILED or incomplete state. Failed is unrecoverable and incomplete is, simply unknown
        //  I.E. didn't result in a solved puzzle. We lack an undo but I have an alternative.
        //
        //  The plan for the time being would smell somthing like this:
        //   1) The current state of the board would be replicated to another copy of the board.
        //      A scratch copy we can break without worry.
        //   2) The copy would be used to try the 50/50 solution: on success proceeed with applying that
        //      change (the 50/50 cell value selection) to the original board and move forward.
        //   3) on failure or success, the copy is destroyed, it's a stratch pad, so if the choice
        //      makes a mess (board left in failed state, or incomplete, no harm).
        //      Simply toss it away and try the using other value on a new copy of the board.

        // HINTS:
        //  - For each naked pair cell try the first candidate value
        //  - If the board is solved, apply the change to the original board and return
        //  - If the board is not solved, try the second candidate value on a new
        //    copy of the board and repeat the process.
        //  - Repeat for all naked pair cells/values until success OR failure/uncessful

        const nakedPairCells : Array<CellModel> = [] as Array<CellModel>

        board.forEachRow( unit => {

          // Set of undetermined cells in the unit
          const setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

          // this.logger?.add('# (Fifty-Fifty) Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

          // Cells with two candiate values; hence a 50/50 chance
          setOfUndeterminedCells.forEach( cell => {
              // Only interested in cells having exactly two candidate values
              if ( cell.length == 2 )
              {
                nakedPairCells.push( cell )
                this.logger?.add('# (Fifty-Fifty) Naked Pair Cell: ' + cell.name + ' with candidates: ' + cell.as_candidate_array.map(v=>v.value).join(', '));
              }
          })
        })

        for ( const cell of nakedPairCells )
        {
          const candidates = cell.as_candidate_array;
          this.logger?.add('# (Fifty-Fifty) Trying Naked Pair cell: ' + cell.name + ' with candidates: ' + candidates.map(v=>v.value).join(', '))

          for ( const cv of candidates )
          {
            // Create a replica of the board to safly try a candidate value
            const scratchBoard = new BoardModel().toSolveMode()
            try {
              board.forEachRow( row => { row.forEachCell( cell => {
                if ( cell.isUnknown ) return; // Skip unknown cells
                // this.logger?.add('# (Fifty-Fifty) Copying cell: ' + cell.name + ' with value: ' + cell.value + ' (x,y): (' + cell.col + ',' + cell.row + ')');
                scratchBoard.set( CellIndex.by(cell.col-1), CellIndex.by(cell.row-1), CellValue.by(cell.value))
              })})
            }
            catch ( e )
            {
              this.logger?.add('# (Fifty-Fifty) Failed to copy board: ' + e.message );
              continue; // Skip to the next candidate value
            }

            // Set the candidate value on the scratch board
            if ( scratchBoard.set( CellIndex.by(cell.col-1), CellIndex.by(cell.row-1), cv ))
            {
              this.logger?.add('# (Fifty-Fifty) Trying candidate: ' + cv.value + ' for cell: ' + cell.name );

              // Check if the scratch board is solved
              if ( scratchBoard.isSolved )
              {
                // Apply the change to the original board
                board.set( CellIndex.by(cell.col), CellIndex.by(cell.row), cv );
                updated.push( cell.name );
                solved++;
                this.logger?.add('# (Fifty-Fifty) Solved with candidate: ' + cv.value + ' for cell: ' + cell.name);
                break; // Break out of the candidates loop, we found a solution
              }
              else
              {
                this.logger?.add('# (Fifty-Fifty) Failed with candidate: ' + cv.value + ' for cell: ' + cell.name);
              }
            }
          }

          // if ( board.isSolved ) break;
        }

        if ( solved > 0 )
          this.logger?.add('# Strategy 2 - 50/50 ' + solved + ' candidate values from ' + updated.length + ' cells (' + updated.join(',') + ')');

      return solved > 0;
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
