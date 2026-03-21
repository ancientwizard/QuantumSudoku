
// aStrategyUnit.ts

import type { iStrategyUnit     } from '@/js/interface/iStrategyUnit'
import type { iLogger           } from '@/js/interface/iLogger'
import type { iUnit             } from '@/js/interface/iUnit'
import type { CellModel         } from '@/js/model/CellModel'
import type { UnitModel         } from '@/js/model/UnitModel'

export
abstract class aStrategyUnit implements iStrategyUnit
{
    readonly  logger : iLogger | null;
    protected nextStrategy: aStrategyUnit | null = null;

    constructor ( logger : iLogger | null = null )
    {
        this.logger = logger
    }

    public apply ( unit: iUnit ) : boolean
    {
        // Written to allow the entire chain of strategies to
        // make their attempt and return true if one or more succeed
        //  ( perhaps ending early is better to help avoid deep
        //    recursive calls, if its even possible )
        const modified = this.applyStrategy(unit);

        return ( this.nextStrategy && this.nextStrategy.apply(unit)) || modified
    }

    public setNext ( strategy: aStrategyUnit ) : aStrategyUnit
    {
        return ( this.nextStrategy = strategy )
    }

    protected getCellNames ( list : Array<CellModel> ) : Array<string>
    {
        const names : Array<string> = [] as string[]
        list.forEach( c => names.push(c.name) )
        return names;
    }

    protected getUndeterminedCellList ( unit : iUnit ) : Array<CellModel>
    {
        const undetermined : Array<CellModel> = [] as CellModel[]
        (unit as UnitModel).as_cell_array.forEach( c => { c.isUnknown && undetermined.push(c) })
        return undetermined;
    }

    protected abstract applyStrategy ( unit: iUnit  ): boolean
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
