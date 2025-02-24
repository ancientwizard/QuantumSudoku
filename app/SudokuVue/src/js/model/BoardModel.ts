
//
// Sudoku Board Model
//

import type { CellIndex     } from '@/js/model/CellIndex'
import type { CellValue     } from '@/js/model/CellValue'
import type { iBoard        } from '@/js/interface/iBoard'
import      { LineModel     } from '@/js/model/LineModel'
import      { BoxModel      } from '@/js/model/BoxModel'
import      { CellModel     } from '@/js/model/CellModel'

export enum BoardMode { EDIT, PLAY, SOLVE }
export enum BoardType { NORMAL, DIAGONAL }

export
class BoardModel implements iBoard
{
    // Composition
    private boxunits: Array<BoxModel>   = []    // 3x3 box/grid units
    private rowunits: Array<LineModel>  = []    //   9 row units
    private colunits: Array<LineModel>  = []    //   9 column units
    private angunits: Array<LineModel>  = []    //   2 diagonal units
    private diadtlbr: LineModel | null  = null  //   1 diagional unti (top-left to bottom-right)
    private diadbltr: LineModel | null  = null  //   1 diagional unti (bottom-left to top-right)
    private MODE: BoardMode
    private TYPE: BoardType

    constructor( mode: BoardMode = BoardMode.EDIT, type: BoardType = BoardType.NORMAL )
    {
        this.MODE = mode
        this.TYPE = type

        const cells: Array<Array<CellModel>> = []

        this.initializeCellsAndNames(cells)
        this.buildRowUnits(cells)
        this.buildColUnits(cells)
        this.buildBoxUnits(cells)

        if ( this.TYPE == BoardType.DIAGONAL ) this.buildDiagonalUnits(cells)
    }

    public set ( x: CellIndex, y: CellIndex, value: CellValue ): boolean
    {
        return this.rowunits[y.index].is(x, value)
    }

    public columnNamesAsArray(): Array<string>
    {
        return this.rowunits[0].as_cell_array.map( cell => cell.cname )
    }

    public forEachRow(callback: (row: LineModel, index: number) => void): void
    {
        this.rowunits.forEach(( row, index ) => {
            callback( row, index );
        });
    }

    public forEachCol(callback: (column: LineModel, index: number) => void): void
    {
        this.colunits.forEach(( column, index ) => {
            callback( column, index );
        });
    }

    public forEachBox(callback: (block: BoxModel, index: number) => void): void
    {
        this.boxunits.forEach(( block, index ) => {
            callback( block, index );
        });
    }

    private initializeCellsAndNames(cells: Array<Array<CellModel>> ): void
    {
        for (let y = 1; y <= 9; y++)
        {
            cells[y - 1] = [];
            for ( let x = 1 ; x <= 9 ; x++ )
            {
                cells[y - 1][x - 1] = CellModel.factory(x, y, this.MODE == BoardMode.SOLVE )
            }
        }
    }

    private buildRowUnits(cells: Array<Array<CellModel>>): void
    {
        for ( let y = 1 ; y <= 9 ; y++ )
            this.rowunits[y - 1] = new LineModel(cells[y - 1])
    }

    private buildColUnits(cells: Array<Array<CellModel>>): void
    {
        for ( let x = 1 ; x <= 9 ; x++ )
        {
            const columnCells: Array<CellModel> = []
            for ( let y = 1 ; y <= 9 ; y++ )
                columnCells.push(cells[y - 1][x - 1])

            this.colunits[x - 1] = new LineModel(columnCells)
        }
    }

    private buildBoxUnits(cells: Array<Array<CellModel>>): void
    {
        for ( let blockY = 0 ; blockY < 3 ; blockY++ )
            for ( let blockX = 0 ; blockX < 3 ; blockX++ )
            {
                const blockCells: Array<CellModel> = []

                for ( let y = 0 ; y < 3 ; y++ )
                    for (let x = 0 ; x < 3 ; x++ )
                        blockCells.push(cells[blockY * 3 + y][blockX * 3 + x])

                this.boxunits.push(new BoxModel(blockCells));
            }
    }

    private buildDiagonalUnits(cells: Array<Array<CellModel>>): void
    {
        const diagonal1: Array<CellModel> = []
        const diagonal2: Array<CellModel> = []

        for (let i = 0; i < 9; i++) {
            diagonal1.push(cells[i][i])
            // interesting; make the order from bottom-left to top-right
            diagonal2.push(cells[8 - i][i])
        }

        this.angunits.push(this.diadtlbr = new LineModel(diagonal1))
        this.angunits.push(this.diadbltr = new LineModel(diagonal2))
    }

    // A bit of introspection
    public get_diagonal_TL_BR(): LineModel | null
    {
        return this.diadtlbr
    }

    public get_diagonal_BL_TR(): LineModel | null
    {
        return this.diadbltr
    }

    // public diagonalUnits(): Array<LineModel>
    // {
    //     return this.angunits
    // }

    public get isEditMode()     : boolean { return this.MODE == BoardMode.EDIT }
    public get isPlayMode()     : boolean { return this.MODE == BoardMode.PLAY }
    public get isSolveMode()    : boolean { return this.MODE == BoardMode.SOLVE}

    public get isNormalType()   : boolean { return this.TYPE == BoardType.NORMAL }
    public get isDiagonalType() : boolean { return this.TYPE == BoardType.DIAGONAL }

    // CHANGE MODE(s)
    public toEditMode(): BoardModel
    {
        // We're resetting cell values by using all-rows.
        // This also covers all colums, blocks and diagonals
        this.rowunits.forEach(u => u.reset())
        this.MODE = BoardMode.EDIT
        // If we Had INIT history we'd play it in now OR our consumer would do so!
        return this
    }

    public toPlayMode(): BoardModel
    {
        this.MODE = BoardMode.PLAY
        return this
    }

    public toSolveMode(): BoardModel
    {
        this.MODE = BoardMode.SOLVE
        return this
    }

    public restart(): BoardModel { return this.toEditMode() }

    public get isSolved(): boolean
    {
        return ! this.rowunits.some( row => ! row.isSolved );
    }

    // public reset(): void
    // {
    //     this.rowunits.forEach( row => row.reset() )
    // }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
