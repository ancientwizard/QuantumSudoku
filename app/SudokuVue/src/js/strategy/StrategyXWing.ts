
// StrategyXWing.ts

import type { iBoard          } from '@/js/interface/iBoard'
import type { CellModel       } from '@/js/model/CellModel'
import type { CellValue       } from '@/js/model/CellValue'
import      { aStrategyBoard  } from '@/js/abstract/aStrategyBoard'

export
class StrategyXWing extends aStrategyBoard
{

  public applyStrategy ( board: iBoard ) : boolean
  {
    // Apply the X-Wing strategy to the board
    return this.strategy_X_Wing(board)
  }

  // The X-Wing strategy is a technique used to eliminate candidates
  // by identifying two rows and two columns that form an "X" shape,
  // allowing one to eliminate candidates from other cells in those
  // rows OR columns.
  //   When the X-Wing is ROW detected, the cells in the column
  //     intersect candidates are subject to exclusion of the X-Wing value
  //   When the X-Wing is COL detected, the cells in the row
  //     intersect candidates are subject to exclusion of the X-Wing value

  private strategy_X_Wing ( board: iBoard ) : boolean
  {
    let changed = false

    // X-Wing detection  (ROW DETECTION /w COL exclusion)
    changed ||= this.strategy_X_Wing_generic( board, true )

    // X-Wing detection  (COL DETECTION /w ROW exclusion)
    changed ||= this.strategy_X_Wing_generic( board, false )

    return changed
  }

  private strategy_X_Wing_generic( board: iBoard, detectByRow: boolean ) : boolean
  {
    // Generic X-Wing detection
    //   Detect X-Wing by ROW and exclude by COL
    //   Detect X-Wing by COL and exclude by ROW

    // X-Wing detection tracking
    const xwing_position = 0;
    const xwing_cell_include_idx = 1;
    const xwing_value_map = new Map<CellValue, Map<string, [[number, number], Array<[CellModel, CellModel]>]>>();

    // Map CV => ROW/COL => [Cell,...]
    //   allows us to index all CELLS making up an X-Wing and their non-X-Wing intercepts
    const cv_map = new Map<CellValue, Map<number, Array<CellModel>>>();

    // The number of values exlcuded from cells
    let excludes = 0;

    // For each ROW/COL function mapping
    const forEachUnit = detectByRow ? board.forEachRow.bind(board) : board.forEachCol.bind(board);
    const getUnitIndex = detectByRow ? (cell: CellModel) => cell.col : (cell: CellModel) => cell.row;

    forEachUnit( unit => {
      const CV_to_Index_map = new Map<CellValue, Array<CellModel>>();

      // STEP #1: Map values to cells by their VALUES => "ROW/COL" index
      unit.forEachCell( cell => {
        if ( cell.isKnown ) return;

        cell.forEachValue( cv => {
          const cv_set = cv_map.get(cv) || new Map<number, Array<CellModel>>();
          cv_map.set(cv, cv_set);

          const index_set = cv_set.get(getUnitIndex(cell)) || [];
          cv_set.set(getUnitIndex(cell), index_set);

          index_set.push(cell);

          CV_to_Index_map.has(cv) && CV_to_Index_map.get(cv)?.push(cell) || CV_to_Index_map.set(cv, [cell]);
        })
      })

      // STEP #2: Detect if the row has only two cells with the same value
      //   ( all others having more or less are not X-Wing candidates )
      //  after all have been inspected a VALUE having two rows/col makes
      //  a candidate X wing.
      CV_to_Index_map.forEach(( cells, cv ) => {

        if ( cells.length !== 2 ) return;

        const index_key = cells.map(getUnitIndex).join(',');

        if (!xwing_value_map.has(cv))
          xwing_value_map.set(cv, new Map<string, [[number, number], []]>());

        const xwing_map = xwing_value_map.get(cv);
        const xwing_unit = xwing_map?.get(index_key);

        if ( xwing_unit )
        {
          xwing_unit[xwing_cell_include_idx].push([cells[0], cells[1]]);
          return;
        }

        xwing_map?.set(index_key, [[getUnitIndex(cells[0]), getUnitIndex(cells[1])], [[cells[0], cells[1]]]]);
      })
    })

    // Look for X-Wing candidates having intersecting cells for value exclusion
    xwing_value_map.forEach((xwing_map, cv) => {
      xwing_map.forEach((xwing_unit) => {

        // If we don't have two cells making up the X-Wing, skip it
        if (xwing_unit[xwing_cell_include_idx].length !== 2) return;

        // The cells making up the X-Wing
        const include_xwing_cell_set = xwing_unit[xwing_cell_include_idx].flat();

        // The cells ready to have CELL.exclude(CV) called upon them!
        //  Mr. "Clena" X-Wing, please exclude the values from cells that are not part of the X-Wing; scrub! scrub!
        const exclude_cv_from_cell_set = [
          cv_map.get(cv)?.get(xwing_unit[xwing_position][0])?.filter(c => !include_xwing_cell_set.includes(c)),
          cv_map.get(cv)?.get(xwing_unit[xwing_position][1])?.filter(c => !include_xwing_cell_set.includes(c))
        ].flat();

        // If we don't have any cells to exclude valus from, skip it; This X-Wing is clean
        if ( exclude_cv_from_cell_set.length === 0 ) return;

        // Log the detected X-Wing
        if ( this.logger )
        {
          const positionLabel = detectByRow ? 'COLS' : 'ROWS';
          this.logger.add(`# (X-Wing[${detectByRow ? 'ROW(detect)-COL(exclude)' : 'COL(detect)-ROW(exclude)'}]): ${cv.label} (VALUE)`);
          this.logger.add(`#  Include: ${positionLabel}:[ ${xwing_unit[xwing_position].join(', ')} ] => [ `
            + xwing_unit[xwing_cell_include_idx].flat().map(c => c.cname + (detectByRow ? c.row : c.col)).sort().join(', ') + ' ]');
          this.logger.add(`#  Exclude: ${positionLabel}:[ ${xwing_unit[xwing_position].join(', ')} ] => [ `
            + exclude_cv_from_cell_set.map(cell => cell && cell.cname + (detectByRow ? cell.row : cell.col)).sort().join(', ') + ' ]');
        }

        // Scrub and Log it!
        exclude_cv_from_cell_set.forEach(cell => {
          if (cell) {
            const change = cell.exclude(cv);
            change && excludes++;
            this.logger && this.logger.add(`X-Wing: ${cell.cname}${detectByRow ? cell.row : cell.col}.exclude(${cv.label}) ${change}`);
          }
        })
      })
    })

    return excludes > 0
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
