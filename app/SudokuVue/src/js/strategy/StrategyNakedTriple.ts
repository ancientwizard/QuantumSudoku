
// Strategy UNIT Naken Pair

import type { iUnit             } from '@/js/interface/iUnit'
import type { CellModel         } from '@/js/model/CellModel'
import type { CellValue         } from '@/js/model/CellValue'
import      { CandidateMatch    } from '@/js/strategy/CandidateMatch'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'
import      { containsAll       } from '@/js/util/contains-all'

export
class StrategyNakedTriple extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_naked_triple( unit )
    }

    // A Level 2 Strategy
    //  Naked Triple: A set of identical cell-value candidates found in a
    //      in a set of Cells of the same size. I.E exactly three cells
    //      have the same set of three value candidates. The candidates
    //      of the matching cells may safely [logically] be removed
    //      from all remaining unsolved cells in the Unit.

    private strategy_set_naked_triple ( unit : iUnit ) : boolean
    {
        let removed : number = 0
        let updated : Array<string> = [] as Array<string>

        NAKED_TRIPLE:
        {
            // We only need to work with those Cells that are undetermined (not solved)
            let setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger && this.logger.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // No point in looking for tripple solutions when there are less than five Cells
            // to compare! Basically if three Cells match the fifth will always be unique
            // and solved using the Unique Strategy. It could be a naked five-some but thats
            // very rare and will very likely show up as a simpler strategy
            if ( setOfUndeterminedCells.length < 5 ) break NAKED_TRIPLE

            let match : Array<CandidateMatch> = [] as Array<CandidateMatch>

            setOfUndeterminedCells.forEach( cell => {
                if ( cell.length == 3 )
                {
                    let matched : boolean = false
                    const cell_va : Array<CellValue> = cell.as_candidate_array

                    match.forEach( candidate => {
                        const can_cva : Array<CellValue> = candidate.first.as_candidate_array

                        if ( containsAll( cell_va, can_cva ))
                        {
                            candidate.all.push(cell);
                            matched = true
                        }
                    })

                    if ( ! matched ) match.push( new CandidateMatch(cell))
                }
            })

            // Inspect set for naked Triple's
            match.forEach( candidate => {

                if ( candidate.all.length == 3 )
                {
                    let first_naked_displayed : boolean = false;

                    // We have a winner
                    setOfUndeterminedCells.forEach( cell => {
                        if ( candidate.all.includes(cell)) return

                        candidate.first.as_candidate_array.forEach( cv => {
                            if ( ! first_naked_displayed && cell.includes(cv))
                            {
                                first_naked_displayed = true;
                                this.logger && this.logger.add("# Strategy 2 - Naked Triple " + candidate );
                            }

                            if ( cell.exclude(cv)) { removed++; updated.includes(cell.name) || updated.push(cell.name) }
                        })
                    })
                }
            })
        }

        if ( removed > 0 && this.logger )
            this.logger.add('# Strategy 2 - Naked Triple cleaned ' + removed + ' candidate values from ' + updated.length + ' cells (' + updated.join(',') + ')');

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
