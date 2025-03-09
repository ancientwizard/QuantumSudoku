
// block-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { TextCellModel          } from '@/js/decorator/TextCellModel'
import { BoxModel               } from '@/js/model/BoxModel'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { TextAdapter            } from '@/js/adapter/TextAdapter'

const TF = TextAdapter.factory

class TestBoxModel extends BoxModel
{
  public toString             () : string { return TF(this).toString() }
  public toStringBox          () : string { return TF(this).toStringBox() }
  public toStringCoords       () : string { return TF(this).toStringCoords() }
  public toStringNames        () : string { return TF(this).toStringNames() }
  public toStringValues       () : string { return TF(this).toStringValues() }
  public toStringValuesBasic  () : string { return TF(this).toStringValuesBasic() }
}

function mk_cells ( autosolve = true ) : Array<TextCellModel>
{
  const cell_set : Array<TextCellModel> = []

  for ( let y = 1 ; y <= 3 ; y++ )
    for ( let x = 1 ; x <= 3 ; x++ )
      cell_set.push(TextCellModel.factory(x,y,autosolve))

  return cell_set
}

function mk_block ( autosolve = true ) : TestBoxModel
{
  return new TestBoxModel(mk_cells( autosolve ))
}


describe('model/block-model/grid-mapping', () => {

  test('row/col mapping', () => {
    expect(BoxModel.iC1.length).toBe(3); expect(BoxModel.iR1.length).toBe(3)
    expect(BoxModel.iC2.length).toBe(3); expect(BoxModel.iR2.length).toBe(3)
    expect(BoxModel.iC3.length).toBe(3); expect(BoxModel.iR3.length).toBe(3)

    expect(BoxModel.iC1[0].index).toBe(0); expect(BoxModel.iC1[0].name).toBe("1")
    expect(BoxModel.iC1[1].index).toBe(3); expect(BoxModel.iC1[1].name).toBe("4") 
    expect(BoxModel.iC1[2].index).toBe(6); expect(BoxModel.iC1[2].name).toBe("7")

    expect(BoxModel.iC2[0].index).toBe(1); expect(BoxModel.iC2[0].name).toBe("2")
    expect(BoxModel.iC2[1].index).toBe(4); expect(BoxModel.iC2[1].name).toBe("5")
    expect(BoxModel.iC2[2].index).toBe(7); expect(BoxModel.iC2[2].name).toBe("8")

    expect(BoxModel.iC3[0].index).toBe(2); expect(BoxModel.iC3[0].name).toBe("3")
    expect(BoxModel.iC3[1].index).toBe(5); expect(BoxModel.iC3[1].name).toBe("6")
    expect(BoxModel.iC3[2].index).toBe(8); expect(BoxModel.iC3[2].name).toBe("9")

    expect(BoxModel.iR1[0].index).toBe(0); expect(BoxModel.iR1[0].name).toBe("1")
    expect(BoxModel.iR1[1].index).toBe(1); expect(BoxModel.iR1[1].name).toBe("2")
    expect(BoxModel.iR1[2].index).toBe(2); expect(BoxModel.iR1[2].name).toBe("3")

    expect(BoxModel.iR2[0].index).toBe(3); expect(BoxModel.iR2[0].name).toBe("4")
    expect(BoxModel.iR2[1].index).toBe(4); expect(BoxModel.iR2[1].name).toBe("5")
    expect(BoxModel.iR2[2].index).toBe(5); expect(BoxModel.iR2[2].name).toBe("6")

    expect(BoxModel.iR3[0].index).toBe(6); expect(BoxModel.iR3[0].name).toBe("7")
    expect(BoxModel.iR3[1].index).toBe(7); expect(BoxModel.iR3[1].name).toBe("8")
    expect(BoxModel.iR3[2].index).toBe(8); expect(BoxModel.iR3[2].name).toBe("9")
  })
})

describe('model/block-model/constructor', () => 
  test('constructor', () => {
    const block = mk_block()
    expect(block).toBeInstanceOf(BoxModel)
    block.as_cell_array.forEach((cell) => {
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

  test('box->toString',     () => expect(block.toString()).toBe(to_string()))
  test('box->StringBox',    () => expect(block.toStringBox()).toBe(to_string_block()))
  test('box->StringValues', () => expect(block.toStringValues()).toBe('? ? ? ? ? ? ? ? ?'))
  test('box->StringNames',  () => expect(block.toStringNames()).toBe(to_string_names()))
  test('box->StringCoords', () => expect(block.toStringCoords()).toBe(to_string_coords()))

  // console.log(block.toString())
})

describe('model/block-model/string-checks-159', () => {

  test('is([1,1,[5,5],[9,9])/string', () => {
    const block = mk_block()

    expect(block.is(CellIndex.ONE,  CellValue.ONE)).toBe(true)
    expect(block.is(CellIndex.FIVE, CellValue.FIVE)).toBe(true)
    expect(block.is(CellIndex.NINE, CellValue.NINE)).toBe(true)

    expect(block.toString()).toBe(to_string_159())
    expect(block.toStringBox()).toBe(to_string_block_159())
    expect(block.toStringValues()).toBe('1 ? ? ? 5 ? ? ? 9')
    expect(block.toStringCoords()).toBe(to_string_coords())
    expect(block.toStringNames()).toBe(to_string_names())

    // console.log(block.toString())
    // console.log(block.toStringBox())
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


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
