
// strategy-pointing-line.test.ts
// box & line Strategy unit testing

import { describe, expect, test     } from '@jest/globals'

import type { iUnit                 } from '@/js/interface/iUnit'
import { BoxModel                   } from '@/js/model/BoxModel'
import { LineModel                  } from '@/js/model/LineModel'
import { CellIndex                  } from '@/js/model/CellIndex'
import { CellValue                  } from '@/js/model/CellValue'
import { TextCellModel as CellModel } from '@/js/decorator/TextCellModel'
import { StrategyLogger             } from '@/js/strategy/StrategyLogger'
import { StrategyPointingLine       } from '@/js/strategy/StrategyPointingLine'
import { IntersectMap as IM         } from '@/js/model/IntersectMap'
import { CellArrayFormatter         } from '@/js/adapter/UnitStringAdapter'
import { TextAdapter                } from '@/js/adapter/TextAdapter'

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

class StrategyPointingLineTest extends StrategyPointingLine
{
    public call_strategy_pointing_line( box: BoxModel, line: LineModel, iB: IM, iL: IM ): boolean
    {
        return super.strategy_pointing_line(box, line, iB, iL)
    }
}


describe( 'StrategyPointingLine', () =>
{
    test( 'row@assemble+test', () =>
    {

      expect(StrategyPointingLine).toBeDefined()
      expect(StrategyPointingLineTest).toBeDefined()
  
      // Use center of Sudoku board
      const box_cell_members: Array<CellModel> = cell_set(0, 6)
      const lne_cell_members: Array<CellModel> = []
  
      const c: CellModel = box_cell_members[0]
      const box: TestBoxModel = new TestBoxModel(box_cell_members)
  
      expect(box.as_cell_array.map( c => c.name ).join(',')).toBe('A7,B7,C7,A8,B8,C8,A9,B9,C9')

      // Populate the LINE with cells and intersect with BOX (properly!)
      for ( let x = 1 ; x <= 9 ; x++ )
      {
        if ( x > 3 )
          lne_cell_members.push( CellModel.factory( x, 7, true ))
        else
          lne_cell_members.push( box.as_cell_array[x-1] );
      }

      const line: TestLineModel = new TestLineModel(lne_cell_members)

      // Small Cell sanity check
      expect(c.toString()).toBe('# A7: ? [ 1,2,3,4,5,6,7,8,9 ]')
      expect(c.name).toBe('A7')
      expect(c.length).toBe(9)

      // Verify BOX & LINE cell members
      expect(IM.iR1.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A7,B7,C7')
      expect(IM.iR2.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A8,B8,C8')
      expect(IM.iR3.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A9,B9,C9')
      expect(lne_cell_members.map( c => c.name ).join(',')).toBe('A7,B7,C7,D7,E7,F7,G7,H7,I7')
      expect(IM.iR1.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('A7,B7,C7')
      expect(IM.iR2.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('D7,E7,F7')
      expect(IM.iR3.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('G7,H7,I7')


      // Setup for pointing line strategy
      expect(box.is(CellIndex.FIVE, CellValue.THREE)).toBe(true)
      expect(box.is(CellIndex.SEVEN, CellValue.SIX)).toBe(true)
      expect(box.is(CellIndex.NINE, CellValue.ONE)).toBe(true)
      expect(line.is(CellIndex.FOUR, CellValue.SEVEN)).toBe(true)
      expect(line.is(CellIndex.SIX, CellValue.ONE)).toBe(true)
      expect(line.is(CellIndex.NINE, CellValue.FIVE)).toBe(true)
      expect(line.is(CellIndex.EIGHT, CellValue.SIX)).toBe(true)
      expect(box.exclude(CellIndex.FOUR, CellValue.TWO)).toBe(true)
      expect(box.exclude(CellIndex.SIX, CellValue.TWO)).toBe(true)
      expect(box.exclude(CellIndex.EIGHT, CellValue.TWO)).toBe(true)

      // Logger & Strategy
      const logger = new StrategyLogger()
      const strategy = new StrategyPointingLineTest(logger)

      // Apply Strategy - cleanup on isle "2"
      //     strategy.call_strategy_pointing_line(box, line, IM.iR1, IM.iR1 )
      expect(strategy.call_strategy_pointing_line(box, line, IM.iR1, IM.iR1 )).toBe(true)

      // console.log(logger)
      expect(logger.as_array.length).toBe(5)
      expect(logger.as_array.includes('  Cleaning: 1 - [2]')).toBe(true)
      expect(logger.as_array.filter( c => c == '# Strategy 1 - pointing_line cleaned 2 candicates').length).toBe(1)

      // console.log('line:\n' + line.toString())
      // console.log(' box: (names)\n' + box.toStringNames()
      //         , '\nline: (names)\n' + line.toStringNames())

      // console.log(' box:\n' + TF(box).toStringState()   // UnitStringAdapter.BoxString(box)
      //        + '\n line:\n' + TF(line).toStringState())  // UnitStringAdapter.LineString(line))

      // console.log(format_units([box, line]))

      const solution_text = format_units([box, line])
      expect(solution_text.split(/\n/).length).toBe(3*4+3)
      expect(solution_text.split(/\n/)[0].trim().split(/\s+/).join(',')).toBe('A,B,C,D,E,F,G,H,I')
      expect(solution_text.split(/\n/).filter( l => l.match(/[1-9]$/)).map(l => l.split(/\s+/).reverse()[0]).join(',')).toBe('7,8,9')
    })
})

describe('StrategyBoxLine', () => {

    test('/col@assembly+test', () => {

        expect(StrategyPointingLine).toBeDefined()
        expect(StrategyPointingLineTest).toBeDefined()

        // Use center of Sudoku board
        const box_cell_members: Array<CellModel> = cell_set(0, 3)
        const lne_cell_members: Array<CellModel> = []

        const c: CellModel = box_cell_members[0]
        const box: TestBoxModel = new TestBoxModel(box_cell_members)

        // Populate the LINE with cells and intersect with BOX (properly!)
        for ( let y = 1 ; y <= 9 ; y++ )
        {
          switch ( y )
          {
            case 4: lne_cell_members.push( box.as_cell_array[2] ); break
            case 5: lne_cell_members.push( box.as_cell_array[5] ); break
            case 6: lne_cell_members.push( box.as_cell_array[8] ); break
            default: lne_cell_members.push( CellModel.factory( 3, y, true ))
          }
        }

        const line: TestLineModel = new TestLineModel(lne_cell_members)

        // Small Cell sanity check
        expect(c.toString()).toBe('# A4: ? [ 1,2,3,4,5,6,7,8,9 ]')
        expect(c.name).toBe('A4')
        expect(c.length).toBe(9)

        // Verify BOX & LINE cell members
        expect(IM.iC1.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A4,A5,A6')
        expect(IM.iC2.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('B4,B5,B6')
        expect(IM.iC3.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('C4,C5,C6')
        expect(IM.iR1.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A4,B4,C4')
        expect(IM.iR2.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A5,B5,C5')
        expect(IM.iR3.getIntersectCells(box.as_cell_array).map( c => c.name ).join(',')).toBe('A6,B6,C6')
        expect(line.as_cell_array.map( c => c.name ).join(',')).toBe('C1,C2,C3,C4,C5,C6,C7,C8,C9')
        expect(IM.iR1.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('C1,C2,C3')
        expect(IM.iR2.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('C4,C5,C6')
        expect(IM.iR3.getIntersectCells(lne_cell_members).map( c => c.name ).join(',')).toBe('C7,C8,C9')

        // Setup for pointing line strategy
        expect(box.is(CellIndex.ONE, CellValue.FIVE)).toBe(true)
        expect(box.is(CellIndex.FIVE, CellValue.SIX)).toBe(true)
        expect(box.is(CellIndex.SEVEN, CellValue.THREE)).toBe(true)
        expect(line.is(CellIndex.ONE, CellValue.TWO)).toBe(true)
        expect(line.is(CellIndex.NINE, CellValue.SEVEN)).toBe(true)
        expect(box.exclude(CellIndex.TWO, CellValue.ONE)).toBe(true)
        expect(box.exclude(CellIndex.FOUR, CellValue.ONE)).toBe(true)
        expect(box.exclude(CellIndex.EIGHT, CellValue.ONE)).toBe(true)

        // Logger & Strategy
        const logger = new StrategyLogger()
        const strategy_box_line = new StrategyPointingLineTest(logger)

        // Apply Strategy - cleanup on isle "1"
        expect(strategy_box_line.call_strategy_pointing_line( box, line, IM.iC3, IM.iR2 )).toBe(true)
        // console.log(logger)
        expect(logger.as_array.length).toBe(5)
        expect(logger.as_array.includes('  Cleaning: 1 - [1]')).toBe(true)
        expect(logger.as_array.includes('# Strategy 1 - pointing_line cleaned 4 candicates')).toBe(true)

        const solution_text = format_units([box, line])
        expect(solution_text.split(/\n/).length).toBe(9*4+3)
        expect(solution_text.split(/\n/)[0].trim().split(/\s+/).join(',')).toBe('A,B,C')

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


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END