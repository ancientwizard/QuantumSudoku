
// IntersectMap is a class that identifies the intersection between a line and a block.
// It is used by the StrategyPointingLine and StrategyBoxLine classes to identify
// the cells that are common to both the line and the block, their intersection.

import type { CellValue             } from '@/js/model/CellValue'
import type { CellIndex             } from '@/js/model/CellIndex'
import type { CellModel             } from '@/js/model/CellModel'
import      { BoxModel              } from '@/js/model/BoxModel'

export
class IntersectMap
{
    // Reusable Intersect MAPS
    public static iC1: IntersectMap = new IntersectMap(BoxModel.iC1)
    public static iC2: IntersectMap = new IntersectMap(BoxModel.iC2)
    public static iC3: IntersectMap = new IntersectMap(BoxModel.iC3)
    public static iR1: IntersectMap = new IntersectMap(BoxModel.iR1)
    public static iR2: IntersectMap = new IntersectMap(BoxModel.iR2)
    public static iR3: IntersectMap = new IntersectMap(BoxModel.iR3)

    private intersect: Array<CellIndex> = []

    private constructor( private inter: Array<CellIndex> )
    {
        inter.forEach( (cell) => { this.intersect.push(cell) } )
    }

    public getIntersectCells( srcCells: Array<CellModel> ) : Array<CellModel>
    {
        return [
            srcCells[this.intersect[0].index],
            srcCells[this.intersect[1].index],
            srcCells[this.intersect[2].index]
        ]
    }

    // Return the Unique "Candidate" cell values of the intersect cells
    public getUniqueIntersectCellValues( srcCells: Array<CellModel> ) : Array<CellValue>
    {
        const intersectCellValues: Array<CellValue> = []

        this.getIntersectCells(srcCells).forEach( intersectcell => {

            if ( intersectcell.isKnown ) return

            intersectcell.as_candidate_array.forEach( cv => {
                if ( !intersectCellValues.includes(cv) )
                    intersectCellValues.push(cv)
            })
        })

        return intersectCellValues
    }

    public getNonIntersectCells( srcCells: Array<CellModel> ) : Array<CellModel>
    {
        const nonIntersectCells: Array<CellModel> = []

        // All cells that are not in the intersect set, solved OR not!
        srcCells.forEach( (cell,idx) => {
            if ( !this.intersect.some( cellindex => cellindex.index === idx ) )
                nonIntersectCells.push(cell)
        })

        return nonIntersectCells
    }

    // Return the Unique "Candidate" cell values of the non-intersect cells
    public getUniqueNonIntersectCellValues( srcCells: Array<CellModel> ) : Array<CellValue>
    {
        const nonIntersectCellValues: Array<CellValue> = []

        this.getNonIntersectCells(srcCells).forEach( cell => {
            if ( cell.isKnown ) return

            const cellValue: Array<CellValue> = cell.as_candidate_array

            cellValue.forEach( cv => {
                if ( !nonIntersectCellValues.includes(cv) )
                    nonIntersectCellValues.push(cv)
            })
        })

        return nonIntersectCellValues
    }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
