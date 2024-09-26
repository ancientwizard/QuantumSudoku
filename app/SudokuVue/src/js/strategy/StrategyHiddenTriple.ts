
// Strategy UNIT Hidden Triple

import type { iUnit                 } from '@/js/interface/iUnit'
import type { CellModel             } from '@/js/model/CellModel'
import      { aStrategyBase         } from '@/js/abstract/aStrategyBase'
import      { containsAll           } from '@/js/util/contains-all'
import      { StrategyExtractHidden } from '@/js/strategy/StrategyExtractHidden'

export
class StrategyHiddenTriple extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_hidden_triple( unit )
    }


    // A Level 2 Strategy
    //  Hidden Triple(Quad): Three value candidates are found only in three Cells. These calls
    //     have other candidates which may safely be eliminated as value candidates because
    //     the three unique candidate set "will" solve the three cells.
    strategy_set_hidden_triple ( unit : iUnit) : boolean
    {
        let removed : number = 0;
        let updated : Array<string> = [] as Array<string>

        HIDDEN:
        {
            // We only need to work with those Cells that are undetermined (not solved)
            let setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger?.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // No point in looking for triple's when there are less than four Cells
            // to compare!
            if ( setOfUndeterminedCells.length < 4 ) break HIDDEN

            let strategy : StrategyExtractHidden = new StrategyExtractHidden( this.logger )
            let hidden_triple_candidates = strategy.filterByCandidateHiddenTriples( strategy.mapUnsolvedCellValuesToCells( setOfUndeterminedCells ))

            hidden_triple_candidates.forEach( T => this.logger?.add( '# candidate ' + T ))

            strategy.detectHiddenTriples(
                // A descrete set of Hidden Triple candidates; we've cut out the obvious garbage
                hidden_triple_candidates,

                // In this context I dont really need A, B & C as they are the same
                //  as long as we trust the code sending the arrays to us is always correct
                ( p, A, B, C ) => {

                    this.logger?.add(`# Strategy 2 - Hidden Triple Cells: (${A.map(c => c.name).join(',')}) Hidden: [${p.join(',')}]`)

                    A.forEach( cell =>
                      cell.as_candidate_array.forEach( cv => {
                        if ( p.includes( cv.value )) return
                        // Exclude unwanted candidate values from the hidden triple cell set
                        if ( cell.exclude(cv)) { removed++; updated.includes(cell.name) || updated.push(cell.name) }
                      })
                   )
                }
            )
        }

        if ( removed > 0 )
            this.logger?.add(`# Strategy 2 - Hidden Triple excluded ${removed} candidate values from ${updated.length} cells (${updated.join(',')})`)

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
