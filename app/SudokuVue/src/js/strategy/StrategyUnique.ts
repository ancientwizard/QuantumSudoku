// StrategyUnique.ts

import type { iUnit             } from '../interface/iUnit'
import      { aStrategyBase     } from '../abstract/StrategyBase'

export
class StrategyUnique extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return false
    }

    // A Level 0 Strategy
    //  Unique: A single UNIT-CELL having a "UNIQUE" candidate value not found
    //     in any other UNIT-CELL is solved by eleminating all remaining
    //     candidates are safely removed.

    private strategy_unique () : boolean
    {
        var solved: number = 0;

//		UNIQUE:
//		{
//			// We only need to work with those Cells that are undetermined (not solved)
//			//  its a waste of time looking at stuff that is already solved
//			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

//			if ( show_undetermined )
//			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

//			// Everything has been solved
//			if ( setOfUndeterminedCells.size() < 1 ){ break UNIQUE; }

//			// Mark cells with a unique member with is()
//			int[] counts = {0,0,0,0,0,0,0,0,0};
//			Cell[] cindx = new Cell[9];

//			// Collect Counts
//			for ( Cell c : setOfUndeterminedCells )
//			{
//				for ( Integer cellx : c.getSet())
//				{
//					int p = cellx.intValue();
//					counts[p-1]++;     // Candidate was seen

//					// The last Cell with this candidate
//					// Also the one and only if count == 1
//					cindx[p-1] = c;
//				}
//			}

//			// Unique uses
//			for ( int i = 0 ; i < 9 ; i++ )
//			{
				// We have a candidate with a count of one
//				if ( counts[i] == 1 )
//				{
//					// Solve the Cell with the unique candidate
//					if ( DEBUG )
//						System.out.println("# Strategy 0 - Unique (" + cindx[i].getName() + ")");
//					cindx[i].is( i + 1 );
//				}
//			}
//		}

        return solved > 0;
    }
}

// vim: expandtab number tabstop=4
// END
