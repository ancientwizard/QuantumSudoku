// CandidateMatch.ts

import type { CellModel             } from '@/js/model/CellModel'

export
class CandidateMatch
{
    readonly first  : CellModel
    readonly all    : Array<CellModel>  = [] as Array<CellModel>

    constructor ( cell : CellModel )
    {
        this.first = cell
        this.all.push( cell )
    }

    public toString () : string
    {
        return '(' + this.all.map( c => c.name ).join(',') + ')'
    }
}

// vim: expandtab number tabstop=4
// END
