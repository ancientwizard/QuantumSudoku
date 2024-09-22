// constains-all.ts

export
function containsAll<T> ( array_A: T[], array_B: T[] ): boolean
{
    return array_B.every( subject => array_A.includes( subject ))
}


// vim: expandtab number tabstop=4
// END
