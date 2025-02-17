
// aStrategyBoard.ts

import type { iLogger       } from '@/js/interface/iLogger'
import type { BoardModel    } from '@/js/model/BoardModel'

export
abstract class aStrategyBoard
{
    readonly logger : iLogger | null = null
    protected nextStrategy: aStrategyBoard | null = null;

    constructor ( logger: iLogger | null = null )
    {
        this.logger = logger
    }

    public apply ( board: BoardModel ) : boolean
    {
        // Written to allow the entire chain of strategies to
        // make their attempt and return true if one or more succeed
        //  ( consumer could choose not to call again to help avoid deep
        //    recursive calls when not needed )
        const modified = this.applyStrategy(board)

        return ( this.nextStrategy && this.nextStrategy.apply(board)) || modified
    }

    public setNext ( strategy: aStrategyBoard ) : aStrategyBoard
    {
        return ( this.nextStrategy = strategy )
    }

    protected abstract applyStrategy ( unit: BoardModel  ): boolean

}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
