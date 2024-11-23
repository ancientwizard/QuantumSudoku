
// Strategy UNIT Naken Pair

import type { iUnit                 } from '@/js/interface/iUnit'
import type { CellModel             } from '@/js/model/CellModel'
import      { aStrategyBase         } from '@/js/abstract/aStrategyBase'
//import      { containsAll           } from '@/js/util/contains-all'
import      { StrategyExtractHidden } from '@/js/strategy/StrategyExtractHidden'


export
class StrategyHiddenQuad extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_hidden_quad( unit )
    }


    // A Level 2 Strategy
    //  Hidden Quad: Four value candidates are found only in four Cells. These calls
    //     have other candidate values which may safely be eliminated as candidates because
    //     the fours unique candidate value set "will" solve the four cells.
    strategy_set_hidden_quad ( unit: iUnit) : boolean
    {
        let   removed = 0;
        const updated : Array<string> = [] as Array<string>

        HIDDEN:
        {
            // We only need to work with those Cells that are undetermined (not solved)
            const setOfUndeterminedCells : Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger?.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // No point in looking for quad's when there are less than five Cells
            // to compare!
            if ( setOfUndeterminedCells.length < 5 ) break HIDDEN

            const strategy : StrategyExtractHidden = new StrategyExtractHidden( this.logger )
            const hidden_quad_candidates = strategy.filterByCandidateHiddenQuads( strategy.mapUnsolvedCellValuesToCells( setOfUndeterminedCells ))

            hidden_quad_candidates.forEach( Q => this.logger?.add( '# candidate ' + Q ))

            strategy.detectHiddenQuads(
                // A descrete set of Hidden Quad candidates; we've cut out the obvious garbage
                hidden_quad_candidates,

                // In this context I dont really need A, B, C & D as they are the same
                //  as long as we trust the code sending the arrays to us is always correct
                ( p, A, B, C, D ) => {

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
            this.logger?.add(`# Strategy 2 - Hidden Quad pruned ${removed} candidate values from ${updated.length} cells (${updated.join(',')})`)

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
