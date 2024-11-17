
//
// Sudoku Board Model
//

import type { UnitModel     } from '@/js/model/UnitModel'
import type { BlockModel    } from '@/js/model/BlockModel'
import      { CellModel     } from '@/js/model/CellModel'

export enum BoardMode { EDIT, PLAY, DIAGONAL, SOLVE }

export
class BoardModel
{
    public static readonly MODE = BoardMode

/* NAMES are now build into the cells based on (X[col],Y[row])
    public static readonly cellnames: Array<Array<String>> = [
        ['A1','A2','A3',  'A4','A5','A6',  'A7','A8','A9' ],
        ['B1','B2','B3',  'B4','B5','B6',  'B7','B8','B9' ],
        ['C1','C2','C3',  'C4','C5','C6',  'C7','C8','C9' ],

        ['D1','D2','D3',  'D4','D5','D6',  'D7','D8','D9' ],
        ['E1','E2','E3',  'E4','E5','E6',  'E7','E8','E9' ],
        ['F1','F2','F3',  'F4','F5','F6',  'F7','F8','F9' ],

        ['G1','G2','G3',  'G4','G5','G6',  'G7','G8','G9' ],
        ['H1','H2','H3',  'H4','H5','H6',  'H7','H8','H9' ],
        ['I1','I2','I3',  'I4','I5','I6',  'I7','I8','I9' ]
    ]
*/

    // Composition
    private grdblocks: Array<BlockModel> = []
    private rowblocks: Array<UnitModel>  = []
    private colblocks: Array<UnitModel>  = []
    private angblocks: Array<UnitModel>  = []

    constructor ( mode: BoardMode )
    {
        var cells: Array<Array<CellModel>> = []
        var names: Array<Array<String>> = []

        for ( var y: number = 1 ; y <= 9 ; y++ )
        {
            cells[y-1] = []
            names[y-1] = []

            for ( var x: number = 1 ; x <= 9 ; x++ )
            {
                names[y-1][x-1] = (cells[y-1][x-1] = CellModel.factory(x,y)).name
            }
        }

        // console.log(cells)
        // console.log(names)
    }

}

// vim: expandtab number tabstop=4
// END
