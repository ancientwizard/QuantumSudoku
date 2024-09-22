// strategy-model.test.ts

import { describe, expect, test } from '@jest/globals'
import type { iUnit             } from '@/js/interface/iUnit'
//port type { iStrategy         } from '@/js/interface/iStrategy'
import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'

class MyUnit implements iUnit
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    is ( cell: iCellIndex, value: iObservedState ) : boolean
    {
        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exclude ( cell: iCellIndex, value: iObservedState ) : boolean
    {
        return false
    }

    isSolved () : boolean
    {
        return false
    }

    isBroken () : boolean
    {
        return false
    }
}

class MyStrategy extends aStrategyBase
{
    public label : string

    constructor ( label = 'N/A/' )
    {
        super()
        this.label = label
    }

    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return false
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

// vim: expandtab number tabstop=4
// END
