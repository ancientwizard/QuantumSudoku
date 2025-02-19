
// aStrategyBoard.ts

import type { iStrategyBoard  } from '@/js/interface/iStrategyBoard'
import type { iLogger         } from '@/js/interface/iLogger'
import type { iBoard          } from '@/js/interface/iBoard'

export
abstract class aStrategyBoard implements iStrategyBoard
{
    readonly logger : iLogger | null = null
    protected nextStrategy: aStrategyBoard | null = null;

    constructor ( logger: iLogger | null = null )
    {
        this.logger = logger
    }

    public apply ( board: iBoard ) : boolean
    {
        // Written to allow the entire chain of strategies to
        // make their attempt and return true if one or more succeed
        //  ( consumer could choose not to call again to help avoid deep
        //    recursive calls when not needed OR spending time making no progress )
        const modified = this.applyStrategy(board)

        return ( this.nextStrategy && this.nextStrategy.apply(board)) || modified
    }

    public setNext ( strategy: aStrategyBoard ) : aStrategyBoard
    {
        return ( this.nextStrategy = strategy )
    }

    protected abstract applyStrategy ( board: iBoard  ): boolean

}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
