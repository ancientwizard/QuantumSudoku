
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
import { IntersectMap               } from '@/js/model/IntersectMap'
import { CellArrayFormatter         } from '@/js/adapter/UnitStringAdapter'
import { TextAdapter                } from '@/js/adapter/TextAdapter'


// TEXT-FACTORY
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
    public call_strategy_box_line( box: BoxModel, line: LineModel, iB: IntersectMap, iL: IntersectMap ): boolean
    {
        return super.strategy_box_line(box, line, iB, iL)
    }
}

describe('strategy/box-line(row)', () => {

  test('/assembly', () => {

    // console.log(IntersectMap.iR1)

    expect(StrategyBoxLine).toBeDefined()
    expect(StrategyBoxLineTest).toBeDefined()

    // Use center of Sudoku board
    const members: Array<CellModel> = cell_set(3, 3)
    const c: CellModel = members[0]
    const box: TestBoxModel = new TestBoxModel(members)

    // console.log('** box members: **', members.map( c => c.name ).join(','))
    expect(members.map( c => c.name ).join(',')).toBe('D4,E4,F4,D5,E5,F5,D6,E6,F6')

    expect(c.toString()).toBe('# D4: ? [ 1,2,3,4,5,6,7,8,9 ]')
    expect(c.name).toBe('D4')
    expect(c.length).toBe(9)

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

    const line_members: Array<CellModel> = []

    for ( let x = 1 ; x <= 9 ; x++ )
    {
      if ( x < 4 || x > 6 )
        line_members.push( CellModel.factory( x, 5, true ))
      else
        line_members.push( box.as_cell_array[x-1] );
    }

    expect(line_members.map( c => c.name ).join(',')).toBe('A5,B5,C5,D5,E5,F5,G5,H5,I5')

    const logger = new StrategyLogger()
    const strategy_box_line = new StrategyBoxLineTest(logger)
    const line = new TestLineModel(line_members)

    CellIndex.arrayFactory.forEach((i,x) => {
        [3,4].includes(x) && expect(box.exclude(i, CellValue.ONE)).toBe(true)
    })

    // const bx: Array<CellIndex> = [ CellIndex.ONE, CellIndex.TWO, CellIndex.THREE, CellIndex.FIVE, CellIndex.SEVEN, CellIndex.EIGHT, CellIndex.NINE ];

    // for ( const q of bx )
    // {
    //     box.exclude(q, CellValue.ONE)
    //     box.exclude(q, CellValue.SEVEN)
    // }

    // box.exclude(CellIndex.FIVE, CellValue.ONE)

    // console.log(' box:\n' + box.toString())
    // console.log('line:\n' + line.toString())
    // console.log(' box: (names)\n' + box.toStringNames()
    //         , '\nline: (names)\n' + line.toStringNames())
// TODO; I'm here; what a mess!
    strategy_box_line.call_strategy_box_line( box, line, IntersectMap.iR2, IntersectMap.iR2 )
    console.log(logger)

    // // Box Line
    // for ( let i = 4 ; i <= 9 ; i++ )
    // {
    //     line.exclude(CellIndex.by(i-1), CellValue.FOUR)
    //     line.exclude(CellIndex.by(i-1), CellValue.EIGHT)
    // }

    // strategy_box_line.call_strategy_box_line( box, line, IntersectMap.iR2, IntersectMap.iR1 )

    // console.log(' box:\n' + box.toString())
    // console.log('line:\n' + line.toString())
    // console.log(' box: (names)\n' + box.toStringNames()
    //         , '\nline: (names)\n' + line.toStringNames())

    // box.reset()
    // box.is(CellIndex.ONE, CellValue.ONE)
    // box.is(CellIndex.TWO, CellValue.TWO)
    // box.is(CellIndex.FIVE, CellValue.FIVE)
    // box.is(CellIndex.SIX, CellValue.SIX)
    // box.is(CellIndex.SEVEN, CellValue.SEVEN)
    // box.is(CellIndex.EIGHT, CellValue.EIGHT)
    // box.is(CellIndex.NINE, CellValue.NINE)

    // console.log(' box:\n' + TF(box).toStringState()   // UnitStringAdapter.BoxString(box)
    //        + '\n line:\n' + TF(line).toStringState())  // UnitStringAdapter.LineString(line))

    const formatter = new CellArrayFormatter(true)
    box.as_cell_array.forEach( c => formatter.apply(c))
    line.as_cell_array.forEach( c => formatter.apply(c))
    console.log(formatter.toString())
  })

})

describe('strategy/box-col', () => {

  test('/assembly', () => {
return
    console.log(IntersectMap.iR1)

    expect(StrategyBoxLine).toBeDefined()
    expect(StrategyBoxLineTest).toBeDefined()

    const members: Array<CellModel> = []

    for ( let y = 1, i = 1 ; y <= 3 ; y++ )
    for ( let x = 1 ; x <= 3 ; x++, i++ )
    {
        members.push(CellModel.factory(x+3, y+3, true ))
    }

    console.log('members:', members.map( c => c.name ).join(','))

    const c: CellModel = members[0]
    const box: TestBoxModel = new TestBoxModel(members)

    console.log('members:', members.map( c => c.name ).join(','))
    console.log('observers:', c.length, 'Should this be 8?')

    console.log('box: is(1,5)', box.is(CellIndex.ONE, CellValue.FIVE))
    console.log('box:\n' + box.toString())

    box.is(CellIndex.FOUR, CellValue.EIGHT)
    box.is(CellIndex.NINE, CellValue.ONE)
    box.is(CellIndex.EIGHT, CellValue.THREE)
    box.is(CellIndex.SIX, CellValue.NINE)
    box.is(CellIndex.TWO, CellValue.SIX)
    box.is(CellIndex.SEVEN, CellValue.FOUR)
    box.is(CellIndex.FIVE, CellValue.SEVEN)
    console.log('box:\n' + box.toString())

    console.log('box.reset: ', box.reset())
    console.log('cell:', + c.toString())
    console.log(' box:\n' + box.toString())

    // Pointing Line
    console.log('Pointing-Line')

    const line_members: Array<CellModel> = []
    const cells = box.as_cell_array

    for ( let y = 1 ; y <= 9 ; y++ )
    {
      if ( y < 4 || y > 6 )
        line_members.push( CellModel.factory( 5, y, true ))
      else
      switch (y)
      {
        case 4: line_members.push( cells[1] ); break
        case 5: line_members.push( cells[4] ); break
        case 6: line_members.push( cells[7] ); break
      }
    }

    // for ( let y = 1 ; y <= 9 ; y++ )
    // {
    //   if ( y < 4 || y > 6 )
    //     line_members.push( CellModel.factory( 5, y, true ))
    //   else
    //   switch (y)
    //   {
    //     case 4: line_members.push( box.as_cell_array[1] ); break
    //     case 5: line_members.push( box.as_cell_array[4] ); break
    //     case 6: line_members.push( box.as_cell_array[7] ); break
    //   }
    // }

    // expect(line_members.map( c => c.name ).join(',')).toBe('E1,E2,E3,E4,E5,E6,E7,E8,E9')

    const line = new TestLineModel(line_members)
    const logger = new StrategyLogger()
    const strategy_box_line = new StrategyBoxLineTest(logger)

    const bx: Array<CellIndex> = [ CellIndex.ONE, CellIndex.TWO, CellIndex.THREE, CellIndex.SEVEN, CellIndex.EIGHT, CellIndex.NINE ];

    for ( const q of bx )
    {
        box.exclude(q, CellValue.ONE)
        box.exclude(q, CellValue.SEVEN)
    }

    box.exclude(CellIndex.FIVE, CellValue.ONE)

    console.log(' box:\n' + box.toString())
    console.log('line:\n' + line.toString())
    console.log(' box: (names)\n' + box.toStringNames()
            , '\nline: (names)\n' + line.toStringNames())

    strategy_box_line.call_strategy_box_line( box, line, IntersectMap.iR2, IntersectMap.iR1 )

    // Box Line
    for ( let i = 4 ; i <= 9 ; i++ )
    {
        line.exclude(CellIndex.by(i-1), CellValue.FOUR)
        line.exclude(CellIndex.by(i-1), CellValue.EIGHT)
    }

    strategy_box_line.call_strategy_box_line( box, line, IntersectMap.iR2, IntersectMap.iR1 )

    console.log(' box:\n' + box.toString())
    console.log('line:\n' + line.toString())
    console.log(' box: (names)\n' + box.toStringNames()
            , '\nline: (names)\n' + line.toStringNames())

    box.reset()
    box.is(CellIndex.ONE, CellValue.ONE)
    box.is(CellIndex.TWO, CellValue.TWO)
    box.is(CellIndex.FIVE, CellValue.FIVE)
    box.is(CellIndex.SIX, CellValue.SIX)
    box.is(CellIndex.SEVEN, CellValue.SEVEN)
    box.is(CellIndex.EIGHT, CellValue.EIGHT)
    box.is(CellIndex.NINE, CellValue.NINE)

    console.log(' box(I2):\n' + TF(box).toStringState()   //  UnitStringAdapter.BoxString(box)
           + '\n line(C5):\n' + TF(line).toStringState()) // UnitStringAdapter.LineString(line))

    const formatter = new CellArrayFormatter(true)
    box.as_cell_array.forEach( c => formatter.apply(c))
    line.as_cell_array.forEach( c => formatter.apply(c))
    console.log(formatter.toString())
  })
})


describe('strategy/box-line(board)/setup', () => {
return
    const board = new BoardModel(BoardMode.SOLVE)

    const blks: Array<BoxModel>  = []
    const rows: Array<LineModel> = []
    const cols: Array<LineModel> = []

    // Messy but we'll refactor later; we need access to these items
    //  to play with strategy-box-line implementation for testing
    //  we'll make it more elegant later
    board.forEachBox( box => blks.push(box))
    board.forEachRow( row => rows.push(row))
    board.forEachCol( col => cols.push(col))

    // box & Line Strategy
    // GOAL: setup mapping for box-line strategy

    const rsets = StrategyMappingFactory.createBoxRowIntercepts()
    const csets = StrategyMappingFactory.createBoxColIntercepts()

    // 54 combinations of box-line mappings
    //  9 box's intersected with 3 rows & 3 columns each == 9 * ( 3 + 3 ) == 54
    test('strategy/box-row/interset-map-set/length ->> ' + rsets.length, () => expect(rsets.length).toBe(27))
    test('strategy/box-col/interset-map-set/length ->> ' + csets.length, () => expect(csets.length).toBe(27))

    // Proofs that intersect maps are setup correctly by testing selected cells by name.
    //  The single best way to idenfy a selected cell is by its location within the sudoku board.
    //  Each cell has a NAME defined as COLS: A-I + ROWS.1-9
    //  Each intercept returns three cells, each non-intercect returns six cells.
    // sets.forEach(( map_pair, idx ) => {
    //     test('strategy/box-line/intersect-map-set/sets['+idx+']', () => {
    //         const box = boxes[map_pair[0]].as_cell_array
    //         const line  = idx < 27 ? rows[map_pair[1]].as_cell_array : cols[map_pair[1]].as_cell_array
    //         const blk_imap = map_pair[2]
    //         const lne_imap = map_pair[3]
    //         const expected_intersect_names = map_pair[4][0]
    //         const expected_blk_non_intersect_names = map_pair[4][1]
    //         const expected_lne_non_intersect_names = map_pair[4][2] // need to add this data above
    //         expect(blk_imap.getIntersectCells(box).map( c => c.name ).join(',')).toBe(expected_intersect_names)
    //         expect(lne_imap.getIntersectCells(line).map( c => c.name ).join(',')).toBe(expected_intersect_names)
    //         expect(blk_imap.getNonIntersectCells(box).map( c => c.name ).join(',')).toBe(expected_blk_non_intersect_names)
    //         expect(lne_imap.getNonIntersectCells(line).map( c => c.name ).join(',')).toBe(expected_lne_non_intersect_names)
    //     })
    // })

    // Apply Sudoku board box-line detection template
    // const template = apply_template(board)
    // console.log(TF(board).toStringState())

    const logger = new StrategyLogger()
    new StrategyBoxLine(logger).apply(board)
    console.log(logger)

    // Use maps to apply box-line strategy to each of these set mappings
    //  where
    //  [0] is the box index
    //  [1] is the line index
    //  [2] is the box intersect map
    //  [3] is the line intersect map
    // sets.forEach( set => {
    //     const  box = boxes[set[0]]
    //     const line  = rows[set[1]]
    //     const  box_intersect_map = set[2]
    //     const line_intersect_map = set[3]

    //     // Apply box-line strategy to box-line mapping
    //     // strategy_box_line( box, line, box_intersect_map, line_intersect_map )
    // })

})


function cell_set ( x_offset: number, y_offset: number ): Array<CellModel>
{
  const members: Array<CellModel> = []

  // Use center of Sudoku board
  for ( let y = 1 ; y <= 3 ; y++ )
  for ( let x = 1 ; x <= 3 ; x++ )
  {
      members.push(CellModel.factory(x+x_offset, y+y_offset, true ))
  }

  return members
}

function apply_template( board: BoardModel, template: number[][] = get_template() ) : number[][]
{
  const ci_set = CellIndex.arrayFactory
  const cv_set = CellValue.arrayFactory

  template.forEach((row, Yidx) => {
    row.forEach((cv, Xidx) => {
      if (cv === 0)
        return
      board.set(ci_set[Xidx], ci_set[Yidx], cv_set[cv - 1])
    })
  })

  return template
}

function get_template() : number[][]
{
  return [
    [5, 6, 4, 2, 9, 1, 3, 8, 7],
    [0, 0, 0, 5, 0, 0, 0, 0, 4],
    [0, 0, 0, 4, 0, 8, 2, 0, 5],
    [0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 1, 4, 0, 5, 7, 0],
    [0, 3, 0, 7, 2, 0, 4, 0, 9],
    [2, 7, 9, 0, 0, 4, 0, 0, 0],
    [1, 5, 0, 0, 0, 0, 9, 4, 2],
    [0, 0, 0, 9, 0, 2, 7, 0, 0]
 ]
}

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
