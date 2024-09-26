
// Strategy UNIT Naken Pair

import type { iUnit             } from '@/js/interface/iUnit'
import type { CellModel         } from '@/js/model/CellModel'
import type { CellValue         } from '@/js/model/CellValue'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'
import      { CandidateMatch    } from '@/js/strategy/CandidateMatch'
import      { containsAll       } from '@/js/util/contains-all'


export
class StrategyNakedQuad extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_naked_quad( unit )
    }


    // A Level 2 Strategy
    //  Naked Quad: A set of identical cell-value candidates found in a
    //       in a set of Cells of the same size (four). I.E exactly
    //       four cells have the same set of four value candidates.
    //       The candidates of the matching cells may safely be removed
    //       from all maining unsolved cells in the Unit.
    private strategy_set_naked_quad ( unit: iUnit ) : boolean
    {
        let removed : number = 0;
        let updated : Array<string> = [] as Array<string>

        NAKED_QUAD:
        {
            // We only need to work with those Cells that are undetermined (not solved)
            //  its a waste of time looking at stuff that is already solved
            let setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger?.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // No point in looking for Naked Quad when there are less than six Cells
            // to compare! Basically if four Cells match the fifth will always be unique
            // and solved using the Unique Strategy. It could be a naked five-some but thats
            // very rare and will very likely show up as a simpler strategy
            if ( setOfUndeterminedCells.length < 6 ) break NAKED_QUAD

            let match : Array<CandidateMatch> = [] as Array<CandidateMatch>

            setOfUndeterminedCells.forEach( cell => {
                if ( cell.length == 4 )
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

            // Inspect set for naked Quad's
            match.forEach( candidate => {

                if ( candidate.all.length == 4 )
                {
                    let first_naked_displayed : boolean = false;

                    // We have a winner
                    setOfUndeterminedCells.forEach( cell => {
                        if ( candidate.all.includes(cell)) return

                        candidate.first.as_candidate_array.forEach( cv => {
                            if ( ! first_naked_displayed && cell.includes(cv))
                            {
                                first_naked_displayed = true;
                                this.logger?.add('# Strategy 2 - Naked Quad ' + candidate );
                            }

                            if ( cell.exclude(cv)) { removed++; updated.includes(cell.name) || updated.push(cell.name) }
                        })
                    })
                }
            })
        }

        if ( removed > 0 )
            this.logger?.add(`# Strategy 2 - Naked Quad excluded ${removed} candidate values from ${updated.length} cells (${updated.join(',')})`);

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
