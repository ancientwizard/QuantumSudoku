// Sudoku Stategy interface
//  A "CHAIN" of Sudoku "LOGIC" Strategy(ies)

export
interface iStrategy
{
    public apply ( unit: iUnit  ) : boolean;
    public setNext ( strategy: iStrategy ) : void;

// See abstract class StrategyBase
//  protected applyStrategy ( unit: iUnit ) : boolean;
}

// vim: expandtab number tabstop=2
// END
