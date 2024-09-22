
// Strategy UNIT Naken Pair

import type { iUnit             } from '@/js/interface/iUnit'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'

export
class StrategyHiddenQuad extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return this.strategy_set_hidden_quad( unit )
    }


    // A Level 2 Strategy
    //  Hidden Triple(Quad): Three/Four value candidates are found only in three/four Cells. These calls
    //     have other candidates which may safely be eliminated as candidates because
    //     the three unique candidate set "will" solve the three cells.
    strategy_set_hidden_quad ( unit: iUnit) : boolean
    {
        const removed  = 0;

//		HIDDEN:
//		{
//			// We only need to work with those Cells that are undetermined (not solved)
//			//  its a waste of time looking at stuff that is already solved
//			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

//			if ( this.logger )
//			{ this.logger.add("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

//			// No point in looking for quad's when there are less than five Cells
//			// to compare!
//			if ( setOfUndeterminedCells.size() < 5 ) { break HIDDEN; }

//			// Map each candidate to the Cells that have it
//			ArrayList<ArrayList<Cell>> mapOfVals2Cells = new ArrayList<ArrayList<Cell>>(9);

//			for ( int i = 0 ; i < 9 ; i++ )
//			{ mapOfVals2Cells.add(new ArrayList<Cell>(9)); }

//			for ( Cell cell_undetermined : setOfUndeterminedCells )
//			{
//				for ( Integer candidate : cell_undetermined.getSet())
//				{
//					// Candidate of this cell
//					mapOfVals2Cells.get( candidate - 1 ).add( cell_undetermined );
//				}
//			}

//			// We're looking for Hidden Quad'sple's, they are seen as four candidates
//			//   having the same set set of four Cells; the quad candidates can't
//			//   be found any where else so we can make these Cells A "Naked"
//			//   quad by removing any other candidates safely because the candidate
//			//   quad solves the quad cell set.

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

//						Iterator<ArrayList<Cell>> Di = mapOfVals2Cells.iterator();
//						int Dpos = 0;

//						// A bit of magic to avoid comparing the same candidate sets
//						for ( int skip = 0 ; skip < Cpos && Di.hasNext() ; skip++ )
//						{ Di.next(); Dpos++ ; }

//						while ( Di.hasNext())
//						{
//							ArrayList<Cell> D = Di.next(); Dpos++;

//							// Candidate A is found in four cells &&
//							// Candidate B is found in four cells &&
//							// Candidate C is found in four cells &&
//							// Candidate D is found in four cells &&
//							// and its the same four cells
//							if ( A.size() == 4 && B.size() == 4 && C.size() == 4 && D.size() == 4 &&
//									A.containsAll(B) && A.containsAll(C) && A.containsAll(D))
//							{
//								// Nothing to clean up?
//								if (	A.get(0).getSize() == 4 &&
//										B.get(1).getSize() == 4 &&
//										C.get(2).getSize() == 4 &&
//										D.get(3).getSize() == 4 )
//								{ continue; }

//								ArrayList<Integer> p = new ArrayList<Integer>(4);
//								p.add(Apos); p.add(Bpos); p.add(Cpos); p.add(Dpos);

//								if ( use logger )
//									System.out.println("# Strategy 2 - Hidden Quad (" +
//										A.get(0).getName() + "," +
//										A.get(1).getName() + "," +
//										A.get(2).getName() + "," +
//										A.get(3).getName() +
//										") " + p );

//								// Clean up unwanted candidates from the hidden triple
//								for ( Cell cell : A )
//								{
//									for ( Integer N : cell.getSet() )
//									{
//										if ( N == Apos || N == Bpos || N == Cpos || N == Dpos )
//										{ continue; }
//										if ( cell.exclude(N)) { removed++; }
//									}
//								}
//							}
//						}
//					}
//				}
//			}
//		}

//		if ( removed > 0  && use logger )
//			System.out.println("# Strategy 2 - Hidden Quad cleaned " + removed + " candidates");

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
