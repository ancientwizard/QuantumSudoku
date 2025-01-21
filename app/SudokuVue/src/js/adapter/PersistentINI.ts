
// PersistentINI.ts
//  A Persistent Sudoku puzzle INI storage & loading using INI composition specific to storing and loading
//  MANY Sudoku board definitions; one per section

import type { INI   } from '@/js/util/INI'

class PuzzleINImember
{
    uuid:       string | null = null
    source:     string | null = null
    page:       string | null = null
    credits:    string | null = null
    email:      string | null = null
    map:        string | null = null
}

export class PersistentINI
{
    private ini: INI | null = null

    constructor ( ini: INI )
    {
        this.ini = ini
    }

    get_puzzles () : Array<PuzzleINImember>
    {
        return this.ini?.sections
            .filter((e) => { return e !== 'global' })
            .map((e) => {
                const p = new PuzzleINImember()
                p.uuid     = this.ini?.param(e,'uuid')      ??null
                p.source   = this.ini?.param(e,'source')    ??null
                p.page     = this.ini?.param(e,'page')      ??null
                p.credits  = this.ini?.param(e,'credits')   ??null
                p.email    = this.ini?.param(e,'email')     ??null
                p.map      = this.ini?.param(e,'map')       ??null
                return p
            }) ?? []
    }

    public retrieve ( uuid: string ) : PuzzleINImember
    {
        const ini = this.ini?.as_object ?? {}
        const member = new PuzzleINImember()

        if ( ini[uuid] )
        {
            member.uuid     = ini[uuid]['uuid']
            member.source   = ini[uuid]['source']
            member.page     = ini[uuid]['page']
            member.credits  = ini[uuid]['credits']
            member.email    = ini[uuid]['email']
            member.map      = ini[uuid]['map']
        }

        return member
    }

    public store ( uuid: string, member: PuzzleINImember )
    {
        if ( !this.ini ) return

        this.ini.param(uuid, 'uuid',     member.uuid)
        this.ini.param(uuid, 'source',   member.source)
        this.ini.param(uuid, 'page',     member.page)
        this.ini.param(uuid, 'credits',  member.credits)
        this.ini.param(uuid, 'email',    member.email)
        this.ini.param(uuid, 'map',      member.map)
    }
}


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
