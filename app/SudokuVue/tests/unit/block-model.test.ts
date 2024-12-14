
// block-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellModel              } from '@/js/model/CellModel'
import { BlockModel             } from '@/js/model/BlockModel'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'

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

describe('model/block-model/constructor', () => 
  test('constructor', () => {
    const block = mk_block()
    expect(block).toBeInstanceOf(BlockModel)
    block.as_cell_array.forEach((cell, index) => {
      expect(cell.value).toBe(0)
      expect(cell.length).toBe(9)
      expect(cell.as_label_array.length).toBe(9)
      expect(cell.autosolve).toBe(true)
      // console.log(cell.cname)
    })
  })
)

describe('model/block-model/string-checks', () => {

  const block = mk_block()

  test('toString',      () => expect(block.toString()).toBe(to_string()))
  test('toStringBlock', () => expect(block.toStringBlock()).toBe(to_string_block()))
  test('toStringValue', () => expect(block.toStringValue()).toBe('? ? ? ? ? ? ? ? ?'))
  test('toStringNames', () => expect(block.toStringNames()).toBe(to_string_names()))
  test('toStringCoords',() => expect(block.toStringCoords()).toBe(to_string_coords()))
})

describe('model/block-model/string-checks-159', () => {

  test('is([1,1,[5,5],[9,9])/string', () => {
    const block = mk_block()

    expect(block.is(CellIndex.ONE,  CellValue.ONE)).toBe(true)
    expect(block.is(CellIndex.FIVE, CellValue.FIVE)).toBe(true)
    expect(block.is(CellIndex.NINE, CellValue.NINE)).toBe(true)

    expect(block.toString()).toBe(to_string_159())
    expect(block.toStringBlock()).toBe(to_string_block_159())
    expect(block.toStringValue()).toBe('1 ? ? ? 5 ? ? ? 9')
    expect(block.toStringCoords()).toBe(to_string_coords())
    expect(block.toStringNames()).toBe(to_string_names())

    // console.log(block.toString())
    // console.log(block.toStringBlock())
    // console.log(block.toStringValue())
    // console.log(block.toStringCoords())
    // console.log(block.toStringNames())
  })
})


function to_string_block () : string
{
  return`+-----+-----+-----+
| 123 | 123 | 123 |
| 456 | 456 | 456 |
| 789 | 789 | 789 |
+-----+-----+-----+
| 123 | 123 | 123 |
| 456 | 456 | 456 |
| 789 | 789 | 789 |
+-----+-----+-----+
| 123 | 123 | 123 |
| 456 | 456 | 456 |
| 789 | 789 | 789 |
+-----+-----+-----+
`
}

function to_string_block_159 () : string
{
  return`+-----+-----+-----+
|     |  23 |  23 |
| [1] | 4 6 | 4 6 |
|     | 78  | 78  |
+-----+-----+-----+
|  23 |     |  23 |
| 4 6 | [5] | 4 6 |
| 78  |     | 78  |
+-----+-----+-----+
|  23 |  23 |     |
| 4 6 | 4 6 | [9] |
| 78  | 78  |     |
+-----+-----+-----+
`}

function to_string () : string
{
  return `# A1: ? [ 1,2,3,4,5,6,7,8,9 ]
# B1: ? [ 1,2,3,4,5,6,7,8,9 ]
# C1: ? [ 1,2,3,4,5,6,7,8,9 ]
# A2: ? [ 1,2,3,4,5,6,7,8,9 ]
# B2: ? [ 1,2,3,4,5,6,7,8,9 ]
# C2: ? [ 1,2,3,4,5,6,7,8,9 ]
# A3: ? [ 1,2,3,4,5,6,7,8,9 ]
# B3: ? [ 1,2,3,4,5,6,7,8,9 ]
# C3: ? [ 1,2,3,4,5,6,7,8,9 ]
`
}

function to_string_159 () : string
{
  return `# A1: 1 [ ]
# B1: ? [ 2,3,4,6,7,8 ]
# C1: ? [ 2,3,4,6,7,8 ]
# A2: ? [ 2,3,4,6,7,8 ]
# B2: 5 [ ]
# C2: ? [ 2,3,4,6,7,8 ]
# A3: ? [ 2,3,4,6,7,8 ]
# B3: ? [ 2,3,4,6,7,8 ]
# C3: 9 [ ]
`
}

function to_string_names () : string
{
  return `+--+--+--+
|A1|B1|C1|
+--+--+--+
|A2|B2|C2|
+--+--+--+
|A3|B3|C3|
+--+--+--+
`
}

function to_string_coords () : string
{
  return `+-----+-----+-----+
|(1,1)|(2,1)|(3,1)|
+-----+-----+-----+
|(1,2)|(2,2)|(3,2)|
+-----+-----+-----+
|(1,3)|(2,3)|(3,3)|
+-----+-----+-----+
`
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2
// END
