// aStrategyBase.ts

import type { iStrategy         } from 'src/js/interface/iStrategy'
import type { iUnit             } from 'src/js/interface/iUnit'

export
abstract class aStrategyBase implements iStrategy
{
    private nextStrategy: iStrategy | null = null;

    public apply ( unit: iUnit ) : boolean
    {
        // Written to allow the entire chain of strategies to
        // make their attempt and return true if one or more succeed
        //  ( perhaps ending early is better to help avoid deep
        //    recursive calls, if its even possible )
        const modified = this.applyStrategy(unit);
        return ( this.nextStrategy && this.nextStrategy.apply(unit)) || modified
    }

    public setNext ( strategy: iStrategy ) : void
    {
        this.nextStrategy = strategy;
    }

    protected abstract applyStrategy ( unit: iUnit  ): boolean
}

// vim: expandtab number tabstop=4
// END
