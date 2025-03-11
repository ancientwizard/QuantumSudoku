
// strategy-box-line.test.ts
// box & Line Strategy unit testing

import { describe, expect, test  } from '@jest/globals'

import { BoxModel                   } from '@/js/model/BoxModel'
import { LineModel                  } from '@/js/model/LineModel'
import { BoardModel                 } from '@/js/model/BoardModel'
import { BoardMode                  } from '@/js/model/BoardModel' 
import { StrategyMappingFactory     } from '@/js/strategy/StrategyMappingFactory'
import { CellIndex                  } from '@/js/model/CellIndex'
import { CellValue                  } from '@/js/model/CellValue'
import { TextCellModel as CellModel } from '@/js/decorator/TextCellModel'
import { StrategyLogger             } from '@/js/strategy/StrategyLogger'
import { StrategyBoxLine            } from '@/js/strategy/StrategyBoxLine'
import { IntersectMap as IM         } from '@/js/model/IntersectMap'
import { CellArrayFormatter         } from '@/js/adapter/UnitStringAdapter'
import { TextAdapter                } from '@/js/adapter/TextAdapter'
import type { iUnit } from '@/js/interface/iUnit'

// ALIAS: TEXT-FACTORY
const TF = TextAdapter.factory

class TestLineModel extends LineModel
{
  public toString       () : string { return TF(this).toString() }
  public toStringBox    () : string { return TF(this).toStringBox() }
  public toStringState  () : string { return TF(this).toStringState() }
  public toStringValues () : string { return TF(this).toStringValues() }
  public toStringNames  () : string { return TF(this).toStringNames() }
}

class TestBoxModel extends BoxModel
{
  public toString       () : string { return TF(this).toString() }
  public toStringValues () : string { return TF(this).toStringValues() }
  public toStringNames  () : string { return TF(this).toStringNames() }
}

//port { CellFormatter            } from '@/js/adapter/UnitStringAdapter'

class StrategyBoxLineTest extends StrategyBoxLine
{
    public call_strategy_box_line( box: BoxModel, line: LineModel, iB: IM, iL: IM ): boolean
    {
        return super.strategy_box_line(box, line, iB, iL)
    }
}

describe('strategy/box-line', () => {

  test('/row@assembly+test', () => {

    expect(StrategyBoxLine).toBeDefined()
    expect(StrategyBoxLineTest).toBeDefined()

    // Use center of Sudoku board
    const box_cell_members: Array<CellModel> = cell_set(3, 3)
    const lne_cell_members: Array<CellModel> = []

    const c: CellModel = box_cell_members[0]
    const box: TestBoxModel = new TestBoxModel(box_cell_members)

    expect(box_cell_members.map( c => c.name ).join(',')).toBe('D4,E4,F4,D5,E5,F5,D6,E6,F6')

    // Populate the LINE with cells and intersect with BOX (properly!)
    for ( let x = 1 ; x <= 9 ; x++ )
    {
      if ( x < 4 || x > 6 )
        lne_cell_members.push( CellModel.factory( x, 5, true ))
      else
        lne_cell_members.push( box.as_cell_array[x-1] );
    }

    const line: TestLineModel = new TestLineModel(lne_cell_members)

    // Small Cell sanity check
    expect(c.toString()).toBe('# D4: ? [ 1,2,3,4,5,6,7,8,9 ]')
    expect(c.name).toBe('D4')
    expect(c.length).toBe(9)

    // Verify BOX & LINE cell members
    expect(IM.iR1.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('D4,E4,F4')
    expect(IM.iR2.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('D5,E5,F5')
    expect(IM.iR3.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('D6,E6,F6')
    expect(lne_cell_members.map( c => c.name ).join(',')).toBe('A5,B5,C5,D5,E5,F5,G5,H5,I5')
    expect(IM.iR1.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('A5,B5,C5')
    expect(IM.iR2.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('D5,E5,F5')
    expect(IM.iR3.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('G5,H5,I5')

    // Set up for box-line strategy
    expect(box.is(CellIndex.ONE, CellValue.SEVEN)).toBe(true)
    expect(box.is(CellIndex.TWO, CellValue.TWO)).toBe(true)
    expect(box.is(CellIndex.SIX, CellValue.THREE)).toBe(true)
    expect(box.is(CellIndex.SEVEN, CellValue.EIGHT)).toBe(true)
    expect(line.is(CellIndex.TWO, CellValue.SEVEN)).toBe(true)
    expect(line.is(CellIndex.SEVEN, CellValue.EIGHT)).toBe(true)
    expect(line.is(CellIndex.EIGHT, CellValue.NINE)).toBe(true)
    expect(line.exclude(CellIndex.ONE, CellValue.FOUR)).toBe(true)
    expect(line.exclude(CellIndex.THREE, CellValue.FOUR)).toBe(true)
    expect(line.exclude(CellIndex.NINE, CellValue.FOUR)).toBe(true)

    // Logger & Strategy
    const logger = new StrategyLogger()
    const strategy_box_line = new StrategyBoxLineTest(logger)

    // Apply Strategy - cleanup on isle "4"
    expect(strategy_box_line.call_strategy_box_line( box, line, IM.iR2, IM.iR2 )).toBe(true)
    expect(logger.as_array.length).toBe(4)
    expect(logger.as_array.includes('  Cleaning: 1 - [4]')).toBe(true)
    expect(logger.as_array.includes('# Strategy 1 - box_line cleaned 3 candicates')).toBe(true)
    // console.log(logger)

    // Ready for next BOX-LINE for cleanup on isle "6"
    expect(line.exclude(CellIndex.ONE, CellValue.SIX)).toBe(true)
    expect(line.exclude(CellIndex.THREE, CellValue.SIX)).toBe(true)
    expect(line.exclude(CellIndex.NINE, CellValue.SIX)).toBe(true)

    expect(strategy_box_line.call_strategy_box_line( box, line, IM.iR2, IM.iR2 )).toBe(true)
    expect(logger.as_array.length).toBe(8)
    expect(logger.as_array.includes('  Cleaning: 2 - [4,6]')).toBe(true)
    expect(logger.as_array.filter( c => c == '# Strategy 1 - box_line cleaned 3 candicates').length).toBe(2)
    // console.log(logger)

    // expect(box.is(CellIndex.ONE, CellValue.FIVE)).toBe(true)
    // expect(box.is(CellIndex.FOUR, CellValue.EIGHT)).toBe(true)
    // expect(box.is(CellIndex.NINE, CellValue.ONE)).toBe(true)
    // expect(box.is(CellIndex.EIGHT, CellValue.THREE)).toBe(true)
    // expect(box.is(CellIndex.SIX, CellValue.NINE)).toBe(true)
    // expect(box.is(CellIndex.TWO, CellValue.SIX)).toBe(true)
    // expect(box.is(CellIndex.SEVEN, CellValue.FOUR)).toBe(true)
    // expect(box.is(CellIndex.FIVE, CellValue.SEVEN)).toBe(true)

    // console.log(' box:\n' + box.toString())
    // expect( box.reset()).toBe(undefined)
    // console.log(' box:\n' + box.toString())

    // BOX Line ( reuse box intersect )
    // console.log('BOX-Line')

    // console.log(' box:\n' + box.toString())
    // console.log('line:\n' + line.toString())
    // console.log(' box: (names)\n' + box.toStringNames()
    //         , '\nline: (names)\n' + line.toStringNames())

    // console.log(' box:\n' + TF(box).toStringState()   // UnitStringAdapter.BoxString(box)
    //        + '\n line:\n' + TF(line).toStringState())  // UnitStringAdapter.LineString(line))

    // console.log(format_units([box, line]))
  })

})

describe('strategy/box-line', () => {

  test('/col@assembly+test', () => {

    expect(StrategyBoxLine).toBeDefined()
    expect(StrategyBoxLineTest).toBeDefined()

    const box_cell_members: Array<CellModel> = cell_set(6, 0)
    const lne_cell_members: Array<CellModel> = []

    const c: CellModel = box_cell_members[0]
    const box: TestBoxModel = new TestBoxModel(box_cell_members)

    // Small Cell sanity check
    expect(c.toString()).toBe('# G1: ? [ 1,2,3,4,5,6,7,8,9 ]')
    expect(c.name).toBe('G1')
    expect(c.length).toBe(9)

    expect(box_cell_members.map( c => c.name ).join(',')).toBe('G1,H1,I1,G2,H2,I2,G3,H3,I3')

    // Populate the LINE with cells and intersect with BOX (properly!)
    for ( let y = 1 ; y <= 9 ; y++ )
    {
      switch (y)
      {
        case  1: lne_cell_members.push( box.as_cell_array[0] ); break
        case  2: lne_cell_members.push( box.as_cell_array[3] ); break
        case  3: lne_cell_members.push( box.as_cell_array[6] ); break
        default: lne_cell_members.push( CellModel.factory( 7, y, true ))
      }
    }
  
    const line: TestLineModel = new TestLineModel(lne_cell_members)

    // console.log(' box:\n' + box.toString())
    // console.log('line:\n' + line.toString())
    // console.log(' box: (names)\n' + box.toStringNames()
    //         , '\nline: (names)\n' + line.toStringNames())

    expect(format_units([box, line]).split('\n')[0].split(/\s+/).filter(m => m).join(',')).toBe('G,H,I')
    expect(format_units([box, line]).split('\n').length).toBe(4*9+3)

    // Verify BOX & LINE cell members
    expect(IM.iR1.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('G1,H1,I1')
    expect(IM.iR2.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('G2,H2,I2')
    expect(IM.iR3.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('G3,H3,I3')
    expect(IM.iC1.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('G1,G2,G3')
    expect(IM.iC2.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('H1,H2,H3')
    expect(IM.iC3.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('I1,I2,I3')
    expect(line.as_cell_array.map( c => c.name ).join(',')).toBe('G1,G2,G3,G4,G5,G6,G7,G8,G9')
    expect(IM.iR1.getIntersectCells(line.as_cell_array).map( c => c.name ).join(',')).toBe('G1,G2,G3')
    expect(IM.iR2.getIntersectCells(line.as_cell_array).map( c => c.name ).join(',')).toBe('G4,G5,G6')
    expect(IM.iR3.getIntersectCells(line.as_cell_array).map( c => c.name ).join(',')).toBe('G7,G8,G9')

    // Set up for box-line strategy
    expect(box.is(CellIndex.ONE, CellValue.SEVEN)).toBe(true)
    expect(box.is(CellIndex.THREE, CellValue.ONE)).toBe(true)
    expect(box.is(CellIndex.EIGHT, CellValue.EIGHT)).toBe(true)
    expect(line.is(CellIndex.FOUR, CellValue.THREE)).toBe(true)
    expect(line.is(CellIndex.SIX, CellValue.EIGHT)).toBe(true)
    expect(line.is(CellIndex.SEVEN, CellValue.SIX)).toBe(true)
    expect(line.is(CellIndex.EIGHT, CellValue.ONE)).toBe(true)
    expect(line.exclude(CellIndex.FIVE, CellValue.TWO)).toBe(true)
    expect(line.exclude(CellIndex.NINE, CellValue.TWO)).toBe(true)
    expect(line.exclude(CellIndex.FIVE, CellValue.NINE)).toBe(true)
    expect(line.exclude(CellIndex.NINE, CellValue.NINE)).toBe(true)

    // Logger & Strategy
    const logger = new StrategyLogger()
    const strategy_box_line = new StrategyBoxLineTest(logger)

    // Apply Strategy - cleanup on isle "2 & 9"
    expect(strategy_box_line.call_strategy_box_line( box, line, IM.iC1, IM.iR1 )).toBe(true)
    expect(logger.as_array.length).toBe(4)
    expect(logger.as_array.includes('  Cleaning: 2 - [2,9]')).toBe(true)
    expect(logger.as_array.includes('# Strategy 1 - box_line cleaned 8 candicates')).toBe(true)
    // console.log(logger)

    // console.log(format_units([box, line]))
  })
})


function format_units( units: Array<iUnit> ): string
{
  const formatter = new CellArrayFormatter(true)
  units.forEach( unit => unit.as_cell_array.forEach( c => formatter.apply(c)))
  return formatter.toString()
}

function cell_set ( x_offset: number, y_offset: number ): Array<CellModel>
{
  const members: Array<CellModel> = []

  if ( x_offset != 0 && x_offset != 3 && x_offset != 6 ) throw new Error('x_offset must be 0, 3, or 6')

  // Create a 3x3 cell set
  for ( let y = 1 ; y <= 3 ; y++ )
  for ( let x = 1 ; x <= 3 ; x++ )
  {
      members.push(CellModel.factory(x+x_offset, y+y_offset, true ))
  }

  return members
}

// function apply_template( board: BoardModel, template: number[][] = get_template() ) : number[][]
// {
//   const ci_set = CellIndex.arrayFactory
//   const cv_set = CellValue.arrayFactory

//   template.forEach((row, Yidx) => {
//     row.forEach((cv, Xidx) => {
//       if (cv === 0)
//         return
//       board.set(ci_set[Xidx], ci_set[Yidx], cv_set[cv - 1])
//     })
//   })

//   return template
// }

// function get_template() : number[][]
// {
//   return [
//     [5, 6, 4, 2, 9, 1, 3, 8, 7],
//     [0, 0, 0, 5, 0, 0, 0, 0, 4],
//     [0, 0, 0, 4, 0, 8, 2, 0, 5],
//     [0, 0, 0, 0, 0, 0, 0, 2, 0],
//     [0, 0, 0, 1, 4, 0, 5, 7, 0],
//     [0, 3, 0, 7, 2, 0, 4, 0, 9],
//     [2, 7, 9, 0, 0, 4, 0, 0, 0],
//     [1, 5, 0, 0, 0, 0, 9, 4, 2],
//     [0, 0, 0, 9, 0, 2, 7, 0, 0]
//  ]
// }

// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |     |     |     |     |     |     |     |     |     |
// | [5] | [6] | [4] | [2] | [9] | [1] | [3] | [8] | [7] | 1
// |     |     |     |     |     |     |     |     |     |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |   3 | 12  | 123 |     |   3 |   3 | 1   | 1   |     |
// |     |     |     | [5] |   6 |   6 |   6 |   6 | [4] | 2
// | 789 |  89 | 78  |     | 7   | 7   |     |   9 |     |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |   3 | 1   | 1 3 |     |   3 |     |     | 1   |     |
// |     |     |     | [4] |   6 | [8] | [2] |   6 | [5] | 3
// | 7 9 |   9 | 7   |     | 7   |     |     |   9 |     |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |     | 1   | 1   |   3 |   3 |   3 | 1   |     | 1 3 |
// | 4 6 | 4   |  56 |   6 |   6 |  56 |   6 | [2] |   6 | 4
// | 789 |  89 | 78  |  8  |  8  |   9 |  8  |     |  8  |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |     |  2  |  2  |     |     |   3 |     |     |   3 |
// |   6 |     |   6 | [1] | [4] |   6 | [5] | [7] |   6 | 5
// |  89 |  89 |  8  |     |     |   9 |     |     |  8  |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |     |     | 1   |     |     |     |     | 1   |     |
// |   6 | [3] |  56 | [7] | [2] |  56 | [4] |   6 | [9] | 6
// |  8  |     |  8  |     |     |     |     |     |     |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |     |     |     |   3 | 1   |     | 1   |   3 | 1   |
// | [2] | [7] | [9] |   6 |  5  | [4] |   6 |  5  |   6 | 7
// |     |     |     |  8  |     |     |  8  |     |  8  |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |     |     |   3 |   3 |   3 |   3 |     |     |     |
// | [1] | [5] |   6 |   6 |   6 |   6 | [9] | [4] | [2] | 8
// |     |     |  8  |  8  | 78  | 7   |     |     |     |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+
// |   3 |     |   3 |     | 1   |     |     |   3 | 1   |
// | 4 6 | 4   |   6 | [9] |  5  | [2] | [7] |  5  |   6 | 9
// |  8  |  8  |  8  |     |     |     |     |     |  8  |
// +-----+-----+-----+-----+-----+-----+-----+-----+-----+


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
