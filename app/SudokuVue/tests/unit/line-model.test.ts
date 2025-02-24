
// line-model.test.ts

import { describe, expect, test } from '@jest/globals'

import { LineModel } from '@/js/model/LineModel'
import { CellModel } from '@/js/model/CellModel'
import exp from 'constants'
// import { UnitStringAdaptor } from '@/js/adapter/UnitStringAdaptor'


describe('LineModel', () =>  {
  test('line.isRow', () => {
    for ( let y = 1 ; y <= 9 ; y++ )
    {
      const row = new LineModel(mk_row(y))
      // console.log('row:', row.toStringNames())
      expect(row.isRow).toBe(true)
      expect(row.isCol).toBe(false)
      expect(row.isTopLeftBotRight).toBe(false)
      expect(row.isBotLeftTopRight).toBe(false)
      expect(row.isDiagional).toBe(false)
      // console.log(UnitStringAdaptor.LineString(row))
    }
  })

  test('line.isCol', () => {
    for ( let x = 1 ; x <= 9 ; x++ )
    {
      const col = new LineModel(_mk_col(x))
      // console.log('col:', col.toStringNames())
      expect(col.isRow).toBe(false)
      expect(col.isCol).toBe(true)
      expect(col.isTopLeftBotRight).toBe(false)
      expect(col.isBotLeftTopRight).toBe(false)
      expect(col.isDiagional).toBe(false)
    }
  })

  test('line.isTopLeftBotRight', () => {
    const diag = new LineModel(mk_diag(true))
    // console.log('diag:', diag.toStringNames())
    expect(diag.isRow).toBe(false)
    expect(diag.isCol).toBe(false)
    expect(diag.isTopLeftBotRight).toBe(true)
    expect(diag.isBotLeftTopRight).toBe(false)
    expect(diag.isDiagional).toBe(true)
  })

  test('line.isBotLeftTopRight', () => {
    const diag = new LineModel(mk_diag(false))
    // console.log('diag:', diag.toStringNames())
    expect(diag.isRow).toBe(false)
    expect(diag.isCol).toBe(false)
    expect(diag.isTopLeftBotRight).toBe(false)
    expect(diag.isBotLeftTopRight).toBe(true)
    expect(diag.isDiagional).toBe(true)
  })

})

function mk_row ( y: number ): Array<CellModel>
{
  const cell_row: Array<CellModel> = []
  for ( let x = 1 ; x <= 9; x++ )
    cell_row.push(CellModel.factory(x, y))

  return cell_row
}

function _mk_col ( x: number ): Array<CellModel>
{
  const cell_col: Array<CellModel> = []
  for ( let y = 1 ; y <= 9; y++ )
    cell_col.push(CellModel.factory(x, y))

  return cell_col
}

function mk_diag ( TL: boolean ): Array<CellModel>
{
  const cell_diag: Array<CellModel> = []
  for ( let x = 1, y = 9 ; x <= 9; x++, y-- )
    TL ? cell_diag.push(CellModel.factory(x,x))
       : cell_diag.push(CellModel.factory(x,y))

  return cell_diag
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
