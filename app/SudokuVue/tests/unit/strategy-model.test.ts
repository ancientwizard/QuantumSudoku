// strategy-model.test.ts

import { describe, expect, test } from '@jest/globals'
import type { iUnit             } from '@/js/interface/iUnit'
import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import      { aStrategyUnit     } from '@/js/abstract/aStrategyUnit'
import type { CellModel } from '@/js/model/CellModel'

class MyUnit implements iUnit
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    is ( cell: iCellIndex, value: iObservedState ) : boolean
    {
        return false
    }

    forEachCell ( callback: (cell: CellModel, index: number) => void) : void
    {
        // Mock implementation
        const mockCell = {} as CellModel; // Replace with actual cell model
        const mockIndex = 0; // Replace with actual index
        callback(mockCell, mockIndex);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exclude ( cell: iCellIndex, value: iObservedState ) : boolean
    {
        return false
    }

    get isSolved () : boolean
    {
        return false
    }

    get isBroken () : boolean
    {
        return false
    }

    get as_cell_array(): CellModel[]
    {
        return []
    }
}

class MyStrategy extends aStrategyUnit
{
    public label : string

    constructor ( label = 'N/A/' )
    {
        super()
        this.label = label
    }

    protected applyStrategy ( unit: iUnit ) : boolean
    {
        void unit
        // AI says always return false
        return false; // ! unit.isBroken // make lint quiet
    }
}

describe('strategy/base', () => {

    test('place-holder', () => expect(true).toBe(true))

    function _mk_strategy_set ( chaincount = 1 ) : MyStrategy
    {
        const _head : MyStrategy = new MyStrategy('A1')
        let _tail : MyStrategy = _head

        for ( let i = 1 ; i < chaincount ; i ++ )
            _tail = _tail.setNext( new MyStrategy('A'+(i+1)) ) as MyStrategy

        return _head
    }

    test('apply', () => expect(new MyStrategy().apply(new MyUnit())).toBe(false))

    for ( let x = 1 ; x <= 20 ; x++ )
        test('apply x '+x, () => expect(_mk_strategy_set(x).apply(new MyUnit())).toBe(false))
})

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
