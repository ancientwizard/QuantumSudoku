// strategy-model.test.ts

import { describe, expect, test } from '@jest/globals'
import type { iUnit             } from '@/js/interface/iUnit'
import type { iObservedState    } from '@/js/interface/iObservedState'
import      { CellValue         } from '@/js/model/CellValue'
import      { UnitModel         } from '@/js/model/UnitModel'
import      { StrategyUnique    } from '@/js/strategy/StrategyUnique'

interface iCell { readonly value: string }
class MyCell implements iCell
{
    readonly value: string = CellValue.HIDDEN.value
}

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

    isSolved () : boolean { return false; }
    isBroken () : boolean { return false; }
}

describe('strategy/unique', () => {

    test('true',  () => expect(true).toBe(true))
    test('false', () => expect(false).toBe(false))
    test('GUESS?', () => {
        expect(true).toBe(true)
        const u: StrategyUnique = new StrategyUnique()

        expect(u.toString()).toBe(new StrategyUnique().toString())
        u.apply(new MyUnit())
    })
})

// vim: expandtab number tabstop=4
// END
