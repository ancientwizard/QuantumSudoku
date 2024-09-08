// cell-ident.test.ts

import { describe, expect, test, beforeAll } from '@jest/globals'
import { CellIdent    } from '../src/js/model/CellIdent'

function _p( x: number, y: number) : CellIdent { return CellIdent.factory(x,y); }

describe('model/cell-ident (defaults)', () => {
  let point : CellIdent

  beforeAll(() => { point = _p(0,0); })

  test('A Point type',    () => expect(point).toBe(point))
  test('A Point x',       () => expect(point.x).toBe(0))
  test('A Point y',       () => expect(point.y).toBe(0))
  test('A Point column',  () => expect(point.column).toBe(0))
  test('A Point row',     () => expect(point.row).toBe(0))
  test('A Point name',    () => expect(point.name).toBe('X0'))
  test('A Point coord',   () => expect(point.coord).toBe('r0c0'))
  test('A Point ourname', () => expect(point.ourname).toBe('N/A'))
})

describe('model/cell-ident (X,Y)', () => {

  for ( let x=1 ; x < 9 ; x++ )
  for ( let y=1 ; y < 9 ; y++ )
  {
    test('X', () => expect(_p(x,y).x).toBe(x))
    test('Y', () => expect(_p(x,y).y).toBe(y))
    test('C', () => expect(_p(x,y).column).toBe(x))
    test('R', () => expect(_p(x,y).row).toBe(y))
    test('P', () => expect(_p(x,y).coord).toBe('r'+y+'c'+x))
  }
})

describe('model/cell-ident (NAMES)', () => {
  for ( let y=1 ; y < 9 ; y++ )
    test('Name', () => expect(_p(1,y).name).toBe('A'+y))

  const names = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ]

  names.forEach((name) =>
    test('Name', () => expect(_p(names.indexOf(name)+1,1).name).toBe(name+'1')))
})

// vim: expandtab number tabstop=2
// END
