
// cell-index.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellIndex              } from '@/js/model/CellIndex'

describe('sudoku/cell-index', () => {

    describe('exceptions', () => {

        class MyBadIndex extends CellIndex
        {
          static less_than_0     () { return new MyBadIndex(-1) }
          static greater_than_8  () { return new MyBadIndex(9) }
        }
      
        test('invalid-index-low', () => expect(()=>{MyBadIndex.less_than_0()}).toThrow('Invalid Sudoku INDEX [ -1 ]'))
        test('invalid-index-hi',  () => expect(()=>{MyBadIndex.greater_than_8()}).toThrow('Invalid Sudoku INDEX [ 9 ]'))
        test('by-invalid-index', () => {
            expect(() => CellIndex.by(9)).toThrow('Invalid Sudoku INDEX [ 9 ]')
            expect(() => CellIndex.by(-1)).toThrow('Invalid Sudoku INDEX [ -1 ]')
        })
    })

    describe('operations', () => {
        test('array', () => {
            const cindex = CellIndex.arrayFactory

            expect(cindex[0].index).toBe(0)
            expect(cindex[1].index).toBe(1)
            expect(cindex[2].index).toBe(2)
            expect(cindex[3].index).toBe(3)
            expect(cindex[4].index).toBe(4)
            expect(cindex[5].index).toBe(5)
            expect(cindex[6].index).toBe(6)
            expect(cindex[7].index).toBe(7)
            expect(cindex[8].index).toBe(8)

            expect(cindex[0].name).toBe('1')
            expect(cindex[1].name).toBe('2')
            expect(cindex[2].name).toBe('3')
            expect(cindex[3].name).toBe('4')
            expect(cindex[4].name).toBe('5')
            expect(cindex[5].name).toBe('6')
            expect(cindex[6].name).toBe('7')
            expect(cindex[7].name).toBe('8')
            expect(cindex[8].name).toBe('9')

            expect(CellIndex.by(0)).toBe(CellIndex.ONE)
            expect(CellIndex.by(1)).toBe(CellIndex.TWO)
            expect(CellIndex.by(2)).toBe(CellIndex.THREE)
            expect(CellIndex.by(3)).toBe(CellIndex.FOUR)
            expect(CellIndex.by(4)).toBe(CellIndex.FIVE)
            expect(CellIndex.by(5)).toBe(CellIndex.SIX)
            expect(CellIndex.by(6)).toBe(CellIndex.SEVEN)
            expect(CellIndex.by(7)).toBe(CellIndex.EIGHT)
            expect(CellIndex.by(8)).toBe(CellIndex.NINE)

            expect( cindex.length ).toBe(9)
        })

        test('forEach', () => {
            const cindex = CellIndex.arrayFactory
            const result: number[] = []

            cindex.forEach( ( x, i ) => { result.push(i); expect(x.index).toBe(i) })

            expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
            expect(result.length).toBe(9)
        })
    })
})


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
