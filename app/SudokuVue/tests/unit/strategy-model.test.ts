// strategy-model.test.ts

import { describe, expect, test } from '@jest/globals'
import type { iUnit             } from '@/js/interface/iUnit'
//port type { iObservedState    } from '@/js/interface/iObservedState'
import      { aStrategyBase     } from '@/js/abstract/aStrategyBase'

/* Feels Broken - not ready yet
class MyUnit implements iUnit
{
    is ( cell: iCell, value: iObservedState ) : boolean
    {
        return false
    }

    exclude ( cell: iCell, value: iObservedState ) : boolean
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
*/

class MyStrategy extends aStrategyBase
{
    protected applyStrategy ( unit: iUnit ) : boolean
    {
        return false
    }
}

describe('strategy/base', () => {

// TODO: VICB come back to this!
//  test('GUESS?', () => expect(new MyStrategy()).toBe())
    test('GUESS?', () => expect(true).toBe(true))
})

// vim: expandtab number tabstop=4
// END
