
// Strategy Pointing Line

// A level 1 Strategy
//  Pointing Line: This strategy attempts to remove candidates from a Line
//    by comparing candidates in a Block (aka box) that intersect that line.
//    Each candidate found in the intersection not found in the non-intersection
//    of the block can be removed from the non-intersected line.
//
// Therefore: if ! X-includes( Z-candidate ) Y-exclude( Z-candidate )
//
//  X  X  X
//  Z  Z  Z  Y  Y  Y  Y  Y  Y
//  X  X  X
//
//  X = non-intersected-block
//  Y = non-intersected-line
//  Z = intersection
//

// Strategy Pointing Line
/*
	public boolean strategy_pointing_line( Unit line, IntersectMap iB, IntersectMap iL )
	{
		int changed = 0;

		// Lines (rows and columns) have three parts { A, B, C }
		//   A = Cells 1-3
		//   B = Cells 4-6
		//   C = Cells 7-9
		//
		// Blocks are intersected horizontally with Line rows
		//     and vertically with Line columns. A Block has six(6) intersections
		//     three(3) horizontal and three(3) vertical.
		//  Block horizontal intersects
		//   A = Cells 1-3
		//   B = Cells 4-6
		//   C = Cells 7-9
		//  Block vertical intersects
		//   D = Cells 1,3,7
		//   E = Cells 2,4,8
		//   F = Cells 3,5,9

		// The Intersect candidates
		ArrayList<Integer> intersectCandidates = iB.getIntersectCandidates( this.cells );

		// Block non-intersect candidates
		ArrayList<Integer> blockNonIntersectCandidates = iB.getNonIntersectCandidates( this.cells );

		// Clean-able Candidates
		ArrayList<Integer> cleanerCandidateSet = new ArrayList<Integer>(intersectCandidates);
		cleanerCandidateSet.removeAll(blockNonIntersectCandidates);

		// System.out.println(iB.set);

		if ( debug )
		{
			System.out.println(" Intersect: " + intersectCandidates + " - " + intersectCandidates.size());
			System.out.println("     Block: " + blockNonIntersectCandidates +
				" - " + blockNonIntersectCandidates.size());

			// Non Intersect Line (Unit) Cells
			System.out.println("  Cleaning: " + cleanerCandidateSet + " - " + cleanerCandidateSet.size());
		}

		// Were done if there is nothing to clean
		if ( cleanerCandidateSet.size() > 0 )
		{
			// Let the cleaning begin!
			// - Build set of non-intersect line cells
			// - exclude cleaning candidate set.
			ArrayList<Cell> lineNonIntersectCells = iL.getNonIntersectCells( line.cells );

			for ( Cell c : lineNonIntersectCells )
			{
				for ( Integer N : cleanerCandidateSet )
				{
					if ( c.exclude(N))
						changed++;
				}
			}
		}

		if ( changed > 0 && debug )
			System.out.println( "# Strategy 1 - pointing_line cleaned " + changed + " candicates");

		return changed > 0;
	}
*/

// vim: expandtab number tabstop=4
// END
