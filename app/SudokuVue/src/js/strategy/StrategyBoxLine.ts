
// Strategy Box Line

// A level 1 Strategy
//  Box Line: This strategy attempts to remove candidates from a Block
//    by comparing candidates in a Block (aka box) that intersects a line.
//    Each candidate found in the intersection not found in the non-intersection
//    of the Line can be removed from the non-intersected Box.
// Therefore: if ! Y-includes( Z-candidate ) X-exclude( Z-candidate )
//
//  X  X  X
//  Z  Z  Z  Y  Y  Y  Y  Y  Y
//  X  X  X
//
//  X = non-intersected-block
//  Y = non-intersected-line
//  Z = intersection
//

/*
	public boolean strategy_box_line( Unit line, IntersectMap iB, IntersectMap iL )
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
		//	 B = Cells 4-6
		//   C = Cells 7-9
		//  Block vertical intersects
		//   D = Cells 1,4,7
		//   E = Cells 2,5,8
		//   F = Cells 3,6,9

		// The Intersect candidates
		//  unique set of undetermined cell candidate values 
		ArrayList<Integer> intersectCandidates = iL.getIntersectCandidates( line.cells );

		// Line non-intersect candidates
		//  unique set of undetermined cell candidate values
		ArrayList<Integer> lineNonIntersectCandidates = iL.getNonIntersectCandidates( line.cells );

		// Clean-able Candidates
		//  The unique candidate set that we can exclude from non-intersected block cells
		ArrayList<Integer> cleanerCandidateSet = new ArrayList<Integer>(intersectCandidates);
		cleanerCandidateSet.removeAll(lineNonIntersectCandidates);

		// System.out.println(iL.set);

		if ( debug )
		{
			System.out.println(" Intersect: " + intersectCandidates + " - " + intersectCandidates.size());
			System.out.println("      Line: " + lineNonIntersectCandidates +
				" - " + lineNonIntersectCandidates.size());

			// Non Intersect Line (Unit) Cells
			System.out.println("  Cleaning: " + cleanerCandidateSet + " - " + cleanerCandidateSet.size());
		}

		// Were done if there is nothing to clean
		if ( cleanerCandidateSet.size() > 0 )
		{
			// Let the cleaning begin!
			// - Build set of non-intersect line cells
			// - exclude cleaning candidate set.
			ArrayList<Cell> blockNonIntersectCells = iB.getNonIntersectCells( this.cells );

			//new ArrayList<Cell>(9 - iL.set.size());
			for ( Cell c : blockNonIntersectCells )
			{
			//	System.out.println(" Line: " + c.getName());
				for ( Integer N : cleanerCandidateSet )
					if (c.exclude(N))
						changed++;
			}
		}

		if ( changed > 0 && debug )
			System.out.println( "# Strategy 1 - box_line cleaned " + changed + " candicates");

		return changed > 0;
	}
*/

// vim: expandtab number tabstop=4
// END
