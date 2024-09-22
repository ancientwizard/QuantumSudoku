// Strategy Logger

import type { iLogger       } from '@/js/interface/iLogger'

export
class StrategyLogger implements iLogger
{
    // Message storage
    private MESSAGES : Array<string> = [] as Array<string>

    public add ( message : string ) : string
    {
        message && this.MESSAGES.push( message )
        return message
    }

    public reset () : void
    {
        this.MESSAGES = [] as Array<string>
    }

    get as_array () : Array<string>
    {
        return [...this.MESSAGES]
    }
}

// vim: expandtab number tabstop=4
// END
