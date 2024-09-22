// iLogger.ts - a basic contruct for collecting messages for deferred introspection

export
interface iLogger
{
    public add ( message: string ) : string
    public reset () : void
    readonly as_array : Array<string>
}

// vim: expandtab number tabstop=4
// END
