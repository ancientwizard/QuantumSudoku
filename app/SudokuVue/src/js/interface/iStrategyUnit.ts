// Sudoku Stategy interface
//  A "CHAIN" of Sudoku "LOGIC" Strategy(ies)
//  ( Applies only to Strategies applied to a single UNIT of ROW, COL, BOX at a time )
//  ( more advanced Stratedies must be applied to the entire board; sets of units at a time )

import type { iUnit             } from '@/js/interface/iUnit'

export
interface iStrategyUnit
{
    apply ( unit: iUnit  ) : boolean;
    setNext ( strategy: iStrategyUnit ) : iStrategyUnit;

// See abstract class aStrategyBase???
//  protected abstract applyStrategy ( unit: iUnit ) : boolean;
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
