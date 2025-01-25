// Sudoku Stategy interface
//  A "CHAIN" of Sudoku "LOGIC" Strategy(ies)

import type { iUnit             } from '@/js/interface/iUnit'

export
interface iStrategy
{
    apply ( unit: iUnit  ) : boolean;
    setNext ( strategy: iStrategy ) : iStrategy;

// See abstract class aStrategyBase???
//  protected abstract applyStrategy ( unit: iUnit ) : boolean;
}


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
