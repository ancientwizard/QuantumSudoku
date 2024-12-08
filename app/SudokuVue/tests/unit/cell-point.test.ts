// cell-point.test.ts

import { describe, expect, test, beforeAll  } from '@jest/globals'
import { CellPoint                          } from '@/js/model/CellPoint'

function _p( x: number, y: number ) : CellPoint { return new CellPoint(x,y); }

describe('model/cell-point(outerlimit-exceptions)', () => {

  test('ROW < 0', () => expect(() => { new CellPoint(-1,0) }).toThrow('Invalid Sudoku location'))
  test('ROW < 0', () => expect(() => { new CellPoint(0,-1) }).toThrow('Invalid Sudoku location'))
  test('ROW < 0', () => expect(() => { new CellPoint(0, 2) }).toThrow('Invalid Sudoku NON-location [ 0, 2 ]'))
  test('ROW < 0', () => expect(() => { new CellPoint(5, 0) }).toThrow('Invalid Sudoku NON-location [ 5, 0 ]'))
})

describe('model/cell-point (defaults)', () => {

  let point : CellPoint

  // Over kill but what the heck!
  //  taking Jest for a test spin!
  beforeAll(() => { point = new CellPoint(0,0); })

  test('A Point type-1',  () => expect(point).toBe(point))
  test('A Point type-2',  () => expect(point).toBeInstanceOf(CellPoint)) // Redundent, though interesting
  test('A Point x',       () => expect(point.x).toBe(0))
  test('A Point y',       () => expect(point.y).toBe(0))
  test('A Point column',  () => expect(point.column).toBe(0))
  test('A Point row',     () => expect(point.row).toBe(0))
  test('A Point coord',   () => expect(point.coord).toBe('(0,0)'))
})

describe('model/cell-point (X,Y)', () => {

  for ( let x=1 ; x < 9 ; x++ )
  for ( let y=1 ; y < 9 ; y++ )
  {
    test('T', () => expect(_p(x,y)).not.toBe(_p(x,y)))
    test('X', () => expect(_p(x,y).x).toBe(x))
    test('Y', () => expect(_p(x,y).y).toBe(y))
    test('C', () => expect(_p(x,y).column).toBe(x))
    test('R', () => expect(_p(x,y).row).toBe(y))
    test('P', () => expect(_p(x,y).coord).toBe('('+x+','+y+')'))
  }
})

// vim: expandtab number tabstop=2
// END
