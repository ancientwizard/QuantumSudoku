// iLogger.ts - a basic contruct for collecting messages for deferred introspection

export
interface iLogger
{
    add ( message: string ) : string
    reset () : void
    readonly as_array : Array<string>
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
