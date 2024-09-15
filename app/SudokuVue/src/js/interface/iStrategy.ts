// Sudoku Stategy interface
//  A "CHAIN" of Sudoku "LOGIC" Strategy(ies)

import type { iUnit             } from '@/js/interface/iUnit'
import type { iStrategy         } from '@/js/interface/iStrategy'

export
interface iStrategy
{
    public apply ( unit: iUnit  ) : boolean;
    public setNext ( strategy: iStrategy ) : iStrategy;

// See abstract class aStrategyBase???
//  protected abstract applyStrategy ( unit: iUnit ) : boolean;
}

// vim: expandtab number tabstop=4
// END
