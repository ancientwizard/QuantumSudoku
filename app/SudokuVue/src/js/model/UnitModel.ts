
// Sudoku Unit Model
// DESIGN-GOALS:
//  -
//

//import { CellValue  } from './CellValue.ts'
//import { Observer   } from '../interface/Observer.ts'
//import { Observable   } from './Observable.ts'

export
class Unit
{
  public static boolean DEBUG = false;

	// The Unit is the second layer in our implementation of the Sudoku
	// puzzle. The Sudoku puzzle is made up of nine (9) 3x3 grids called
	// a block as well as nine (9) columns and nine (9) rows. Therefore
	// each Cell is a member of three basic units. A block, a column and
	// a row. Each of these units have Sudoku rules they must follow no
	// matter how they are organized visually within a puzzle. Such a
	// rule does not care if the nine cells are in a row, a column or
	// in a 3x3 grid. The rules and hence the Strategies applied to them
	// are the same. Each is simple: a set of nine cells and their order
	// or position do not matter. Our implementation keeps them as an
	// ordered set for convenience but is not important for solving the
	// puzzle at this level/layer.
	//
	// The Unit uses the Observer/Observable pattern provided by Cell.
	//  Therefore the moment a Cell has eliminated all but one candidate
	//  that Cell communicates this change to every other Cell that is
	//  an observer of that Cell. You can quickly see how it will
	//  notify all of its observers in this unit and all other units it
	//  is a member of. It essentially ripples throughout the puzzle.
	//
	// The UNIT employs those Strategies that are single unit of Cells
	//  can impose on one another. Each strategy tries to eliminate
	//  candidates in an attempt to trigger a Cell into knowing its
	//  final value and further eliminating candidates from other cells.
	//  Sure sounds like a viscous circle.
	//
	// Strategies: (Level 0)
	//  Unique: A candidate can be found in only one of the units Cell.
	//          That candidate solves the "Unique" Cell.
	//
	//  Clean-up: A solved Cell tells the other cells within its influence
	//     they can remove it's solution as a candidate. This is implemented
	//     in Cell however the neighbors are defined in Unit. Together Unit
	//     and Cell work together to produce the cleanup. This is the observer
	//     and observable pattern spoke of before.
	//
	// Strategies: (Level 1)   (Level 2)
	//  Naked SET: Pair        Triple & Quad
	//   A set of Cells having the same number of cells as the number of
	//   matching set of candidates will eliminate those candidates from all
	//   Cells not in that set matching candidates. It is called naked
	//   because these Cells only have these candidates, making them naked!
	//   Therefore three cells all having only candidates {5,7,9} will
	//   safely remove those candidates from the remaining Cells in the unit.
	//
	// Hidden SET: Pair        Triple & Quad
	//   A set of Cells having the same number of Cells as matching
	//   candidates that cannot be found in any other Cell in the unit
	//   may safely have any other candidates in the same Cell set
	//   excluded. It's called hidden because the selected set can have
	//   additional candidates; if fact otherwise this would be a Naked
	//   set as described above.
	//   Therefore when three Cells include candidates {2,4,6} as well
	//   as other candidates and they {2,4,6} cannot be found in any
	//   other Cells the remaining candidates may safely be excluded from
	//   the Hidden candidate Cell set.
	//

	public Unit( ArrayList<Cell> content )
	{
		this.cells = content;

		if ( content.size() != 9 )
		{
			throw new Error("Content size incorrect");
		}

		for ( int i = 0 ; i < 9 ; i++ )
		{
			setObservers( i, content );
		}
	}

	// Cells are 1-9
	// value are 1-9
	public void is( int cell, int caldidate )
	{
		if ( cell > 0 && cell < 10 && caldidate > 0 && caldidate < 10 )
		{
			cells.get( cell-1 ).is( caldidate );
		}

		// Lets turn off "all the time" auto solve.
		//	solve();
    }

	public boolean isSolved()
	{
		boolean solved = true;

		for ( Cell cell : cells )
		{
			if (cell.isUndetermined())
			{
				solved = false;
				break;
			}
		}

		return solved;
    }

	public boolean isBroken()
	{
		boolean broken = false;
		ArrayList<ArrayList<Cell>> distribution = new ArrayList<ArrayList<Cell>>(9);

		for ( int i = 1 ; i < 10 ; i++ ) { distribution.add(new ArrayList<Cell>(1)); }

		for ( Cell cell : cells )
		{
			if ( cell.isUndetermined() ) { continue; }
			distribution.get( cell.getValue() - 1 ).add( cell );
		}

		for ( ArrayList<Cell> val : distribution )
		{
			if ( val.size() > 1 )
			{
				broken = true;
				for ( Cell cell : val )
				{
					cell.showError();
				}
			}
		}

		if ( broken )
			System.out.println(this.toStringII());

		return broken;
	}


	// Exclude
	public void exclude( int cell, int candidate )
	{
		if ( cell > 0 && cell < 10 && candidate > 0 && candidate < 10 )
		{
			cells.get( cell - 1 ).exclude( candidate );
		}
	}


	// A Level 0 Strategy
	//  Unique: A candidate can be found in only one units Cell.
	//          That candidate solves the "Unique" Cell. All other
	//          candidates are removed.
	public boolean strategy_unique()
	{
		int	solved = 0;

		UNIQUE:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			//  its a waste of time looking at stuff that is already solved
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// Everything has been solved
			if ( setOfUndeterminedCells.size() < 1 ){ break UNIQUE; }

			// Mark cells with a unique member with is()
			int[] counts = {0,0,0,0,0,0,0,0,0};
			Cell[] cindx = new Cell[9];

			// Collect Counts
			for ( Cell c : setOfUndeterminedCells )
			{
				for ( Integer cellx : c.getSet())
				{
					int p = cellx.intValue();
					counts[p-1]++;     // Candidate was seen

					// The last Cell with this candidate
					// Also the one and only if count == 1
					cindx[p-1] = c;
				}
			}

			// Unique uses
			for ( int i = 0 ; i < 9 ; i++ )
			{
				// We have a candidate with a count of one
				if ( counts[i] == 1 )
				{
					// Solve the Cell with the unique candidate
					if ( DEBUG )
						System.out.println("# Strategy 0 - Unique (" + cindx[i].getName() + ")");
					cindx[i].is( i + 1 );
				}
			}
		}

		return solved > 0;
    }

	// A Level 1 Strategy
	//  Naked Pair: The set of identical candidates found in a
	//       pair of cell may safely remove those candidates
	//       from all other unsolved cells in the Unit.
	public boolean strategy_set_naked_pair()
	{
		int removed = 0;

		NAKED_PAIR:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			//  its a waste of time looking at stuff that is already solved
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// No point in looking for pairs when there are less than four Cells
			// to compare! Basically if two Cells match the third will always be unique
			// and solved using the Unique Strategy.
			if ( setOfUndeterminedCells.size() < 4 ){ break NAKED_PAIR; }

			ArrayList<CandidateMatch> match = new ArrayList<CandidateMatch>(2);

			for ( Cell cell : setOfUndeterminedCells )
			{
				if ( cell.getSize() == 2 )
				{
					ADD:
					{
					for ( CandidateMatch candidate : match )
					{
						if ( candidate.first.getSet().containsAll(cell.getSet()))
						{
							candidate.all.add(cell);
							break ADD;
						}
					}

					CandidateMatch candidate = new CandidateMatch(4);
					candidate.first = cell;
					candidate.all.add(cell);
					match.add(candidate);
					}
				}
			}

			// Inspect set for naked pairs
			for ( CandidateMatch candidate : match )
			{
				//	System.out.println("# " + candidate.first.toString2());
				if ( candidate.all.size() == 2 )
				{
					boolean naked = false;

					// We have a winner
					for ( Cell cell : setOfUndeterminedCells )
					{
						if ( candidate.all.contains(cell))
						{
							continue;
						}

						for ( Integer N : candidate.first.getSet())
						{
							if ( ! naked && cell.includes(N))
							{
								naked = true;
								if ( DEBUG )
									System.out.println("# Strategy 1 - Naked  Pair " + candidate );
							}
							if ( cell.exclude(N)) { removed++; }
						}
					}
				}
			}
		}

		return removed > 0;
    }

	// A level 1 Strategy
	// Hidden Pair: Exactly one pair of cells contain two matching candidates
	//   not found in any other Cells. The the candidate set are the solutions for these
	//   pair of cells. All other candidates in this Cell set may be removed. This pair
	//   which was "Hidden" now becomes A "Naked" pair; however we already know that these
	//   candidates are not in any other Cells so no further action is required
	public boolean strategy_set_hidden_pair()
	{
		int removed = 0;

		HIDDEN:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			//  its a waste of time looking at stuff that is already solved
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// No point in looking for pairs when there are less than three Cells
			// to compare! Basically if the last two match, so what! There are only two
			// candidates remaining so there is nothing to do
			if ( setOfUndeterminedCells.size() < 3 ){ break HIDDEN; }

			// Map each candidate to the Cells that have it
			ArrayList<ArrayList<Cell>> mapOfVals2Cells = new ArrayList<ArrayList<Cell>>(9);

			for ( int i = 0 ; i < 9 ; i++ )
			{ mapOfVals2Cells.add(new ArrayList<Cell>(9)); }

			for ( Cell cell_undetermined : setOfUndeterminedCells )
			{
				for ( Integer candidate : cell_undetermined.getSet())
				{
					// Candidate of this cell
					mapOfVals2Cells.get( candidate - 1 ).add( cell_undetermined );
				}
			}

			// We're looking for Hidden Pairs, they are seen as two candidates
			//   having the same set set of two Cells; the two candidates can't
			//   be found any where else so we can make these Cells A "Naked"
			//   pair

			Iterator<ArrayList<Cell>> Ai = mapOfVals2Cells.iterator();
			int Apos = 0;

			while ( Ai.hasNext())
			{
				ArrayList<Cell> A = Ai.next(); Apos++;
				//	System.out.println("# " + Apos + ":" + getCellNames(A));

				Iterator<ArrayList<Cell>> Bi = mapOfVals2Cells.iterator();
				int Bpos = 0;

				// A bit of magic to avoid comparing the same pairs twice!
				// Skip the pairs we've seen before moving Bi just past Ai
				for ( int skip = 0 ; skip < Apos && Bi.hasNext() ; skip++ )
				{ Bi.next(); Bpos++; }

				// We're now pointing at the first Cell past Ai or this is the end
				//  test each Bi with the current Ai if we're not at the end
				while ( Bi.hasNext())
				{
					ArrayList<Cell> B = Bi.next(); Bpos++;

					// PAIRS
					// Candidate A is found in two cells &&
					// Candidate B is found in two cells &&
					// and its the same two cells
					if ( A.size() == 2 && B.size() == 2 && A.containsAll(B))
					{
						// Nothing to clean up?
						if ( A.get(0).getSize() == 2 && B.get(1).getSize() == 2) { continue; }

						if ( DEBUG )
							System.out.println("# Strategy 1 - Hidden Pair (" +
								A.get(0).getName() + "," +
								A.get(1).getName() +
								")" );

						// Clean up
						for ( Cell cell : A )
						{
							for ( Integer N : cell.getSet() )
							{
								if ( N == Apos || N == Bpos ){ continue; }
								if ( cell.exclude(N)) { removed++; }
							}
						}
					}
				}
			}
		}

		if ( removed > 0  && DEBUG )
			System.out.println("# Strategy 1 - Hidden Pair cleaned " + removed + " candidates");

		return removed > 0;
    }

	// A Level 2 Strategy
	//  Naked Triple(Quad): A set of identical candidates found in a
	//       in a set of Cells of the same size. I.E exactly three cells
	//		 have the same set of three candidates. OR exactly four cells
	//       have the same set of four candidates.
	//       The candidates of the matching cells may safely be removed
	//       from all other unsolved cells in the Unit.
	public boolean strategy_set_naked_triple()
	{
		int removed = 0;

		NAKED_TRIPLE:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// No point in looking for quad when there are less than six Cells
			// to compare! Basically if four Cells match the fifth will always be unique
			// and solved using the Unique Strategy. It could be a naked five-some but thats
			// very rare and will very likely show up as a simpler strategy
			if ( setOfUndeterminedCells.size() < 5 ){ break NAKED_TRIPLE; }

			ArrayList<CandidateMatch> match = new ArrayList<CandidateMatch>(2);

			for ( Cell cell : setOfUndeterminedCells )
			{
				if ( cell.getSize() == 3 )
				{
					ADD:
					{
					for ( CandidateMatch candidate : match )
					{
						if ( candidate.first.getSet().containsAll(cell.getSet()))
						{
							candidate.all.add(cell);
							break ADD;
						}
					}

					CandidateMatch candidate = new CandidateMatch(4);
					candidate.first = cell;
					candidate.all.add(cell);
					match.add(candidate);
					}
				}
			}

			// Inspect set for naked Quad's
			for ( CandidateMatch candidate : match )
			{
				//	System.out.println("# " + candidate.first.toString2());
				if ( candidate.all.size() == 3 )
				{
					boolean naked = false;
					// We have a winner
					for ( Cell cell : setOfUndeterminedCells )
					{
						if ( candidate.all.contains(cell))
						{
							continue;
						}

						for ( Integer N : candidate.first.getSet())
						{
							if ( ! naked && cell.includes(N))
							{
								naked = true;
								if ( DEBUG )
									System.out.println("# Strategy 2 - Naked Triple " + candidate );
							}

							if ( cell.exclude(N)) { removed++; }
						}
					}
				}
			}
		}

		if ( removed > 0 && DEBUG )
			System.out.println("# Strategy 2 - Naked Triple cleaned " + removed + " candidates");

		return removed > 0;
	}

	public boolean strategy_set_naked_quad()
	{
		int removed = 0;

		NAKED_QUAD:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			//  its a waste of time looking at stuff that is already solved
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// No point in looking for quad when there are less than six Cells
			// to compare! Basically if four Cells match the fifth will always be unique
			// and solved using the Unique Strategy. It could be a naked five-some but thats
			// very rare and will very likely show up as a simpler strategy
			if ( setOfUndeterminedCells.size() < 6 ){ break NAKED_QUAD; }

			ArrayList<CandidateMatch> match = new ArrayList<CandidateMatch>(2);

			for ( Cell cell : setOfUndeterminedCells )
			{
				if ( cell.getSize() == 4 )
				{
					ADD:
					{
					for ( CandidateMatch candidate : match )
					{
						if ( candidate.first.getSet().containsAll(cell.getSet()))
						{
							candidate.all.add(cell);
							break ADD;
						}
					}

					CandidateMatch candidate = new CandidateMatch(4);
					candidate.first = cell;
					candidate.all.add(cell);
					match.add(candidate);
					}
				}
			}

			// Inspect set for naked Quad's
			for ( CandidateMatch candidate : match )
			{
				//	System.out.println("# " + candidate.first.toString2());
				if ( candidate.all.size() == 4 )
				{
					boolean naked = false;
					// We have a winner
					for ( Cell cell : setOfUndeterminedCells )
					{
						if ( candidate.all.contains(cell))
						{
							continue;
						}

						for ( Integer N : candidate.first.getSet())
						{
							if ( ! naked && cell.includes(N))
							{
								naked = true;
								if ( DEBUG )
									System.out.println("# Strategy 2 - Naked Quad " + candidate );
							}
							if ( cell.exclude(N)) { removed++; }
						}
					}
				}
			}
		}

		if ( removed > 0 && DEBUG )
			System.out.println("# Strategy 2 - Naked Quad cleaned " + removed + " candidates");

		return removed > 0;
    }

	// A Level 2 Strategy
	//  Hidden Triple(Quad): Three candidates are found only in three Cells. These calls
	//     have other candidates which may safely be eliminated as candidates because
	//     the three unique candidate set "will" solve the three cells.
	public boolean strategy_set_hidden_triple()
	{
		int removed = 0;

		HIDDEN:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			//  its a waste of time looking at stuff that is already solved
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// No point in looking for triple's when there are less than four Cells
			// to compare!
			if ( setOfUndeterminedCells.size() < 4 ){ break HIDDEN; }

			// Map each candidate to the Cells that have it
			ArrayList<ArrayList<Cell>> mapOfVals2Cells = new ArrayList<ArrayList<Cell>>(9);

			for ( int i = 0 ; i < 9 ; i++ )
			{ mapOfVals2Cells.add(new ArrayList<Cell>(9)); }

			for ( Cell cell_undetermined : setOfUndeterminedCells )
			{
				for ( Integer candidate : cell_undetermined.getSet())
				{
					// Candidate of this cell
					mapOfVals2Cells.get(candidate-1).add(cell_undetermined);
				}
			}

			// We're looking for Hidden Triple's, they are seen as three candidates
			//   having the same set set of three Cells; the three candidates can't
			//   be found any where else so we can make these Cells A "Naked"
			//   triple by removing any other candidates safely because the candidate
			//   triple solved the three cell set.

			Iterator<ArrayList<Cell>> Ai = mapOfVals2Cells.iterator();
			int Apos = 0;

			while ( Ai.hasNext())
			{
				ArrayList<Cell> A = Ai.next(); Apos++;
				//	System.out.println("# " + Apos + ":" + getCellNames(A));

				Iterator<ArrayList<Cell>> Bi = mapOfVals2Cells.iterator();
				int Bpos = 0;

				// A bit of magic to avoid comparing the same candidate sets
				// Skip the combo's we've seen before moving Bi just past Ai
				for ( int skip = 0 ; skip < Apos && Bi.hasNext() ; skip++ )
				{ Bi.next(); Bpos++; }

				// We're now pointing at the first Cell past Ai or this is the end
				//  test each Bi with the current Ai if we're not at the end
				while ( Bi.hasNext())
				{
					ArrayList<Cell> B = Bi.next(); Bpos++;

					Iterator<ArrayList<Cell>> Ci = mapOfVals2Cells.iterator();
					int Cpos = 0;

					// A bit of magic to avoid comparing the same candidate sets
					for ( int skip = 0 ; skip < Bpos && Ci.hasNext() ; skip++ )
					{ Ci.next(); Cpos++ ; }

					while ( Ci.hasNext())
					{
						ArrayList<Cell> C = Ci.next(); Cpos++;

						// Candidate A is found in three cells &&
						// Candidate B is found in three cells &&
						// Candidate C is found in three cells &&
						// and its the same three cells
						if ( A.size() == 3 && B.size() == 3 && C.size() == 3 &&
								A.containsAll(B) && A.containsAll(C))
						{
							// Nothing to clean up?
							if ( A.get(0).getSize() == 3 &&
								 B.get(1).getSize() == 3 &&
								 C.get(2).getSize() == 3 )
							{ continue; }

							ArrayList<Integer> p = new ArrayList<Integer>(3);
							p.add(Apos); p.add(Bpos); p.add(Cpos);

							if ( DEBUG )
								System.out.println("# Strategy 2 - Hidden Triple (" +
									A.get(0).getName() + "," +
									A.get(1).getName() + "," +
									A.get(2).getName() +
									") " + p );

							// Clean up unwanted candidates from the hidden triple
							for ( Cell cell : A )
							{
								for ( Integer N : cell.getSet() )
								{
									if ( N == Apos || N == Bpos || N == Cpos ){ continue; }
									if ( cell.exclude(N)) { removed++; }
								}
							}
						}
					}
				}
			}
		}

		if ( removed > 0 && DEBUG )
			System.out.println("# Strategy 2 - Hidden Triple cleaned " + removed + " candidates");

		return removed > 0;
	}

	public boolean strategy_set_hidden_quad()
	{
		int removed = 0;

		HIDDEN:
		{
			// We only need to work with those Cells that are undetermined (not solved)
			//  its a waste of time looking at stuff that is already solved
			ArrayList<Cell> setOfUndeterminedCells = getUndeterminedCellList();

			if ( show_undetermined )
			{ System.out.println("# Undetermined Cells: " + getCellNames(setOfUndeterminedCells)); }

			// No point in looking for quad's when there are less than five Cells
			// to compare!
			if ( setOfUndeterminedCells.size() < 5 ) { break HIDDEN; }

			// Map each candidate to the Cells that have it
			ArrayList<ArrayList<Cell>> mapOfVals2Cells = new ArrayList<ArrayList<Cell>>(9);

			for ( int i = 0 ; i < 9 ; i++ )
			{ mapOfVals2Cells.add(new ArrayList<Cell>(9)); }

			for ( Cell cell_undetermined : setOfUndeterminedCells )
			{
				for ( Integer candidate : cell_undetermined.getSet())
				{
					// Candidate of this cell
					mapOfVals2Cells.get( candidate - 1 ).add( cell_undetermined );
				}
			}

			// We're looking for Hidden Quad'sple's, they are seen as four candidates
			//   having the same set set of four Cells; the quad candidates can't
			//   be found any where else so we can make these Cells A "Naked"
			//   quad by removing any other candidates safely because the candidate
			//   quad solves the quad cell set.

			Iterator<ArrayList<Cell>> Ai = mapOfVals2Cells.iterator();
			int Apos = 0;

			while ( Ai.hasNext())
			{
				ArrayList<Cell> A = Ai.next(); Apos++;
				//	System.out.println("# " + Apos + ":" + getCellNames(A));

				Iterator<ArrayList<Cell>> Bi = mapOfVals2Cells.iterator();
				int Bpos = 0;

				// A bit of magic to avoid comparing the same candidate sets
				// Skip the combo's we've seen before moving Bi just past Ai
				for ( int skip = 0 ; skip < Apos && Bi.hasNext() ; skip++ )
				{ Bi.next(); Bpos++; }

				// We're now pointing at the first Cell past Ai or this is the end
				//  test each Bi with the current Ai if we're not at the end
				while ( Bi.hasNext())
				{
					ArrayList<Cell> B = Bi.next(); Bpos++;

					Iterator<ArrayList<Cell>> Ci = mapOfVals2Cells.iterator();
					int Cpos = 0;

					// A bit of magic to avoid comparing the same candidate sets
					for ( int skip = 0 ; skip < Bpos && Ci.hasNext() ; skip++ )
					{ Ci.next(); Cpos++ ; }

					while ( Ci.hasNext())
					{
						ArrayList<Cell> C = Ci.next(); Cpos++;

						Iterator<ArrayList<Cell>> Di = mapOfVals2Cells.iterator();
						int Dpos = 0;

						// A bit of magic to avoid comparing the same candidate sets
						for ( int skip = 0 ; skip < Cpos && Di.hasNext() ; skip++ )
						{ Di.next(); Dpos++ ; }

						while ( Di.hasNext())
						{
							ArrayList<Cell> D = Di.next(); Dpos++;

							// Candidate A is found in four cells &&
							// Candidate B is found in four cells &&
							// Candidate C is found in four cells &&
							// Candidate D is found in four cells &&
							// and its the same four cells
							if ( A.size() == 4 && B.size() == 4 && C.size() == 4 && D.size() == 4 &&
									A.containsAll(B) && A.containsAll(C) && A.containsAll(D))
							{
								// Nothing to clean up?
								if (	A.get(0).getSize() == 4 &&
										B.get(1).getSize() == 4 &&
										C.get(2).getSize() == 4 &&
										D.get(3).getSize() == 4 )
								{ continue; }

								ArrayList<Integer> p = new ArrayList<Integer>(4);
								p.add(Apos); p.add(Bpos); p.add(Cpos); p.add(Dpos);

								if ( DEBUG )
									System.out.println("# Strategy 2 - Hidden Quad (" +
										A.get(0).getName() + "," +
										A.get(1).getName() + "," +
										A.get(2).getName() + "," +
										A.get(3).getName() +
										") " + p );

								// Clean up unwanted candidates from the hidden triple
								for ( Cell cell : A )
								{
									for ( Integer N : cell.getSet() )
									{
										if ( N == Apos || N == Bpos || N == Cpos || N == Dpos )
										{ continue; }
										if ( cell.exclude(N)) { removed++; }
									}
								}
							}
						}
					}
				}
			}
		}

		if ( removed > 0  && DEBUG )
			System.out.println("# Strategy 2 - Hidden Quad cleaned " + removed + " candidates");

		return removed > 0;
	}

	private ArrayList<String> getCellNames(ArrayList<Cell> list)
	{
		ArrayList<String> names = new ArrayList<String>(list.size());

		for ( Cell cell : list){ names.add(cell.getName()); }
		return names;
	}

	private ArrayList<Cell> getUndeterminedCellList()
	{
		ArrayList<Cell> set = new ArrayList<Cell>(9); // Nine Possible
		for ( Cell cell : cells ) { if (cell.isUndetermined()) { set.add(cell); }}
		return set;
	}

	public void solve()
	{
		strategy_unique();
		strategy_set_naked_pair();
		strategy_set_hidden_pair();
		strategy_set_naked_triple();
		strategy_set_naked_quad();
	}

	public void reset()
	{
		for ( Cell cell : cells ) { cell.reset(); }
	}

	public String toString()
	{
		String s = "";
		Iterator<Cell> i = cells.iterator();

		while ( i.hasNext())
		{
			s += i.next().toString2() + "\n";
		}

		return s;
	}

	public String toStringII()
	{
		String s = "";
		Iterator<Cell> i = cells.iterator();

		while ( i.hasNext())
		{
			Cell c = i.next();
			s += c.isKnown() ? " " + Integer.toString(c.getValue()) : " ?";
		}
		s += "\n";

		return s;
	}

	public String toStringIII()
	{
		String s = "";

		for ( Cell c : cells)
		{
			s += "|  " + (c.isKnown() ? Integer.toString(c.getValue()) : " " ) + "  ";
		}

		return s + "|\n";
	}

	public String toStringLine()
	{
		char [][] map = {
				{' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
			,	{' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
			,	{' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
		};

		int x = 1, y = 1;

		for ( Cell c : cells)
		{
			if ( c.isKnown() )
			{
			//	System.out.println("# known - " + c.toString2());
				map[y][x-1] = '[';
				map[y][x  ] = (""+c.getValue()).charAt(0);
				map[y][x+1] = ']';
			}
			else
			{
				for ( Integer I : c.getSet() )
				{
					switch ( I )
					{
					case 1: map[y-1][x-1] = '1'; break;
					case 2: map[y-1][x  ] = '2'; break;
					case 3: map[y-1][x+1] = '3'; break;
					case 4: map[y  ][x-1] = '4'; break;
					case 5: map[y  ][x  ] = '5'; break;
					case 6: map[y  ][x+1] = '6'; break;
					case 7: map[y+1][x-1] = '7'; break;
					case 8: map[y+1][x  ] = '8'; break;
					case 9: map[y+1][x+1] = '9';
					}
				}
			}

			// Next Cell alignment
			x += 3;
		}

		String s = "+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n";

		for ( y = 0 ; y < 3 ; y++ )
		{
			for ( x = 0 ; x < 27 ; x++ )
			{
				if ( x % 3 == 0 )
					s += "| ";
				s += "" + map[y][x];
				if ( x % 3 == 2 )
					s += " ";
				if ( x == 26 )
					s += "|\n";
			}

			if ( y == 2 )
				s += "+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n";
		}

		return s;
	}

	public String toStringName() { return this.getCellNames(cells).toString(); }


	public static void main(String args[])
	{
		ArrayList<Cell> members = new ArrayList<Cell>(9);

		for ( int i = 1 ; i < 10 ; i++ )
		{
			members.add( new Cell( "C" + Integer.toString(i), new Point(1,i)));
		}

		Cell c = members.get(0);

		Unit unit = new Unit(members);
		unit.showUndetermined();

		c = members.get(1);
		System.out.println("# Observers : " + Integer.toString(c.countObservers()));

		unit.is(1,5);

		//	System.out.print(unit.toString());

		unit.is(4, 8);
		unit.is(9, 1);
		unit.is(8, 3);
		unit.is(6, 9);
		unit.is(2, 6);
		unit.is(7, 4);
		unit.is(5, 7);

	//	System.out.print(unit.toString());

		// Naked pair
		unit.reset();
		unit.is(9, 9);
	//	System.out.print(unit.toString());
	//	System.out.println(c.toString2());

		for ( int i = 1 ; i < 7 ; i++ )
		{
			unit.exclude(4, i);
			unit.exclude(5, i);
		}

	//	System.out.print(unit.toString());
		unit.strategy_set_naked_pair();
	//	System.out.print(unit.toString());

		// Hidden Pair
	//	System.out.println("# ---------------------");
	//	System.out.println("# strategy_set_hidden_pair()");

		unit.exclude(3, 3); unit.exclude(3, 4);
		unit.exclude(6, 3); unit.exclude(6, 4);
		unit.exclude(7, 3); unit.exclude(7, 4);
		unit.exclude(8, 3); unit.exclude(8, 4);

	//	System.out.print(unit.toString());
	//	System.out.print("# unit:" + unit.toStringII());
		unit.strategy_set_hidden_pair();
	//	System.out.print(unit.toString());
	//	System.out.print("# unit:" + unit.toStringII());

		// Unique
	//	System.out.println("# ---------------------");
	//	System.out.println("# strategy_unique()");
		unit.exclude(6, 1);
		unit.exclude(7, 1);
		unit.exclude(8, 1);
	//	System.out.print(unit.toString());
	//	System.out.print("# unit:" + unit.toStringII());
		unit.strategy_unique();
	//	System.out.println("# ---------------------");
	//	System.out.print(unit.toString());
	//	System.out.print("# unit:" + unit.toStringII());

		unit.reset();
		for ( int x = 1 ; x < 10 ; x+=2 )
		{
			int cnt = 4;
			for ( Cell cell : unit.getCells())
			{
				cell.exclude(x);
				cnt--;
				if ( cnt < 1 ) { break; }
			}
		}
		unit.strategy_set_naked_quad();
	//	System.out.print(unit.toString());

		int cnt = 7;
		for ( Cell cell : unit.getCells())
		{
			cnt--;
			if ( cnt > 0 ){ continue; }
			cell.exclude(1);
			cell.exclude(6);
			cell.exclude(9);
		}
	//	System.out.print(unit.toString());
		unit.strategy_set_naked_triple();
	//	System.out.print(unit.toString());

		// Hidden Tripple
		unit.reset();
		for ( int i=1 ; i < 7 ; i++ )
		{
			unit.exclude(i, 4);
			unit.exclude(i, 5);
			unit.exclude(i, 6);
		}
		unit.strategy_set_hidden_triple();

		// Hidden Quad
		for ( int i=1 ; i < 3 ; i++ )
		{
			unit.exclude(i, 2);
			unit.exclude(i, 3);
			unit.exclude(i, 7);
			unit.exclude(i, 8);
		}
		unit.strategy_set_hidden_quad();

		System.out.print(unit.toString());
	}

	// Setup a cell with all its observers
	// (used by the constructor)
	protected static void setObservers(int idx, ArrayList<Cell> lst )
	{
		// Iterators are used so we don't try and observe ourself.
		Cell observer = lst.get(idx);
		Iterator<Cell> observable = lst.iterator();

		while ( observable.hasNext())
		{
			Cell target = observable.next();

			// Observe everyone but ourself
			if ( target != observer)
			{
				observer.addObserver( target );
			}
		}
	}

	public class CandidateMatch
	{
		public Cell				first;
		public ArrayList<Cell>	all;

		CandidateMatch(int size)
		{
			all = new ArrayList<Cell>(size);
		}

		public String toString()
		{
			String str = "(";
			boolean first = true;
			for ( Cell cell : all )
			{
				str += (first ? "" : "," ) + cell.getName();
				first = false;
			}
			str += ")";
			return str;
		}
	}

	public final ArrayList<Cell> getCells() { return cells; }
	public void showUndetermined() { show_undetermined = true; }
	public void hideUndetermined() { show_undetermined = false; }

	// Protected variables (Block extends us)
	protected ArrayList<Cell>	cells;
	protected boolean			show_undetermined;
}

// vim: expandtab number tabstop=2
// END
