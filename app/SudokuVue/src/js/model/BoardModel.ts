
//
// Sudoku Board Model
//

import { UnitModel      } from '@/js/model/UnitModel'
import { BlockModel     } from '@/js/model/BlockModel'
import { CellModel      } from '@/js/model/CellModel'
import type { CellIdent } from './CellIdent'
import type { CellIndex } from './CellIndex'
import type { CellValue } from './CellValue'

export enum BoardMode { EDIT, PLAY, DIAGONAL, SOLVE }

export
class BoardModel {
    // Composition
    private grdunits: Array<BlockModel> = []    // 3x3 grid units
    private rowunits: Array<UnitModel>  = []    //   9 row units
    private colunits: Array<UnitModel>  = []    //   9 column units
    private angunits: Array<UnitModel>  = []    //   2 diagonal units
    private MODE: BoardMode

    constructor(mode: BoardMode)
    {
        this.MODE = mode

        const cells: Array<Array<CellModel>> = []

        this.initializeCellsAndNames(cells)
        this.buildRowUnits(cells)
        this.buildColumnUnits(cells)
        this.buildBlockUnits(cells)

        if ( this.MODE == BoardMode.DIAGONAL ) this.buildDiagonalUnits(cells)
    }

    public set ( x: CellIndex, y: CellIndex, value: CellValue ): boolean
    {
        return this.rowunits[y.index].is(x, value)
    }

    public getBlock ( x: CellIndex ): BlockModel
    {
        return this.grdunits[x.index]
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
            this.rowunits[y - 1] = new UnitModel(cells[y - 1])
    }

    private buildColumnUnits(cells: Array<Array<CellModel>>): void
    {
        for ( let x = 1 ; x <= 9 ; x++ )
        {
            const columnCells: Array<CellModel> = []
            for ( let y = 1 ; y <= 9 ; y++ )
                columnCells.push(cells[y - 1][x - 1])

            this.colunits[x - 1] = new UnitModel(columnCells)
        }
    }

    private buildBlockUnits(cells: Array<Array<CellModel>>): void
    {
        for ( let blockY = 0 ; blockY < 3 ; blockY++ )
            for ( let blockX = 0 ; blockX < 3 ; blockX++ )
            {
                const blockCells: Array<CellModel> = []

                for ( let y = 0 ; y < 3 ; y++ )
                    for (let x = 0 ; x < 3 ; x++ )
                        blockCells.push(cells[blockY * 3 + y][blockX * 3 + x])

                this.grdunits.push(new BlockModel(blockCells));
            }
    }

    private buildDiagonalUnits(cells: Array<Array<CellModel>>): void
    {
        const diagonal1: Array<CellModel> = []
        const diagonal2: Array<CellModel> = []

        for (let i = 0; i < 9; i++) {
            diagonal1.push(cells[i][i])
            diagonal2.push(cells[i][8 - i])
        }

        this.angunits.push(new UnitModel(diagonal1))
        this.angunits.push(new UnitModel(diagonal2))
    }

    public toString(): string
    {
        let s = '  '

        s += this.rowunits[0].as_cell_array.map( cell => `   ${cell.cname}` ).join('  ')
        s += '\n  +-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'

        this.rowunits.forEach( row => {
            let first = true
            row.as_cell_array.forEach( cell => {
                s += (first ? cell.row + ' ' : '  ') + '|  ' + cell.cv.label
                first = false
            } )
            s += '  |\n  +-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'
        } )

        return s
    }

    public toStringCoords(): string
    {
        let s = '+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'
        this.rowunits.forEach( row => {
            row.as_cell_array.forEach( cell => s += '|' + cell.coord  )
            s += '|\n+-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'
        } )

        return s
    }

    public toStringNames(): string
    {
        let s = ''
        for ( let y = 1 ; y <= 9 ; y++ )
        {
            s += this.rowunits[y - 1].toStringNames()
            s += '\n'
        }
        return s
    }

    public toStringValues(): string
    {
        let s = ''
        this.rowunits.forEach( row => s += row.toStringValues() + '\n' )
        return s
    }

    public toStringBoard(): string
    {
        // To be like BlockModel.toStringBlock()
        // But this following clode is not even close Mr. AI! HA!

        let s = '  '

        s += this.rowunits[0].as_cell_array.map( cell => `   ${cell.cname}` ).join('  ')
        s += '\n  +-----+-----+-----+-----+-----+-----+-----+-----+-----+\n'

        this.rowunits.forEach( row => { //why offer that broken code?
        } )

        return s
    }
}

// vim: expandtab number tabstop=4
// END
