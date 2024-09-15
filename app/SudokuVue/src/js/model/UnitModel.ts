
//
// Sudoku Unit Model
//

import type { iUnit         } from '@/js/interface/iUnit'
import type { CellValue     } from '@/js/model/CellValue'
import type { CellIndex     } from '@/js/model/CellIndex'
import type { CellModel     } from '@/js/model/CellModel'

export
class UnitModel implements iUnit
{
    static DEBUG = false;

    // The Unit is the second logical layer in our implementation of the
    // Sudoku Solver. The Sudoku puzzle is made up of nine (9) 3x3 grids
    // we'll call a block as well as nine (9) columns and nine (9) rows.
    // Therefore each Cell is a member of three basic units.
    //  - a block
    //  - a column and
    //  - a row
    // Each of these units have Sudoku rules (logic/laws) they must
    // adhere too no matter how they are organized visually within a
    // puzzle. Such rules do not care if the nine cells are in a row,
    // a column or a 3x3 grid. Therefore rules and hence the Strategies
    // applied to them are the same.
    //
    // Each is simple: a set of nine cells and their order
    // or position within the set do not matter. Our implementation
    // keeps them as an ordered set for convenience but otherwise is
    // not important for solving the puzzle within this logic layer.
    //
    // The Unit uses the Observer design pattern provided by Cell.
    //  Therefore the moment a Cell has eliminated all but one candidate
    //   (knows it can only be that las remaining value)
    //  the Cell communicates this change to every other Cell that is
    //  an observer of that Cell. You can quickly see how it will
    //  notify all of its observers in this unit and all other units it
    //  is a member of. It essentially ripples throughout the puzzle.
    //
    // The UNIT employs those Strategies based on a single unit of Cells
    //  can be imposed on one another. Each strategy tries to eliminate
    //  candidates in an attempt to trigger a Cell into knowing its
    //  final value and further eliminating candidates from other cells.
    //  If you've solved many Sudoku puzzles you know that most often
    //  you're eliminating possibilities more othen than saying
    //  "look that one is a 5"
    //
    // Strategies: (Level 0)
    //  Unique: A candidate can be found in only one of the unit's cells.
    //          That candidate solves the "Unique" Cell. (hidden single)
    //
    //  Clean-up: A solved Cell tells the other cells within its influence
    //    they can remove it's solution as a candidate. This is implemented
    //    in the Cell however the neighbors are defined in a Unit.
    //    Together Unit
    //     and Cell work together to produce the cleanup. This is the observer
    //     and observable pattern spoke of before.
    //
    // Strategies: (Level 1)   (Level 2)
    //  Naked SET: Pair        Triple & Quad
    //   A set of Cells having the same number of cells as the number of
    //   matching set of candidates will eliminate those candidates from all
    //   Cells not in that set matching candidates. This is called naked
    //   because these Cells only have these candidates, making them naked!
    //   Therefore three cells all having only candidates {5,7,9} will
    //   safely remove those candidates from the remaining Cells in the unit.
    //
    // Hidden SET: Pair        Triple & Quad
    //   A set of Cells having the same number of Cells as matching
    //   candidates that cannot be found in any other Cell in the unit
    //   may safely have any other candidates in the same Cell set
    //   excluded. It's called hidden because the selected set can have
    //   additional candidates; otherwise this would be a Naked
    //   set as described above.
    //   Therefore when three Cells include candidates {2,4,6} as well
    //   as other candidates and they {2,4,6} cannot be found in any
    //   other Cells in the remaining candidates may safely be excluded from
    //   the Hidden candidate Cell set.
    //

    // Protected variables (Block etc extends us)
    protected cells: Array<CellModel>
    protected show_undetermined: boolean

    constructor ( content: Array<CellModel> )
    {
    //  console.log(CellModel.factory(0,0))
        this.cells = content
        this.show_undetermined = false

        if ( content.length != 9 )
        {
            throw new Error("Content size incorrect");
        }

        UnitModel.setObservers( content );
    }

	// Configure cell "unit members" with its observers
	// (used by the constructor)

    private static setObservers ( lst: Array<CellModel> ) : void
    {
        lst.forEach( subject => {
            lst.forEach( observer => {
                subject != observer && subject.includeObserver( observer );
            })
        })
    }

//  public final ArrayList<Cell> getCells() { return cells; }
//  public void showUndetermined() { show_undetermined = true; }
//  public void hideUndetermined() { show_undetermined = false; }


	// Exclude
    exclude ( cell: CellIndex, candidate: CellValue ) : boolean
    {
        return this.cells[ cell.index ].exclude( candidate );
    }


    is ( cell: CellIndex, candidate: CellValue ) : boolean
    {
        return this.cells[ cell.index ].is( candidate );
    }

    isSolved () : boolean
    {
        // console.log( this.cells.find( cell => cell.isUnknown ))
        // When all Unit cell members KNOWN then this unit is-solved
        //  The first UNKNOWN is our clue
        return this.cells.find( cell => cell.isUnknown ) === undefined
    }

    isBroken () : boolean
    {
        var broken : boolean = false;

        // I performed this CHECK IN Java; however
        //  this implementation *may* make this unnecessary TBD OR not!

//		ArrayList<ArrayList<Cell>> distribution = new ArrayList<ArrayList<Cell>>(9);

//		for ( int i = 1 ; i < 10 ; i++ ) { distribution.add(new ArrayList<Cell>(1)); }

//		for ( Cell cell : cells )
//		{
//			if ( cell.isUndetermined() ) { continue; }
//			distribution.get( cell.getValue() - 1 ).add( cell );
//		}

//		for ( ArrayList<Cell> val : distribution )
//		{
//			if ( val.size() > 1 )
//			{
//				broken = true;
//				for ( Cell cell : val )
//				{
//					cell.showError();
//				}
//			}
//		}

//		if ( broken )
//			System.out.println(this.toStringII());

        return broken;
    }


//	private ArrayList<String> getCellNames(ArrayList<Cell> list)
//	{
//		ArrayList<String> names = new ArrayList<String>(list.size());

//		for ( Cell cell : list){ names.add(cell.getName()); }
//		return names;
//	}

//	private ArrayList<Cell> getUndeterminedCellList()
//	{
//		ArrayList<Cell> set = new ArrayList<Cell>(9); // Nine Possible
//		for ( Cell cell : cells ) { if (cell.isUndetermined()) { set.add(cell); }}
//		return set;
//	}

//	public void solve()
//	{
//		strategy_unique();
//		strategy_set_naked_pair();
//		strategy_set_hidden_pair();
//		strategy_set_naked_triple();
//		strategy_set_naked_quad();
//	//	strategy_set_hidden_triple();   // never turn on in Java
//	//	strategy_set_hidden_quad();     // never turn on in Java
//	}

//	public void reset()
//	{
//		for ( Cell cell : cells ) { cell.reset(); }
//	}

    public toString () : string
    {
        let s : string = ""

        this.cells.forEach((c) => { s += c.toString2() + "\n" })

        return s
    }

//	public String toStringII()
//	{
//		String s = "";
//		Iterator<Cell> i = cells.iterator();

//		while ( i.hasNext())
//		{
//			Cell c = i.next();
//			s += c.isKnown() ? " " + Integer.toString(c.getValue()) : " ?";
//		}
//		s += "\n";

//		return s;
//	}

//	public String toStringIII()
//	{
//		String s = "";

//		for ( Cell c : cells)
//		{
//			s += "|  " + (c.isKnown() ? Integer.toString(c.getValue()) : " " ) + "  ";
//		}

//		return s + "|\n";
//	}

//	public String toStringLine()
//	{
//		char [][] map = {
//				{' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
//			,	{' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
//			,	{' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
//		};

//		int x = 1, y = 1;

//		for ( Cell c : cells)
//		{
//			if ( c.isKnown() )
//			{
//			//	System.out.println("# known - " + c.toString2());
//				map[y][x-1] = '[';
//				map[y][x  ] = (""+c.getValue()).charAt(0);
//				map[y][x+1] = ']';
//			}
//			else
//			{
//				for ( Integer I : c.getSet() )
//				{
//					switch ( I )
//					{
//					case 1: map[y-1][x-1] = '1'; break;
//					case 2: map[y-1][x  ] = '2'; break;
//					case 3: map[y-1][x+1] = '3'; break;
//					case 4: map[y  ][x-1] = '4'; break;
//					case 5: map[y  ][x  ] = '5'; break;
//					case 6: map[y  ][x+1] = '6'; break;
//					case 7: map[y+1][x-1] = '7'; break;
//					case 8: map[y+1][x  ] = '8'; break;
//					case 9: map[y+1][x+1] = '9';
//					}
//				}
//			}

//			// Next Cell alignment
//			x += 3;
//		}

//		String s = "+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n";

//		for ( y = 0 ; y < 3 ; y++ )
//		{
//			for ( x = 0 ; x < 27 ; x++ )
//			{
//				if ( x % 3 == 0 )
//					s += "| ";
//				s += "" + map[y][x];
//				if ( x % 3 == 2 )
//					s += " ";
//				if ( x == 26 )
//					s += "|\n";
//			}

//			if ( y == 2 )
//				s += "+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n";
//		}

//		return s;
//	}

//	public String toStringName() { return this.getCellNames(cells).toString(); }


// MOVE INTO A TEST!!!!!!!!!!

//	public static void main(String args[])
//	{
//		ArrayList<Cell> members = new ArrayList<Cell>(9);

//		for ( int i = 1 ; i < 10 ; i++ )
//		{
//			members.add( new Cell( "C" + Integer.toString(i), new Point(1,i)));
//		}

//		Cell c = members.get(0);

//		Unit unit = new Unit(members);
//		unit.showUndetermined();

//		c = members.get(1);
//		System.out.println("# Observers : " + Integer.toString(c.countObservers()));

//		unit.is(1,5);

//		//	System.out.print(unit.toString());

//		unit.is(4, 8);
//		unit.is(9, 1);
//		unit.is(8, 3);
//		unit.is(6, 9);
//		unit.is(2, 6);
//		unit.is(7, 4);
//		unit.is(5, 7);

//	//	System.out.print(unit.toString());

//		// Naked pair
//		unit.reset();
//		unit.is(9, 9);
//	//	System.out.print(unit.toString());
//	//	System.out.println(c.toString2());

//		for ( int i = 1 ; i < 7 ; i++ )
//		{
//			unit.exclude(4, i);
//			unit.exclude(5, i);
//		}

//	//	System.out.print(unit.toString());
//		unit.strategy_set_naked_pair();
//	//	System.out.print(unit.toString());

//		// Hidden Pair
//	//	System.out.println("# ---------------------");
//	//	System.out.println("# strategy_set_hidden_pair()");

//		unit.exclude(3, 3); unit.exclude(3, 4);
//		unit.exclude(6, 3); unit.exclude(6, 4);
//		unit.exclude(7, 3); unit.exclude(7, 4);
//		unit.exclude(8, 3); unit.exclude(8, 4);

//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());
//		unit.strategy_set_hidden_pair();
//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());

//		// Unique
//	//	System.out.println("# ---------------------");
//	//	System.out.println("# strategy_unique()");
//		unit.exclude(6, 1);
//		unit.exclude(7, 1);
//		unit.exclude(8, 1);
//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());
//		unit.strategy_unique();
//	//	System.out.println("# ---------------------");
//	//	System.out.print(unit.toString());
//	//	System.out.print("# unit:" + unit.toStringII());

//		unit.reset();
//		for ( int x = 1 ; x < 10 ; x+=2 )
//		{
//			int cnt = 4;
//			for ( Cell cell : unit.getCells())
//			{
//				cell.exclude(x);
//				cnt--;
//				if ( cnt < 1 ) { break; }
//			}
//		}
//		unit.strategy_set_naked_quad();
//	//	System.out.print(unit.toString());

//		int cnt = 7;
//		for ( Cell cell : unit.getCells())
//		{
//			cnt--;
//			if ( cnt > 0 ){ continue; }
//			cell.exclude(1);
//			cell.exclude(6);
//			cell.exclude(9);
//		}
//	//	System.out.print(unit.toString());
//		unit.strategy_set_naked_triple();
//	//	System.out.print(unit.toString());

//		// Hidden Tripple
//		unit.reset();
//		for ( int i=1 ; i < 7 ; i++ )
//		{
//			unit.exclude(i, 4);
//			unit.exclude(i, 5);
//			unit.exclude(i, 6);
//		}
//		unit.strategy_set_hidden_triple();

//		// Hidden Quad
//		for ( int i=1 ; i < 3 ; i++ )
//		{
//			unit.exclude(i, 2);
//			unit.exclude(i, 3);
//			unit.exclude(i, 7);
//			unit.exclude(i, 8);
//		}
//		unit.strategy_set_hidden_quad();

//		System.out.print(unit.toString());
//	}

}

// vim: expandtab number tabstop=4
// END
