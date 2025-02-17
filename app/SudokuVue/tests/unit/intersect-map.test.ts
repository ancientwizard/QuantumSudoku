
// intersect-map.text.ts

import { describe, expect, test } from '@jest/globals'
import { IntersectMap           } from '@/js/model/IntersectMap'
import { UnitModel              } from '@/js/model/UnitModel'
import { CellModel              } from '@/js/model/CellModel'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'

function mk_cells ( size = 0, autosolve = true ) : Array<CellModel>
{
  const cell_set : Array<CellModel> = []

  for ( let i = 1 ; i <= size ; i++ )
      cell_set.push(CellModel.factory(size<10?1:0,size<10?i:0,autosolve))

  return cell_set
}

function mk_unit ( size = 0, autosolve = true ) : UnitModel
{
  return new UnitModel(mk_cells(size, autosolve ))
}

function unit (autosolve = true) : UnitModel { return mk_unit( 9, autosolve ) }

describe( 'model/intersect-map', () => {

  test('map/unit/get-intersect-cells+unique-values', () => {
    // rows and cols are the same; only one test is needed
    const unt = unit()
    const idxsetA = [ CellIndex.ONE, CellIndex.TWO, CellIndex.THREE ]
    const idxsetB = [ CellIndex.FOUR, CellIndex.FIVE, CellIndex.SIX ]
    const idxsetC = [ CellIndex.SEVEN, CellIndex.EIGHT, CellIndex.NINE ]
    const idxsets = [ idxsetA, idxsetB, idxsetC ]
    const cell_names = [['A1', 'A2', 'A3'], ['A4', 'A5', 'A6'], ['A7', 'A8', 'A9']]

    // New unit, no exclusions, all values are possible
    const intersect_map_rows = [ IntersectMap.iR1, IntersectMap.iR2, IntersectMap.iR3 ]

    intersect_map_rows.forEach( (intersect_map,idx) => {
      // console.log(intersect_map.getIntersectCells(unt.as_cell_array).map( cell => cell.name ).join(', '))

      // Prove the intersect cells are correct by NAME
      expect(intersect_map.getIntersectCells(unt.as_cell_array).map( cell => cell.name ))
        .toEqual(cell_names[idx])

      expect(intersect_map.getUniqueIntersectCellValues(unt.as_cell_array))
        .toEqual([
          CellValue.ONE,    CellValue.TWO,    CellValue.THREE,
          CellValue.FOUR,   CellValue.FIVE,   CellValue.SIX,
          CellValue.SEVEN,  CellValue.EIGHT,  CellValue.NINE])
    })

    idxsets.forEach( (idxset, idx) => {
      // Exclude some values from the unit
      idxset.forEach( (cellindex) => {
        expect(unt.exclude(cellindex, CellValue.FOUR)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.FIVE)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.SIX)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.SEVEN)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.EIGHT)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.NINE)).toBe(true)
      })

      unt.is(idxset[0], CellValue.ONE)
      // console.log(unt.toString())

      expect(intersect_map_rows[idx].getUniqueIntersectCellValues(unt.as_cell_array)).toEqual([CellValue.TWO, CellValue.THREE])
      expect(intersect_map_rows[idx].getUniqueNonIntersectCellValues(unt.as_cell_array))
        .toEqual([CellValue.TWO, CellValue.THREE, CellValue.FOUR, CellValue.FIVE, CellValue.SIX, CellValue.SEVEN, CellValue.EIGHT, CellValue.NINE])

        unt.reset()
    })
  })

  test('map/unit/getNonIntersectCellValues', () => {
    const unt = unit()
    const idxsetA = [ CellIndex.FOUR, CellIndex.FIVE, CellIndex.SIX,   CellIndex.SEVEN, CellIndex.EIGHT, CellIndex.NINE ]
    const idxsetB = [ CellIndex.ONE,  CellIndex.TWO,  CellIndex.THREE, CellIndex.SEVEN, CellIndex.EIGHT, CellIndex.NINE ]
    const idxsetC = [ CellIndex.ONE,  CellIndex.TWO,  CellIndex.THREE, CellIndex.FOUR,  CellIndex.FIVE,  CellIndex.SIX ]
    const idxsets = [ idxsetA, idxsetB, idxsetC ]
    const non_intersect_cell_names = [
      ['A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
      ['A1', 'A2', 'A3', 'A7', 'A8', 'A9'],
      ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']]

    // New unit, no exclusions, all values are possible
    const intersect_map_rows = [ IntersectMap.iR1, IntersectMap.iR2, IntersectMap.iR3 ]

    intersect_map_rows.forEach( (intersect_map,idx) => {
      // console.log(intersect_map.getNonIntersectCells(unt.as_cell_array).map( cell => cell.name ).join(', '))

      // Prove the intersect cells are correct by NAME
      expect(intersect_map.getNonIntersectCells(unt.as_cell_array).map( cell => cell.name ))
        .toEqual(non_intersect_cell_names[idx])

      expect(intersect_map.getNonIntersectCells(unt.as_cell_array).map( cell => cell.name ))
        .toEqual(non_intersect_cell_names[idx])

      expect(intersect_map.getUniqueNonIntersectCellValues(unt.as_cell_array))
        .toEqual([
          CellValue.ONE,    CellValue.TWO,    CellValue.THREE,
          CellValue.FOUR,   CellValue.FIVE,   CellValue.SIX,
          CellValue.SEVEN,  CellValue.EIGHT,  CellValue.NINE])
    })

    idxsets.forEach( (idxset, idx) => {
      // Exclude some values from the unit
      idxset.forEach( (cellindex) => {
        expect(unt.exclude(cellindex, CellValue.FOUR)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.FIVE)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.SIX)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.SEVEN)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.EIGHT)).toBe(true)
        expect(unt.exclude(cellindex, CellValue.NINE)).toBe(true)
      })

      unt.is(idxset[5], CellValue.ONE)
      // console.log(unt.toString())

      expect(intersect_map_rows[idx].getUniqueIntersectCellValues(unt.as_cell_array))
        .toEqual([CellValue.TWO, CellValue.THREE, CellValue.FOUR, CellValue.FIVE, CellValue.SIX, CellValue.SEVEN, CellValue.EIGHT, CellValue.NINE])
      expect(intersect_map_rows[idx].getUniqueNonIntersectCellValues(unt.as_cell_array))
        .toEqual([CellValue.TWO, CellValue.THREE])

      unt.reset()
    })
  })
})

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
