// StrategyUnique.ts

import type { iUnit             } from '@/js/interface/iUnit'
import type { CellModel         } from '@/js/model/CellModel'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'
import      { CellValue         } from '@/js/model/CellValue'

export
class StrategyUnique extends aStrategyBase
{

    public applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_unique( unit )
    }

    // A Level 0 Strategy
    //  Unique: A single UNIT-CELL having a "UNIQUE" candidate value not found
    //     in any other UNIT-CELL is solved by eleminating all remaining
    //     candidates are safely removed.

    private strategy_unique ( unit: iUnit ) : boolean
    {
        let solved  = 0;

        UNIQUE:
        {
            // console.log('APPLY-STRATEGY-UNIQUE')

            // We only need to work with those Cells that are undetermined (un-solved)
            //  looking at cells already solved isn't helpful
            const setOfUndeterminedCells: Array<CellModel> = this.getUndeterminedCellList( unit )

            this.logger && this.logger.add('# Undetermined Cells: ' + this.getCellNames(setOfUndeterminedCells))

            // Everything has been solved
            if ( setOfUndeterminedCells.length < 1 ) { break UNIQUE; }

            // Mark cells with a unique member with is()
            const counts : number[] = [0,0,0,0,0,0,0,0,0];
            const cindx  : CellModel[] = [] as Array<CellModel>

            // Collect value/cell Counts
            setOfUndeterminedCells.forEach( cell => {
                cell.as_candidate_array.forEach( cellval => {
                    const p : number = cellval.index
                    counts[p]++;     // Candidate was seen

                    // The last Cell with this candidate
                    // It's also the one and only if count == 1
                    cindx[p] = cell;
                })
            })

            // Unique uses
            for ( let i  = 0 ; i < 9 ; i++ )
            {
                // We have a candidate with a count of one
                if ( counts[i] == 1 )
                {
                    // Solve the Cell with the unique candidate
                    this.logger && this.logger.add('# Strategy 0 - Unique (' + cindx[i].name + ')')
                    cindx[i].is( CellValue.arrayFactory[ i ] ) && solved++;
                }
            }
        }

        return solved > 0;
    }
}

// vim: expandtab number tabstop=4
// END
