
// PersistentINI.ts
//  A Persistent Sudoku puzzle INI storage & loading using INI composition specific to storing and loading
//  MANY Sudoku board definitions; one per section

import type { INI           } from '@/js/util/INI'
import      { v4 as uuidv4  } from 'uuid'

class PuzzleINImember
{
    uuid:       string | null = null
    source:     string | null = null
    page:       number | null = null
    credits:    string | null = null
    email:      string | null = null
    map:        string | null = null
}

export class PersistentINI
{
    private ini: INI

    constructor ( ini: INI )
    {
        this.ini = ini
    }

    get_puzzles () : Array<PuzzleINImember>
    {
        return this.ini.sections
            .filter((e) => { return e !== 'global' })
            .map((e) => {
                const p = new PuzzleINImember()
                p.uuid      = this.ini.param(e,'uuid')
                p.source    = this.ini.param(e,'source')
                p.page      = parseInt(this.ini.param(e,'page'))
                p.credits   = this.ini.param(e,'credits')
                p.email     = this.ini.param(e,'email')
                p.map       = this.ini.param(e,'map')
                return p
            })
    }

    public retrieve ( uuid: string ) : PuzzleINImember
    {
        const params = this.ini.params(uuid)
        const member = new PuzzleINImember()

        if ( params )
        {
            member.uuid     = params['uuid']
            member.source   = params['source']
            member.page     = parseInt(params['page'])
            member.credits  = params['credits']
            member.email    = params['email']
            member.map      = params['map']
        }

        return member
    }

    static make_uuid_v4(): string { return uuidv4() }

    // At some point I'll add a store method to save a puzzle; however
    //  I'll need a way to create uuid's
    // public store ( uuid: string, member: PuzzleINImember )
    // {
    //     if ( !this.ini ) return

    //     this.ini.param(uuid, 'uuid',     member.uuid)
    //     this.ini.param(uuid, 'source',   member.source)
    //     this.ini.param(uuid, 'page',     member.page)
    //     this.ini.param(uuid, 'credits',  member.credits)
    //     this.ini.param(uuid, 'email',    member.email)
    //     this.ini.param(uuid, 'map',      member.map)
    // }
}


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
