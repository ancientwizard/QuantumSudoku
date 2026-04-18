// StrategySwordfish.ts

import type { iBoard         } from '@/js/interface/iBoard'
import type { iUnit          } from '@/js/interface/iUnit'
import type { CellValue      } from '@/js/model/CellValue'
import      { aStrategyBoard } from '@/js/abstract/aStrategyBoard'

type UnitCandidateMap = Map<CellValue, Map<number, Set<number>>>

export
class StrategySwordfish extends aStrategyBoard
{
  protected applyStrategy ( board: iBoard ) : boolean
  {
    let changed = false

    // Detect by rows and eliminate on columns.
    changed ||= this.strategy_Swordfish_generic(board, true)

    // Detect by columns and eliminate on rows.
    changed ||= this.strategy_Swordfish_generic(board, false)

    return changed
  }

  private strategy_Swordfish_generic( board: iBoard, detectByRow: boolean ) : boolean
  {
    const rows: Array<iUnit> = []
    const cols: Array<iUnit> = []
    const valueToUnits: UnitCandidateMap = new Map()
    let excludes = 0

    board.forEachRow( row => rows.push(row) )
    board.forEachCol( col => cols.push(col) )

    const forEachBaseUnit = detectByRow ? board.forEachRow.bind(board) : board.forEachCol.bind(board)

    forEachBaseUnit(( unit, baseIdx ) => {
      const valueToCrossIndexes = new Map<CellValue, Set<number>>()

      unit.forEachCell( cell => {
        if ( cell.isKnown ) return

        cell.forEachValue( cv => {
          if ( !valueToCrossIndexes.has(cv) ) valueToCrossIndexes.set(cv, new Set())

          const crossIdx = detectByRow ? cell.col - 1 : cell.row - 1
          valueToCrossIndexes.get(cv)?.add(crossIdx)
        })
      })

      valueToCrossIndexes.forEach(( crossIndexes, cv ) => {
        // Swordfish needs each base unit to hold the candidate in 2-3 cells.
        if ( crossIndexes.size < 2 || crossIndexes.size > 3 ) return

        if ( !valueToUnits.has(cv) ) valueToUnits.set(cv, new Map())
        valueToUnits.get(cv)?.set(baseIdx, crossIndexes)
      })
    })

    valueToUnits.forEach(( unitMap, cv ) => {
      if ( unitMap.size < 3 ) return

      const baseIndexes = [...unitMap.keys()].sort((a, b) => a - b)
      const triples = this.pickTriples(baseIndexes)

      triples.forEach( triple => {
        const unionCrossIndexes = new Set<number>()

        triple.forEach( baseIdx => {
          unitMap.get(baseIdx)?.forEach( crossIdx => unionCrossIndexes.add(crossIdx))
        })

        // Swordfish requires exactly 3 intersecting rows/cols.
        if ( unionCrossIndexes.size !== 3 ) return

        const baseIndexSet = new Set<number>(triple)
        const crossIndexes = [...unionCrossIndexes].sort((a, b) => a - b)

        if ( this.logger )
        {
          const detectLabel = detectByRow ? 'ROW(detect)-COL(exclude)' : 'COL(detect)-ROW(exclude)'
          const baseLabel   = detectByRow ? 'ROWS' : 'COLS'
          const crossLabel  = detectByRow ? 'COLS' : 'ROWS'

          this.logger.add(`# (Swordfish[${detectLabel}]): ${cv.label} (VALUE)`)
          this.logger.add(`#  Include: ${baseLabel}:[ ${triple.join(', ')} ] x ${crossLabel}:[ ${crossIndexes.join(', ')} ]`)
        }

        crossIndexes.forEach( crossIdx => {
          const crossUnit = detectByRow ? cols[crossIdx] : rows[crossIdx]

          crossUnit.forEachCell( cell => {
            const currentBaseIndex = detectByRow ? cell.row - 1 : cell.col - 1

            if ( baseIndexSet.has(currentBaseIndex) ) return
            if ( cell.isKnown ) return
            if ( !cell.includes(cv) ) return

            const changed = cell.exclude(cv)
            changed && excludes++
            this.logger?.add(`Swordfish: ${cell.name}.exclude(${cv.label}) ${changed}`)
          })
        })
      })
    })

    return excludes > 0
  }

  private pickTriples( values: Array<number> ) : Array<[number, number, number]>
  {
    const triples: Array<[number, number, number]> = []

    for ( let i = 0 ; i < values.length - 2 ; i++ )
      for ( let j = i + 1 ; j < values.length - 1 ; j++ )
        for ( let k = j + 1 ; k < values.length ; k++ )
          triples.push([values[i], values[j], values[k]])

    return triples
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END