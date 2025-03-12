
// Strategy Pointing Line

import type { iUnit             } from '@/js/interface/iUnit'
import type { iBoard            } from '@/js/interface/iBoard'
import type { iBox              } from '@/js/interface/iBox'
import type { IntersectMap      } from '@/js/model/IntersectMap'
import { aStrategyBoard         } from '@/js/abstract/aStrategyBoard'
import { StrategyMappingFactory } from '@/js/strategy/StrategyMappingFactory'

// A level 1 Strategy
//  Pointing Line: This strategy attempts to remove candidates from a Line
//    by comparing candidates in a Block (aka box) that intersect that line.
//    Each candidate found in the intersection not found in the non-intersection
//    of the block can be removed from the non-intersected line.
//
// Therefore: if ! X-includes( Z-candidate ) Y-exclude( Z-candidate )
//
//  X  X  X
//  Z  Z  Z  Y  Y  Y  Y  Y  Y
//  X  X  X
//
//  X = non-intersected-box-cells
//  Y = non-intersected-line-cells
//  Z = intersection-cells
//


export
class StrategyPointingLine extends aStrategyBoard
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

      changed ||= this.strategy_pointing_line( blks[box_idx], rows[row_idx], iB, iL );
    }

    for ( const intercept of boxColIntercepts )
    {
      const [ box_idx, col_idx, iB, iL ] = intercept;

      changed ||= this.strategy_pointing_line( blks[box_idx], cols[col_idx], iB, iL );
    }

    return changed;
  }

  // A level 1 Strategy
  protected strategy_pointing_line( box: iBox, line: iUnit, iB: IntersectMap, iL: IntersectMap ): boolean
  {
      const debug = true
      let changed = 0;

      // Lines (rows and columns) have three parts { A, B, C }
      //   A = Cells 1-3
      //   B = Cells 4-6
      //   C = Cells 7-9
      //
      // Boxes are intersected horizontally with Line rows
      //     and vertically with Line columns. A Box has six(6) intersections
      //     three(3) horizontal and three(3) vertical.
      //  Box horizontal intersects
      //   A = Cells 1-3
      //   B = Cells 4-6
      //   C = Cells 7-9
      //  Box vertical intersects
      //   D = Cells 1,3,7
      //   E = Cells 2,4,8
      //   F = Cells 3,5,9

      // The Intersect candidate values
      //  unique set of undetermined cell candidates values
      const intersectCandidates = iB.getUniqueIntersectCellValues( box.as_cell_array );

      // Box non-intersect candidate values
      //  unique set of undermined non-intersect cell candidate values
      const boxNonIntersectCandidates = iB.getUniqueNonIntersectCellValues( box.as_cell_array );

      // Clean-able Candidates
      //  The unique candidate value set that we can exclude from non-intersected block cells
      const cleanerCandidateSet = intersectCandidates.filter( c => !boxNonIntersectCandidates.includes(c) );

      // Were done if there is nothing to clean
      if ( cleanerCandidateSet.length > 0 )
      {
          // Let the cleaning begin!
          // - Build set of non-intersect line cells
          // - exclude cleaning candidate set.
          const lineNonIntersectCells = iL.getNonIntersectCells( line.as_cell_array );

          for ( const c of lineNonIntersectCells )
          {
              for ( const N of cleanerCandidateSet )
              {
                  if ( c.exclude(N) )
                      changed++;
              }
          }

          if ( debug && changed > 0 )
          {
            this.logger?.add(` Intersect: ${intersectCandidates.length} - [${intersectCandidates.map(cv => cv.value).join(',')}]`);
            this.logger?.add(`     Block: ${boxNonIntersectCandidates.length} - [${boxNonIntersectCandidates.map(cv => cv.value).join(',')}]`);
            this.logger?.add(`      Line: ${lineNonIntersectCells.length} - [${lineNonIntersectCells.map(v=> v.name).join(',')}]`);
            this.logger?.add(`  Cleaning: ${cleanerCandidateSet.length} - [${cleanerCandidateSet.map(v=> v.value)}]`);
          }
      }
  
      if ( changed > 0 )
          this.logger?.add( "# Strategy 1 - pointing_line cleaned " + changed + " candicates");
  
      return changed > 0;
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
