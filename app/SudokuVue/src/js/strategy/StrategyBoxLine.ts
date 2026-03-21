
// Strategy Box Line

import type { iUnit             } from '@/js/interface/iUnit'
import type { iBoard            } from '@/js/interface/iBoard'
import type { iBox              } from '@/js/interface/iBox'
import type { IntersectMap      } from '@/js/model/IntersectMap'
import { aStrategyBoard         } from '@/js/abstract/aStrategyBoard'
import { StrategyMappingFactory } from '@/js/strategy/StrategyMappingFactory'

// import type { BoxModel       } from '@/js/model/BoxModel'
// import type { CellModel      } from '@/js/model/CellModel'
// import      { CellValue      } from '@/js/model/CellValue'

// A level 1 Strategy
//  Box Line: This strategy attempts to remove candidates from a Block
//    by comparing candidates in a Block (aka box) that intersects a line.
//    Each candidate found in the intersection not found in the non-intersection
//    of the Line can be removed from the non-intersected Box.
// Therefore: if ! Y-includes( Z-candidate ) X-exclude( Z-candidate )
//
//  X  X  X
//  Z  Z  Z  Y  Y  Y  Y  Y  Y
//  X  X  X
//
//  X = non-intersected-block-cells
//  Y = non-intersected-line-cells
//  Z = intersection-cells
//


export
class StrategyBoxLine extends aStrategyBoard
{
    protected applyStrategy ( board: iBoard ): boolean
    {
        const blks: Array<iBox>  = []; board.forEachBox( box => blks.push(box) );
        const rows: Array<iUnit> = []; board.forEachRow( row => rows.push(row) );
        const cols: Array<iUnit> = []; board.forEachCol( col => cols.push(col) );

        const boxRowIntercepts = StrategyMappingFactory.createBoxRowIntercepts();
        const boxColIntercepts = StrategyMappingFactory.createBoxColIntercepts();

        let changed = false;

        for ( const intercept of boxRowIntercepts )
        {
          const [ box_idx, row_idx, iB, iL ] = intercept;

          changed ||= this.strategy_box_line( blks[box_idx], rows[row_idx], iB, iL );
        }

        for ( const intercept of boxColIntercepts )
        {
          const [ box_idx, col_idx, iB, iL ] = intercept;

          changed ||= this.strategy_box_line( blks[box_idx], cols[col_idx], iB, iL );
        }

        return changed
    }

    // A level 1 Strategy
    protected strategy_box_line( box: iBox, line: iUnit, iB: IntersectMap, iL: IntersectMap ) : boolean
    {
        const debug = true;
        let changed = 0;

        // Lines (rows and columns) have three parts { A, B, C }
        //   A = Cells 1-3
        //   B = Cells 4-6
        //   C = Cells 7-9
        //
        // Blocks are intersected horizontally with Line rows
        //     and vertically with Line columns. A Block has six(6) intersections
        //     three(3) horizontal and three(3) vertical.
        //
        //  Block horizontal intersects
        //   A = Cells 1,2,3
        //   B = Cells 4,5,6
        //   C = Cells 7,8,9
        //
        //  Block vertical intersects
        //   D = Cells 1,4,7
        //   E = Cells 2,5,8
        //   F = Cells 3,6,9

        // The Intersect candidates
        //  unique set of undetermined cell candidates values
        const intersectCandidates = iL.getUniqueIntersectCellValues( line.as_cell_array );

        // Line non-intersect candidates
        //  unique set of undetermined cell candidate values
        const lineNonIntersectCandidates = iL.getUniqueNonIntersectCellValues( line.as_cell_array );

        // Clean-able Candidates
        //  The unique candidate value set that we can exclude from non-intersected block cells
        const cleanerCandidateSet = intersectCandidates.filter( c => !lineNonIntersectCandidates.includes(c) );

        // Were done if there is nothing to clean
        if ( cleanerCandidateSet.length > 0 )
        {
            // Let the cleaning begin!
            // - Build set of non-intersect line cells
            // - exclude cleaning candidate set.
            const blockNonIntersectCells = iB.getNonIntersectCells( box.as_cell_array );

            for ( const c of blockNonIntersectCells )
            {
                for ( const N of cleanerCandidateSet )
                {
                    if ( c.exclude(N) )
                        changed++;
                }
            }

            if ( debug && changed > 0 )
            {
                // Non Intersect Line (Unit) Cells
                this.logger?.add(` Intersect: ${intersectCandidates.length} - [${intersectCandidates.map(cv => cv.value).join(',')}]`);
                this.logger?.add(`      Line: ${lineNonIntersectCandidates.length} - [${lineNonIntersectCandidates.map(cv => cv.value).join(',')}]`);
                this.logger?.add(`     Block: ${blockNonIntersectCells.length} - [${blockNonIntersectCells.map(v=> v.name)}]`);
                this.logger?.add(`  Cleaning: ${cleanerCandidateSet.length} - [${cleanerCandidateSet.map(v=> v.value)}]`);
            }
        }

        if ( changed > 0 )
            this.logger?.add( "# Strategy 1 - box_line cleaned " + changed + " candicates");

        return changed > 0;
    }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
