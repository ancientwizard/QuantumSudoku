
// Strategy UNIT Hidden Pair

import type { iUnit             } from '@/js/interface/iUnit'
import type { CellModel         } from '@/js/model/CellModel'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'
import      { containsAll       } from '@/js/util/contains-all'

export
class StrategyHiddenPair extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_hidden_pair( unit )
    }

	// A level 1 Strategy
	// Hidden Pair: Exactly one pair of cells contain two matching candidates
	//   not found in any other Cells. The the candidate cell-value set are the solutions for these
	//   pair of cells. All other candidates in this Cell set may be removed. This pair
	//   which was "Hidden" now becomes A "Naked" pair; however we already know that these
	//   candidates are not in any other Cells so no further action is required
    private strategy_set_hidden_pair ( unit : iUnit ) : boolean
    {
        let removed : number = 0;
        let updated : Array<string> = [] as Array<string>

        HIDDEN:
        {
            // We only need to work with those Cells that are undetermined (unsolved)
            //  looking at stuff that is already solved isn'y useful
            const setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger && this.logger.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // No point in looking for "HIDDEN" pairs when there are less than three Cells
            // to compare! Basically if the last two match, so what! There are only two
            // candidates remaining so there is nothing to do
            if ( setOfUndeterminedCells.length < 3 ) break HIDDEN

            // Map each candidate value to the Cells that have it
            const mapOfVals2Cells : Array<Array<CellModel>> = [] as Array<Array<CellModel>>

            for ( let i  = 0 ; i < 9 ; i++ )
                mapOfVals2Cells.push( [] as Array<CellModel> )

            setOfUndeterminedCells.forEach( cell_undetermined =>
                cell_undetermined.as_candidate_array.forEach( cv => {
                    mapOfVals2Cells[ cv.index ].push( cell_undetermined )
                })
            )

            // We're looking for Hidden Pairs, they are seen as two candidate values
            //   having the same set set of two Cells; the two candidates can't
            //   be found any where else so we can make these Cells A "Naked"
            //   pair

            let Apos  = 0

            mapOfVals2Cells.forEach( A => {
                Apos++

                // console.log('# ' + Apos + ':' + this.getCellNames(A))

                let Bpos  = 0;

                // A bit of magic to avoid comparing the same pairs twice!
                // Skip the pairs we've seen before moving Bi just past Ai
                let skip  = 0

                // We're now pointing at the first Cell past Ai or this is the end
                //  test each Bi with the current Ai if we're not at the end
                mapOfVals2Cells.forEach( B => {
                    Bpos++

                    // A bit of magic to avoid comparing the same pairs twice!
                    // Skip the pairs we've seen before moving Bi just past Ai
                    if ( skip < Apos ) { skip++; return }

                    // PAIRS
                    // Candidate A is found in two cells &&
                    // Candidate B is found in two cells &&
                    // and its the same two cells
                    if ( A.length == 2 && B.length == 2 && containsAll(A,B))
                    {
                        // Nothing to clean up?
                        if ( A[0].length == 2 && B[1].length == 2) return

                        if ( this.logger )
                            this.logger.add('# Strategy 1 - Hidden Pair (' +
                                A[0].name + ',' +
                                A[1].name + ')' )

                        // Clean up
                        A.forEach( cell => {
                            cell.as_candidate_array.forEach( cv => {
                                if ( cv.value == Apos || cv.value == Bpos ) return
                                if ( cell.exclude(cv)) { removed++; updated.includes(cell.name) || updated.push(cell.name) }
                            })
                        })
                    }
                })
            })
        }

        if ( removed > 0 && this.logger )
            this.logger.add('# Strategy 1 - Hidden Pair cleaned ' + removed + ' candidate values ' + updated.length + ' from cells (' + updated.join(',') + ')');

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
