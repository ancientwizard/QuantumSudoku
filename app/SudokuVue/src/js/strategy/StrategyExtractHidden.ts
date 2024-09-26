// StrategyExtractHidden.ts

import type { CellModel             } from '@/js/model/CellModel'
import type { iLogger               } from '@/js/interface/iLogger'
//port type { StrategyLogger        } from '@/js/strategy/StrategyLogger'
import      { CellValue             } from '@/js/model/CellValue'
import      { containsAll           } from '@/js/util/contains-all'

export
class Value2Cell
{
    public value : CellValue        = CellValue.HIDDEN
    public cells : Array<CellModel> = [] as Array<CellModel>

    public toString () : string
    {
        let s = '# V: ' + ( this.value ? this.value.label : 'X' )
        s += ' (' + this.cells.map(c => c.name).join(',') + ')'
        return s
    }
}

export
class StrategyExtractHidden
{
    private logger : iLogger | null

    public constructor ( logger : iLogger | null = null )
    {
        this.logger = logger
    }

    public mapUnsolvedCellValuesToCells ( set_of_undetermined_cells : Array<CellModel> )
    {
        let mapOfVals2Cells : Array<Value2Cell> = [] as Array<Value2Cell>

        while ( mapOfVals2Cells.length < 9 ) mapOfVals2Cells.push(new Value2Cell())

        set_of_undetermined_cells.forEach( unsolved_cell => {
            unsolved_cell.as_candidate_array.forEach( candidate_cell_value => {
                let v2c = mapOfVals2Cells[ candidate_cell_value.index ]
                v2c.value == CellValue.HIDDEN && ( v2c.value = candidate_cell_value )
                v2c.cells.push( unsolved_cell )
            })
        })
        return mapOfVals2Cells
    }

    public filterByCandidateHiddenTriples ( array : Array<Value2Cell> )
    {
        return array.filter( candidate_value => candidate_value.cells.length == 3 )
    }

    public filterByCandidateHiddenQuads ( array : Array<Value2Cell> )
    {
        return array.filter( candidate_value => candidate_value.cells.length == 4 )
    }

    public detectHiddenTriples ( mapOfVals2Cells : Array<Value2Cell>, callback : ( K : Array<number>, A : Array<CellModel>, B : Array<CellModel>, C : Array<CellModel> ) => void )
    {
        // We're looking for Hidden Triple's, they are seen as three candidate values
        //   having the same set set of three Cells; the three candidate values must
        //   not be found in any other cells allowing us to make these Cells A "Naked TRIPLE"
        //   by removing all other candidate values safely. The removed values *must* be
        //   used by remaining unsolved cells.

        let Apos : number = 0

        mapOfVals2Cells.forEach( A => {
            Apos++;

            let Bpos : number = 0

            mapOfVals2Cells.forEach( B => {
                Bpos++;

                // Cell sets must ...
                //  - consiste of a distinct set of cells (no repeats!)
                //  - already compared triple set's inspected once
                if ( Bpos <= Apos ) return

                let Cpos : number = 0

                mapOfVals2Cells.forEach( C => {
                    Cpos++

                    if ( Cpos <= Bpos ) return

                    // Candidate value triple "A" is found in three cells &&
                    // Candidate value triple "B" is found in three cells &&
                    // Candidate value triple "C" is found in three cells &&
                    // and its the same three cells

                    if ( A.cells.length == 3 && B.cells.length == 3 && C.cells.length == 3
                          && containsAll(A.cells,B.cells) && containsAll(A.cells,C.cells))
                    {
                        // Nothing to clean up? Their already "Naked"
                        if ( A.cells[0].length == 3 && B.cells[1].length == 3 && C.cells[2].length == 3 ) return

                        let p : Array<number> = [ A.value.value, B.value.value, C.value.value ] as Array<number>

                        callback( p, A.cells, B.cells, C.cells )
                    }
                })
            })
        })
    }

    public detectHiddenQuads ( mapOfVals2Cells : Array<Value2Cell>,
        callback : ( K : Array<number>, A : Array<CellModel>, B : Array<CellModel>, C : Array<CellModel>, D : Array<CellModel> ) => void )
    {
        // We're looking for Hidden Quad's, they are seen as four candidate values
        //   having the same set set of four Cells; The values cant be found in any
        //   other cells in the set(unit)

        let Apos : number = 0

        mapOfVals2Cells.forEach( A => {
            Apos++;

            let Bpos : number = 0

            mapOfVals2Cells.forEach( B => {
                Bpos++;

                // Cell sets must ...
                //  - consiste of a distinct set of cells (no repeats!)
                //  - already compared triple set's inspected once
                if ( Bpos <= Apos ) return

                let Cpos : number = 0

                mapOfVals2Cells.forEach( C => {
                    Cpos++

                    if ( Cpos <= Bpos ) return

                    let Dpos : number = 0

                    mapOfVals2Cells.forEach( D => {
                        Dpos++

                        if ( Dpos <= Cpos ) return

                        // Candidate value quad "A" is found in four cells &&
                        // Candidate value quad "B" is found in four cells &&
                        // Candidate value quad "C" is found in four cells &&
                        // Candidate value quad "D" is found in four cells &&
                        // and its the same four cells

                        if ( A.cells.length == 4 && B.cells.length == 4 && C.cells.length == 4
                          && containsAll(A.cells,B.cells) && containsAll(A.cells,C.cells) && containsAll(A.cells,D.cells))
                        {
                            // Nothing to clean up? Their already "Naked"
                            if ( A.cells[0].length == 4 && B.cells[1].length == 4 && C.cells[2].length == 4 && D.cells[3].length == 4 ) return

                            let p : Array<number> = [ A.value.value, B.value.value, C.value.value, D.value.value ] as Array<number>

                            callback( p, A.cells, B.cells, C.cells, C.cells )
                        }
                    })
                })
            })
        })
    }
}

// vim: expandtab number tabstop=4
// END
