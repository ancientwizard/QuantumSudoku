
//
// Sudoku Cell Unit Model
//

import type { iUnit         } from '@/js/interface/iUnit'
import type { CellValue     } from '@/js/model/CellValue'
import type { CellIndex     } from '@/js/model/CellIndex'
import type { CellModel     } from '@/js/model/CellModel'
import { stringify } from 'querystring'

export
class UnitModel implements iUnit
{
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

    constructor ( member_cells: Array<CellModel> )
    {
        this.cells = member_cells

        if ( member_cells.length != 9 )
        {
            throw new Error("Content size incorrect");
        }

        UnitModel.setObservers( member_cells );
    }

    // Configure cell "unit members" with its observers
    // (used by the constructor)

    private static setObservers ( member_cells: Array<CellModel> ) : void
    {
        member_cells.forEach( subject => {
            member_cells.forEach( observer => {
                subject != observer && subject.includeObserver( observer );
            })
        })
    }

    get as_cell_array () : Array<CellModel> { return [...this.cells] }


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
        // When all Unit cell members are KNOWN then this unit is-solved
        //  The first UNKNOWN is our clue
        return this.cells.find( cell => cell.isUnknown ) === undefined
    }

    isBroken () : boolean
    {
        let broken = false

        //  1. Return true  if known cell duplicates are found
        //  2. Return true  if one or more values are excluded from all cells
        //  3. otherwise return false

        // 1. Cells having the same known value. ->is(X)
        //  This should not be possible in a valid Sudoku puzzle
        const distribution : Array<Array<CellModel>> = new Array(9).fill(0).map( () => new Array(0) )

        this.cells.forEach( cell => {
            if ( cell.isUnknown ) return
            distribution[ cell.value - 1 ].push( cell )
        })

        distribution.forEach( val => {
            if ( val.length > 1 ) {
                broken = true
                // val.forEach( cell => { cell.showError() })
            }
        })

        //  2. Return true  if one or more values are excluded from all cells
        if ( ! broken )
        {
            // Check for excluded Cell-values from all cells
            //  (A cell-value must be seen in at least one cell
            //   in the unit OR a cells known value)
            const all_seen_values : Array<CellValue> = []

            this.cells.forEach( cell => {
                // There are candidates in the cell
                cell.as_candidate_array.forEach( candidate_value => {
                    if ( all_seen_values.indexOf( candidate_value ) === -1 )
                    {
                        all_seen_values.push( candidate_value )
                    }
                })

                // There is a known value in the cell
                if ( cell.isKnown )
                {
                    if ( all_seen_values.indexOf( cell.cv ) === -1 )
                    {
                        all_seen_values.push( cell.cv )
                    }
                }
            })

            broken = all_seen_values.length != 9
        }

        return broken;
    }


//public void solve()
//{
//strategy_unique();
//strategy_set_naked_pair();
//strategy_set_hidden_pair();
//strategy_set_naked_triple();
//strategy_set_naked_quad();
////strategy_set_hidden_triple();   // never turn on in Java
////strategy_set_hidden_quad();     // never turn on in Java
//}

    public reset() : void
    {
        this.cells.forEach( c  => { c.reset() })
    }

    public toString () : string
    {
        let s  = ""

        this.cells.forEach((c) => { s += c.toString2() + "\n" })

        return s
    }

    public toStringII () : string
    {
        return this.cells.map( m => m.label ).join(' ')
    }

    // public toStringIII() : string
    // {
    //     let s : string = ""

    //     this.cells.forEach( (c, index) => {
    //             s += "|  " + ( c.isKnown ? c.label : " " ) + "  "
    //         })

    //     return s + "|\n";
    // }

//  public String toStringLine()
//  {
//  char [][] map = {
//  {' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
//  ,   {' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
//  ,   {' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '}
//  };

//  int x = 1, y = 1;

//  for ( Cell c : cells)
//  {
//  if ( c.isKnown() )
//  {
//  //  System.out.println("# known - " + c.toString2());
//  map[y][x-1] = '[';
//  map[y][x  ] = (""+c.getValue()).charAt(0);
//  map[y][x+1] = ']';
//  }
//  else
//  {
//  for ( Integer I : c.getSet() )
//  {
//  switch ( I )
//  {
//  case 1: map[y-1][x-1] = '1'; break;
//  case 2: map[y-1][x  ] = '2'; break;
//  case 3: map[y-1][x+1] = '3'; break;
//  case 4: map[y  ][x-1] = '4'; break;
//  case 5: map[y  ][x  ] = '5'; break;
//  case 6: map[y  ][x+1] = '6'; break;
//  case 7: map[y+1][x-1] = '7'; break;
//  case 8: map[y+1][x  ] = '8'; break;
//  case 9: map[y+1][x+1] = '9';
//  }
//  }
//  }

//  // Next Cell alignment
//  x += 3;
//  }

//  String s = "+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n";

//  for ( y = 0 ; y < 3 ; y++ )
//  {
//  for ( x = 0 ; x < 27 ; x++ )
//  {
//  if ( x % 3 == 0 )
//  s += "| ";
//  s += "" + map[y][x];
//  if ( x % 3 == 2 )
//  s += " ";
//  if ( x == 26 )
//  s += "|\n";
//  }

//  if ( y == 2 )
//  s += "+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n";
//  }

//  return s;
//  }

    // public toStringName () : String { return this.getCellNames(cells).toString(); }

}

// vim: expandtab number tabstop=4
// END
