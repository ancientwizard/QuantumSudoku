
//
// Sudoku Cell Unit Model
//

import type { iUnit         } from '@/js/interface/iUnit'
import type { CellValue     } from '@/js/model/CellValue'
import type { CellIndex     } from '@/js/model/CellIndex'
import type { CellModel     } from '@/js/model/CellModel'


export
class UnitModel<TCell extends CellModel = CellModel> implements iUnit
{
    // The Unit is the second logical layer in our implementation of the
    // Sudoku Solver. The Sudoku puzzle is made up of nine (9) 3x3 grids
    // we'll call a box as well as nine (9) columns and nine (9) rows.
    // Therefore each Cell is a member of three basic units.
    //  - a box
    //  - a column and
    //  - a row
    // Each of these units have Sudoku rules (logic-laws) they must
    // adhere too no matter how they are organized visually within a
    // puzzle. Such rules do not care if the nine cells form a row,
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

    // Our Cell set of nine (9) Cells
    protected cells: Array<TCell>

    constructor ( member_cells: Array<TCell> )
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

    private static setObservers<TCell extends CellModel = CellModel> ( member_cells: Array<TCell> ) : void
    {
        member_cells.forEach( subject => {
            member_cells.forEach( observer => {
                subject != observer && subject.includeObserver( observer );
            })
        })
    }

    public get as_cell_array () : Array<TCell> { return [...this.cells] }

    // Exclude
    public exclude ( cell: CellIndex, candidate: CellValue ) : boolean
    {
        return this.cells[ cell.index ].exclude( candidate );
    }

    public is ( cell: CellIndex, candidate: CellValue ) : boolean
    {
        return this.cells[ cell.index ].is( candidate );
    }

    public get isSolved () : boolean
    {
        // When all Unit cell members are KNOWN then this unit is-solved
        //  The first UNKNOWN is our clue
        return this.cells.find( cell => cell.isUnknown ) === undefined
    }

    public get isBroken () : boolean
    {
        let broken = false

        //  1. Return true  if known cell duplicates are found
        //  2. Return true  if one or more values are excluded from all cells
        //  3. otherwise return false

        // 1. Cells having the same known value. ->is(X)
        //  This should not be possible in a valid Sudoku puzzle
        const distribution : Array<Array<TCell>> = new Array(9).fill(0).map( () => new Array(0) )

        this.cells.forEach( cell => {
            if ( cell.isUnknown ) return
            distribution[ cell.value - 1 ].push( cell )
        })

        distribution.forEach( val => {
            if ( val.length > 1 ) {
                broken = true
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

    public forEachCell ( callback: (cell: TCell, index: number) => void ) : void
    {
        this.cells.forEach(( cell, idx ) => { callback( cell, idx ) })
    }

    public reset() : void
    {
        this.cells.forEach( c  => { c.reset() })
    }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
