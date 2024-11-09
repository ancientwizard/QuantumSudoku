
//
// Sudoku Block Model
//

import      { UnitModel     } from '@/js/model/UnitModel'
import      { CellValue     } from '@/js/model/CellValue'

export
class BlockModel extends UnitModel
{
    static iC1: Array<CellValue> = [ CellValue.ONE,   CellValue.FOUR,   CellValue.SEVEN ] // Col 1
    static iC2: Array<CellValue> = [ CellValue.TWO,   CellValue.FIVE,   CellValue.EIGHT ] // Col 2
    static iC3: Array<CellValue> = [ CellValue.THREE, CellValue.SIX,    CellValue.NINE  ] // Col 3
    static iR1: Array<CellValue> = [ CellValue.ONE,   CellValue.TWO,    CellValue.THREE ] // Row 1
    static iR2: Array<CellValue> = [ CellValue.FOUR,  CellValue.FIVE,   CellValue.SIX   ] // Row 2
    static iR3: Array<CellValue> = [ CellValue.SEVEN, CellValue.EIGHT,  CellValue.NINE  ] // Row 3

/*
    constructor ( member_cells: Array<CellModel> )
    {
        this.super( member_cells )
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
        const broken  = false;

        // I performed this CHECK IN Java; however
        //  this implementation *may* make this unnecessary TBD OR not!

//ArrayList<ArrayList<Cell>> distribution = new ArrayList<ArrayList<Cell>>(9);

//for ( int i = 1 ; i < 10 ; i++ ) { distribution.add(new ArrayList<Cell>(1)); }

//for ( Cell cell : cells )
//{
//if ( cell.isUndetermined() ) { continue; }
//distribution.get( cell.getValue() - 1 ).add( cell );
//}

//for ( ArrayList<Cell> val : distribution )
//{
//if ( val.size() > 1 )
//{
//broken = true;
//for ( Cell cell : val )
//{
//cell.showError();
//}
//}
//}

//if ( broken )
//System.out.println(this.toStringII());

        return broken;
    }


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
        return this.cells.map( m => m.value ).join(' ')
    }

*/

}

// vim: expandtab number tabstop=4
// END
