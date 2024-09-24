
// Strategy UNIT Naked Pair

import type { iUnit             } from '@/js/interface/iUnit'
import type { CellModel         } from '@/js/model/CellModel'
import type { CellValue         } from '@/js/model/CellValue'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'
import      { CandidateMatch    } from '@/js/strategy/CandidateMatch'
import      { containsAll       } from '@/js/util/contains-all'

export
class StrategyNakedPair extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_naked_pair( unit )
    }

    // A Level 1 Strategy
    //  Naked Pair: The set of identical cell-value candidates found
    //       in a pair of cells may safely remove those candidates
    //       from all other unsolved cells in the Unit.
    private strategy_set_naked_pair ( unit : iUnit ) : boolean
    {
        let removed : number = 0;
        let updated : Array<string> = [] as Array<string>

        NAKED_PAIR:
        {
            // We only need to work with those Cells that are undetermined (unsolved)
            //  looking at stuff that is already solved isn't useful
            const setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger && this.logger.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // No point in looking for pairs when there are less than four Cells
            // to compare! Consider when two Cells match the third will always be unique
            // and solved using the Unique Strategy.
            if ( setOfUndeterminedCells.length < 4 ) break NAKED_PAIR

            const match : Array<CandidateMatch> = [] as Array<CandidateMatch>

            setOfUndeterminedCells.forEach( cell => {
                if ( cell.length != 2 ) return

                let matched  = false
                const cell_va : Array<CellValue> = cell.as_candidate_array

                match.forEach( candidate => {
                    const can_cva : Array<CellValue> = candidate.first.as_candidate_array

                //  if ( cell_va.every( cv => can_cva.includes(cv) ))
                    if ( containsAll(cell_va, can_cva ))
                    {
                        candidate.all.push(cell)
                        matched = true
                    }
                })

                if ( ! matched ) match.push( new CandidateMatch( cell ))
            })

            // console.log('Naked cell pairs', match.toString())

            // Inspect set for naked pairs
            match.forEach( candidate => {
                if ( candidate.all.length != 2 ) return

                if ( this.logger )
                {
                    const logger = this.logger
                    candidate.all.forEach( c => logger.add(c.toString2()))
                }

                let first_naked_shown  = false;

                // exclude cell PAIR values from other cells
                setOfUndeterminedCells.forEach( cell => {
                    // Leave naked pair cells unchanged!
                    if ( candidate.all.includes(cell)) return

                    // Clean up on isle 12 (all other unsolved cells get housekeeping!)
                    candidate.first.as_candidate_array.forEach( cv => {
                        if ( ! first_naked_shown && cell.includes(cv))
                        {
                            first_naked_shown = true;
                            this.logger && this.logger.add('# Strategy 1 - Naked  Pair ' + candidate );
                        }

                        if ( cell.exclude(cv)) { removed++; updated.includes(cell.name) || updated.push(cell.name) }
                    })
                })
            })
        }

        if ( removed > 0 && this.logger )
            this.logger.add('# Strategy 2 - Naked Pair cleaned ' + removed + ' candidate values from ' + updated.length + ' cells (' + updated.join(',') + ')');

        return removed > 0;
    }
}


// vim: expandtab number tabstop=4
// END
