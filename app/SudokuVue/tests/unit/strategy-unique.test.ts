// strategy-model.test.ts

import { describe, expect, test, beforeAll } from '@jest/globals'
import type { iUnit             } from '@/js/interface/iUnit'
import type { iCellIndex        } from '@/js/interface/iCellIndex'
import type { iObservedState    } from '@/js/interface/iObservedState'
import      { CellIndex         } from '@/js/model/CellIndex'
import      { CellValue         } from '@/js/model/CellValue'
import      { UnitModel         } from '@/js/model/UnitModel'
import      { StrategyUnique    } from '@/js/strategy/StrategyUnique'

/*
interface iCell { readonly value: string }
class MyCell implements iCell
{
    readonly value: string = CellValue.HIDDEN.value
}
*/

class MyUnit implements iUnit
{
    is ( cell: iCellIndex, value: iObservedState ) : boolean
    {
        return true
    }

    exclude ( cell: iCellIndex, value: iObservedState ) : boolean
    {
        return false
    }

    isSolved () : boolean { return false; }
    isBroken () : boolean { return false; }
}

/*
describe('strategy/model', () => {
})
*/

describe('strategy/unique', () => {

    let unit : iUnit

    beforeAll(() => { unit = new MyUnit() })

    test('is',      () => expect(unit.is(CellIndex.ONE,CellValue.ONE)).toBe(true))
    test('exclude', () => expect(unit.exclude(CellIndex.ONE,CellValue.ONE)).toBe(false))

    test('GUESS?', () => {
        expect(true).toBe(true)
//      const u: StrategyUnique = new StrategyUnique()

//      expect(u.toString()).toBe(new StrategyUnique().toString())
//      u.apply(new MyUnit())
    })
})

// vim: expandtab number tabstop=4
// END
