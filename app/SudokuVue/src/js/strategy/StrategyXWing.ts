
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

    // The X-Wing strategy is a technique used to eliminate candidates from cells in a Sudoku puzzle.
    // It works by identifying two rows and two columns that form an "X" shape, allowing you to
    // eliminate candidates from other cells in those rows and columns.

    private strategy_X_Wing ( board: iBoard ): boolean
    {
      // X-Wing detection
      const xwing_column_position = 0
      const xwing_cell_include_idx = 1
      const xwing_value_map = new Map<CellValue, Map<string, [[number, number], Array<[CellModel, CellModel]>]>>()

      // Map CV => COLUMN => [Cell,...]
      //   allows us to index all CELLS making up an X-Wing and their non-X-Wing intercepts
      const cv_ci_map = new Map<CellValue, Map<number, Array<CellModel>>>()

      let excludes = 0
  
      board.forEachRow( row => {
          // From this ROW ...
          // 1. Map values to cells by their "COLUMN" & "ROW" index's
          // 2. Detect if the row has only two cells with the same value
          //    ( all others having more or less are not candidates )
          // 3. Map these 1/2 X-Wing candidates into the xwing_cell_idx
          //     (columns are depicted by the cell index)
          // 4. The final map may have zero or more X-Wings having
          //    exactly two rows with the same values in the same column "INDEX"
          //    (an X-WING is formed by finding the value four times found
          //     in two rows having the same column index; when drawn as
          //     a grid it forms an X when lines are drawn the cells;
          //     upper-left to lower-right and upper-right to lower-left)
          const CV_to_CI_map = new Map<CellValue, Array<CellModel>>()
  
          // STEP #1: Map values to cells by their "COLUMN" index
          //    The intent is to identify cells vertically by value & column
          row.forEachCell( cell => {
              if (cell.isKnown)
                  return
  
              cell.forEachValue( cv => {
                  // A) Map cell values to column index for possible value exclusion
                  //     value => column index => [cell,...]
                  const cv_ci_set = cv_ci_map.get(cv) || new Map<number, Array<CellModel>>()
                  cv_ci_map.set(cv, cv_ci_set)
  
                  const ci_cell_set = cv_ci_set.get(cell.col) || []
                  cv_ci_set.set(cell.col, ci_cell_set)
  
                  ci_cell_set.push(cell)
  
                  // C) Map cell values to cells by their "COLUMN" index
                  //      for X-wing detection
                  CV_to_CI_map.has(cv) && CV_to_CI_map.get(cv)?.push(cell) || CV_to_CI_map.set(cv, [cell])
  
                  // if (cv.value == 4) console.log('CV:', cv.label, 'CI:', cell.cname + cell.col)
              })
          })
  
          CV_to_CI_map.forEach((cells, cv) => {
              // Our set of rows having values that may be exclude rows not part of an X-Wing
              //  ( this should provide a faster wat to find the exclude rows of interest )
              //  We may not need the entire row. Just the cells that matter. Cells know their position
              //  within the puzzle so we can target them directly if we have them indexed directly.
              //   SEE: cv_ci_map
              // row_value_map.has(cv) && row_value_map.get(cv)?.push(row) || row_value_map.set(cv, [row])
  
              // STEP #2: Detect if the row has only two cells with the same value
              //   ( all others having more or less are not candidates )
              if (cells.length !== 2)
                  return
  
              // STEP #3: Map these 1/2 X-Wing candidates into the xwing_cell_idx
              //   (columns are depicted by the cell COLUMN index)
              // CV => {X1,X2} => [].push( row )
              //   after all rows are inspected a VALUE having two rows with the cols make the X wing.
              //   It's possible to have two X-wings for the same value in the puzzle but they can never
              //   be in the same rows AND columns.
              const column_idx_key = cells.map(cell => cell.col).join(',')
  
              if (!xwing_value_map.has(cv))
                  xwing_value_map.set(cv, new Map<string, [[number, number], [] /*, Array<CellModel> */]>())
  
              const xwing_map = xwing_value_map.get(cv)
              const xwing_unit = xwing_map?.get(column_idx_key)
  
              // Existing column index, add row and cells to the map
              if (xwing_unit) {
                  xwing_unit[xwing_cell_include_idx].push([cells[0], cells[1]])
                  // xwing_unit[xwing_unit_exclude_idx].push(cells[0], cells[1])
                  return
              }
  
              // New column index, unseen this far (Add it to the map)
              xwing_map?.set(column_idx_key, [[cells[0].col, cells[1].col], [[cells[0], cells[1]]] /*, cells */])
          })
      })
  
      // Lets start by inspecting what we have to see if it smells RIGHT!
      xwing_value_map.forEach((xwing_map, cv) => {
          xwing_map.forEach((xwing_unit) => {
              if (xwing_unit[xwing_cell_include_idx].length !== 2)
                  return
  
              // A manual visual check of the console output by me has concluded that we have what
              //  we need to exclude X-Wing cell vales from intersecting non-X-wing rows!! CHEERs!
              console.log(
                  'X-Wing:', cv.label + ' (VALUE)\n', ' Include:', xwing_unit[xwing_column_position], '=>'
                  // The cells making up the X-Wing
                  , xwing_unit[xwing_cell_include_idx].flat().map(c => c.cname + c.row).sort(),
                  '\n  Exclude:'
                  // The cells having the value makign an X-Wing that are NOT within the X-Wing
                  //  ready to have CELL.exclude(CV) called upn them!
                  , [cv_ci_map.get(cv)?.get(xwing_unit[xwing_column_position][0])?.filter(c => !xwing_unit[xwing_cell_include_idx].flat().includes(c)).map(cell => cell.cname + cell.row),
                     cv_ci_map.get(cv)?.get(xwing_unit[xwing_column_position][1])?.filter(c => !xwing_unit[xwing_cell_include_idx].flat().includes(c)).map(cell => cell.cname + cell.row)].flat()
              )
  
              // The cells in the "Exclude" list are the cells that need to be excluded
              //  from the non-X-wing rows. They are detected from the list of all cells having a value
              //  minus the cells making up the X-Wing.
              const log: Array<string> = []
              cv_ci_map.get(cv)?.get(xwing_unit[xwing_column_position][0])?.filter(c => !xwing_unit[xwing_cell_include_idx].flat().includes(c))
                  .forEach(c => c.exclude(cv) && excludes++ && log.push('X-Wing: ' + c.cname + c.row + '.exclude(' + cv.label + ')'))
              cv_ci_map.get(cv)?.get(xwing_unit[xwing_column_position][1])?.filter(c => !xwing_unit[xwing_cell_include_idx].flat().includes(c))
                  .forEach(c => c.exclude(cv) && excludes++ && log.push('X-Wing: ' + c.cname + c.row + '.exclude(' + cv.label + ')'))
              console.log(log.join('\n'))
          })
      })

      return excludes > 0
    }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
