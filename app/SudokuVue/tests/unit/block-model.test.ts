
// block-model.test.ts

import { describe, expect, test } from '@jest/globals'
import { BlockModel             } from '@/js/model/BlockModel'

describe('model/block-model', () => {

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

  test('dummy', () => { expect(true).toBe(true) })

})

// vim: expandtab number tabstop=2
// END
