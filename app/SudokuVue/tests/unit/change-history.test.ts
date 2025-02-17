
// change-history.test.ts

import { describe, expect, test } from '@jest/globals'
import { CellIndex              } from '@/js/model/CellIndex'
import { CellValue              } from '@/js/model/CellValue'
import { ChangeHistory          } from '@/js/model/ChangeHistory'

describe('sudoku/change-history', () => {

    test('undo', () => {
        const history = new ChangeHistory()
        const cindex = CellIndex.arrayFactory
        const cvalue = CellValue.arrayFactory

        history.include( cindex[1], cindex[2], cvalue[0] )
        history.include( cindex[4], cindex[5], cvalue[3] )
        history.include( cindex[7], cindex[8], cvalue[7] )

        expect(history.length).toBe(3)

        expect(history.undo()).toEqual({ x: cindex[7], y: cindex[8], value: cvalue[7] })
        expect(history.undo()).toEqual({ x: cindex[4], y: cindex[5], value: cvalue[3] })
        expect(history.undo()).toEqual({ x: cindex[1], y: cindex[2], value: cvalue[0] })
    })

    test('clear', () => {
        const history = new ChangeHistory()
        const cindex = CellIndex.arrayFactory
        const cvalue = CellValue.arrayFactory

        history.include( cindex[1], cindex[2], cvalue[3] )
        history.include( cindex[4], cindex[5], cvalue[5] )
        history.include( cindex[7], cindex[8], cvalue[7] )

        expect(history.length).toBe(3)

        history.clear()

        expect(history.length).toBe(0)
    })

    test('foreach', () => {
        const history = new ChangeHistory()
        const cindex = CellIndex.arrayFactory
        const cvalue = CellValue.arrayFactory
        const result: Array<{ x: CellIndex, y: CellIndex, value: CellValue }> = []

        history.include( cindex[1], cindex[2], cvalue[3] )
        history.include( cindex[4], cindex[5], cvalue[5] )
        history.include( cindex[7], cindex[8], cvalue[7] )

        expect(history.length).toBe(3)
        expect(result.length).toBe(0)

        history.foreach(( x, y, value ) => {
            result.push({ x, y, value })
        })

        expect(result).toEqual([
            { x: cindex[1], y: cindex[2], value: cvalue[3] },
            { x: cindex[4], y: cindex[5], value: cvalue[5] },
            { x: cindex[7], y: cindex[8], value: cvalue[7] }
        ])

        expect(history.length).toBe(3)
        expect(result.length).toBe(3)
    })

    test('replay', () => {
        const history = new ChangeHistory()
        const cindex = CellIndex.arrayFactory
        const cvalue = CellValue.arrayFactory

        history.include( cindex[0], cindex[0], cvalue[0] )
        history.include( cindex[1], cindex[1], cvalue[1] )
        history.include( cindex[2], cindex[2], cvalue[2] )
        history.include( cindex[3], cindex[3], cvalue[3] )
        history.include( cindex[4], cindex[4], cvalue[4] )
        history.include( cindex[5], cindex[5], cvalue[5] )
        history.include( cindex[6], cindex[6], cvalue[6] )
        history.include( cindex[7], cindex[7], cvalue[7] )
        history.include( cindex[8], cindex[8], cvalue[8] )

        expect(history.length).toBe(9)

        const expected = {
            cells: [
                [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 2, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 3, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 4, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 5, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 6, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 7, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 8, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 9 ]
        ]}

        const board = {
            cells: [
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ,   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ]}

        history.foreach(( x, y, value ) => {
            board.cells[y.index][x.index] = value.value
            expect(expected.cells[y.index][x.index]).toBe(value.value)
        })

        expect(board).toEqual(expected)
    })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
