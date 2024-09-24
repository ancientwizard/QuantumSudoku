// Strategy Logger

import type { iLogger       } from '@/js/interface/iLogger'

export
class StrategyLogger implements iLogger
{
    // Message storage
    private LOGS : Array<string> = [] as Array<string>

    public add ( message : string ) : string
    {
        message && this.LOGS.push( message )
        return message
    }

    public reset () : void
    {
        this.LOGS = [] as Array<string>
    }

    get as_array () : Array<string>
    {
        return [...this.LOGS]
    }
}

// vim: expandtab number tabstop=4
// END
