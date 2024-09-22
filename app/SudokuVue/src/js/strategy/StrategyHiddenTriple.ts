
// Strategy UNIT Naken Pair

import type { iUnit             } from '@/js/interface/iUnit'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'

export
class StrategyHiddenTriple extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return false
    }


    // A Level 2 Strategy
    //  Hidden Triple(Quad): Three value candidates are found only in three Cells. These calls
    //     have other candidates which may safely be eliminated as value candidates because
    //     the three unique candidate set "will" solve the three cells.
    strategy_set_hidden_triple ( unit : iUnit) : boolean
    {
        const removed  = 0;

//		HIDDEN:
//		{
//			// We only need to work with those Cells that are undetermined (not solved)
//			//  its a waste of time looking at stuff that is already solved
//			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

//			if ( this.logger )
//			{ this.logger.add("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

//			// No point in looking for triple's when there are less than four Cells
//			// to compare!
//			if ( setOfUndeterminedCells.size() < 4 ){ break HIDDEN; }

//			// Map each candidate to the Cells that have it
//			ArrayList<ArrayList<Cell>> mapOfVals2Cells = new ArrayList<ArrayList<Cell>>(9);

//			for ( int i = 0 ; i < 9 ; i++ )
//			{ mapOfVals2Cells.add(new ArrayList<Cell>(9)); }

//			for ( Cell cell_undetermined : setOfUndeterminedCells )
//			{
//				for ( Integer candidate : cell_undetermined.getSet())
//				{
//					// Candidate of this cell
//					mapOfVals2Cells.get(candidate-1).add(cell_undetermined);
//				}
//			}

//			// We're looking for Hidden Triple's, they are seen as three candidates
//			//   having the same set set of three Cells; the three candidates can't
//			//   be found any where else so we can make these Cells A "Naked"
//			//   triple by removing any other candidates safely because the candidate
//			//   triple solved the three cell set.

//			Iterator<ArrayList<Cell>> Ai = mapOfVals2Cells.iterator();
//			int Apos = 0;

//			while ( Ai.hasNext())
//			{
//				ArrayList<Cell> A = Ai.next(); Apos++;
//				//	System.out.println("# " + Apos + ":" + getCellNames(A));

//				Iterator<ArrayList<Cell>> Bi = mapOfVals2Cells.iterator();
//				int Bpos = 0;

//				// A bit of magic to avoid comparing the same candidate sets
//				// Skip the combo's we've seen before moving Bi just past Ai
//				for ( int skip = 0 ; skip < Apos && Bi.hasNext() ; skip++ )
//				{ Bi.next(); Bpos++; }

//				// We're now pointing at the first Cell past Ai or this is the end
//				//  test each Bi with the current Ai if we're not at the end
//				while ( Bi.hasNext())
//				{
//					ArrayList<Cell> B = Bi.next(); Bpos++;

//					Iterator<ArrayList<Cell>> Ci = mapOfVals2Cells.iterator();
//					int Cpos = 0;

//					// A bit of magic to avoid comparing the same candidate sets
//					for ( int skip = 0 ; skip < Bpos && Ci.hasNext() ; skip++ )
//					{ Ci.next(); Cpos++ ; }

//					while ( Ci.hasNext())
//					{
//						ArrayList<Cell> C = Ci.next(); Cpos++;

//						// Candidate A is found in three cells &&
//						// Candidate B is found in three cells &&
//						// Candidate C is found in three cells &&
//						// and its the same three cells
//						if ( A.size() == 3 && B.size() == 3 && C.size() == 3 &&
//								A.containsAll(B) && A.containsAll(C))
//						{
//							// Nothing to clean up?
//							if ( A.get(0).getSize() == 3 &&
//								 B.get(1).getSize() == 3 &&
//								 C.get(2).getSize() == 3 )
//							{ continue; }

//							ArrayList<Integer> p = new ArrayList<Integer>(3);
//							p.add(Apos); p.add(Bpos); p.add(Cpos);

//							if ( this.logger )
//								this.logger.add("# Strategy 2 - Hidden Triple (" +
//									A.get(0).getName() + "," +
//									A.get(1).getName() + "," +
//									A.get(2).getName() +
//									") " + p );

//							// Clean up unwanted candidates from the hidden triple
//							for ( Cell cell : A )
//							{
//								for ( Integer N : cell.getSet() )
//								{
//									if ( N == Apos || N == Bpos || N == Cpos ){ continue; }
//									if ( cell.exclude(N)) { removed++; }
//								}
//							}
//						}
//					}
//				}
//			}
//		}

//		if ( removed > 0 && this.logger )
//			this.logger.add("# Strategy 2 - Hidden Triple cleaned " + removed + " candidates");

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
