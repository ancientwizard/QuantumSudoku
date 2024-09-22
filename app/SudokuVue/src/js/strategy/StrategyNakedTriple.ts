
// Strategy UNIT Naken Pair

import type { iUnit             } from '@/js/interface/iUnit'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'

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
        const removed  = 0;

//		NAKED_TRIPLE:
//		{
//			// We only need to work with those Cells that are undetermined (not solved)
//			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

//			if ( this.logger )
//			{ this.logger.add('# Undetermined Cells: ' + getCellNames(setOfUndeterminedCells)); }

//			// No point in looking for quad when there are less than six Cells
//			// to compare! Basically if four Cells match the fifth will always be unique
//			// and solved using the Unique Strategy. It could be a naked five-some but thats
//			// very rare and will very likely show up as a simpler strategy
//			if ( setOfUndeterminedCells.size() < 5 ){ break NAKED_TRIPLE; }

//			ArrayList<CandidateMatch> match = new ArrayList<CandidateMatch>(2);

//			for ( Cell cell : setOfUndeterminedCells )
//			{
//				if ( cell.getSize() == 3 )
//				{
//					ADD:
//					{
//					for ( CandidateMatch candidate : match )
//					{
//						if ( candidate.first.getSet().containsAll(cell.getSet()))
//						{
//							candidate.all.add(cell);
//							break ADD;
//						}
//					}

//					CandidateMatch candidate = new CandidateMatch(4);
//					candidate.first = cell;
//					candidate.all.add(cell);
//					match.add(candidate);
//					}
//				}
//			}

//			// Inspect set for naked Quad's
//			for ( CandidateMatch candidate : match )
//			{
//				//	System.out.println("# " + candidate.first.toString2());
//				if ( candidate.all.size() == 3 )
//				{
//					boolean naked = false;
//					// We have a winner
//					for ( Cell cell : setOfUndeterminedCells )
//					{
//						if ( candidate.all.contains(cell))
//						{
//							continue;
//						}

//						for ( Integer N : candidate.first.getSet())
//						{
//							if ( ! naked && cell.includes(N))
//							{
//								naked = true;
//								this.logger && this.logger.add("# Strategy 2 - Naked Triple " + candidate );
//							}

//							if ( cell.exclude(N)) { removed++; }
//						}
//					}
//				}
//			}
//		}

//		if ( removed > 0 && this.logger )
//			this.logger.add("# Strategy 2 - Naked Triple cleaned " + removed + " candidates");

        return removed > 0;
    }
}

// vim: expandtab number tabstop=4
// END
