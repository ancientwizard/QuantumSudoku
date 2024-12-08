
// block-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellModel              } from '@/js/model/CellModel'
import { BlockModel             } from '@/js/model/BlockModel'

function mk_cells ( autosolve = true ) : Array<CellModel>
{
  const cell_set : Array<CellModel> = []

  for ( let y = 1 ; y <= 3 ; y++ )
    for ( let x = 1 ; x <= 3 ; x++ )
      cell_set.push(CellModel.factory(x,y,autosolve))

  return cell_set
}

function mk_block ( autosolve = true ) : BlockModel
{
  return new BlockModel(mk_cells( autosolve ))
}

function block (autosolve = true) : BlockModel { return mk_block( autosolve ) }

describe('model/block-model/grid-mapping', () => {

  test('row/col mapping', () => {
    expect(BlockModel.iC1.length).toBe(3); expect(BlockModel.iR1.length).toBe(3)
    expect(BlockModel.iC2.length).toBe(3); expect(BlockModel.iR2.length).toBe(3)
    expect(BlockModel.iC3.length).toBe(3); expect(BlockModel.iR3.length).toBe(3)

    expect(BlockModel.iC1[0].index).toBe(0); expect(BlockModel.iC1[0].value).toBe(1)
    expect(BlockModel.iC1[1].index).toBe(3); expect(BlockModel.iC1[1].value).toBe(4)
    expect(BlockModel.iC1[2].index).toBe(6); expect(BlockModel.iC1[2].value).toBe(7)

    expect(BlockModel.iC2[0].index).toBe(1); expect(BlockModel.iC2[0].value).toBe(2)
    expect(BlockModel.iC2[1].index).toBe(4); expect(BlockModel.iC2[1].value).toBe(5)
    expect(BlockModel.iC2[2].index).toBe(7); expect(BlockModel.iC2[2].value).toBe(8)

    expect(BlockModel.iC3[0].index).toBe(2); expect(BlockModel.iC3[0].value).toBe(3)
    expect(BlockModel.iC3[1].index).toBe(5); expect(BlockModel.iC3[1].value).toBe(6)
    expect(BlockModel.iC3[2].index).toBe(8); expect(BlockModel.iC3[2].value).toBe(9)

    expect(BlockModel.iR1[0].index).toBe(0); expect(BlockModel.iR1[0].value).toBe(1)
    expect(BlockModel.iR1[1].index).toBe(1); expect(BlockModel.iR1[1].value).toBe(2)
    expect(BlockModel.iR1[2].index).toBe(2); expect(BlockModel.iR1[2].value).toBe(3)

    expect(BlockModel.iR2[0].index).toBe(3); expect(BlockModel.iR2[0].value).toBe(4)
    expect(BlockModel.iR2[1].index).toBe(4); expect(BlockModel.iR2[1].value).toBe(5)
    expect(BlockModel.iR2[2].index).toBe(5); expect(BlockModel.iR2[2].value).toBe(6)

    expect(BlockModel.iR3[0].index).toBe(6); expect(BlockModel.iR3[0].value).toBe(7)
    expect(BlockModel.iR3[1].index).toBe(7); expect(BlockModel.iR3[1].value).toBe(8)
    expect(BlockModel.iR3[2].index).toBe(8); expect(BlockModel.iR3[2].value).toBe(9)
  })
})

describe('model/block-model/constructor', () => {
  
    test('constructor', () => {
      const block = new BlockModel(mk_cells())
      expect(block).toBeInstanceOf(BlockModel)
      // console.log(block.toString())
      // console.log(block.toStringII())
      // console.log(block.toStringIII()) // Block String???
      block.as_cell_array.forEach((cell, index) => {
        expect(cell.value).toBe(0)
        expect(cell.length).toBe(9)
        expect(cell.as_label_array.length).toBe(9)
        expect(cell.autosolve).toBe(true)
        // console.log(cell.cname)
      })
    })
  })

// vim: expandtab number tabstop=2
// END
