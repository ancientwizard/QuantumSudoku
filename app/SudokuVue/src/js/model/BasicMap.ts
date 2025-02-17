
// An implementation to represent a basic 9x9 Sudoku map. The map is represented
// as inetegers and can be encoded and decoded from a string.

import { EightyOneBits  } from '@/js/util/EightyOneBits';
import { createHash     } from 'crypto';

export
function bigintMax(arr: bigint[]): bigint {
    if (arr.length === 0) throw new Error('Array is empty');
    return arr.reduce((max, val) => (val > max ? val : max), arr[0]);
}

export
function bigintMin(arr: bigint[]): bigint {
    if (arr.length === 0) throw new Error('Array is empty');
    return arr.reduce((min, val) => (val < min ? val : min), arr[0]);
}

export class BasicMap
{
    private map: (number|null)[][] = [];
    private comment         = '';
    private emailaddress    = '';
    private source          = '';
    private page            = '';
    private credits         = '';
    private uuid            = '';

    constructor ( ary_map?: (number|null)[][] )
    {
        this._init();

        if ( ary_map )
        {
            for (let y = 0; y < 9; y++)
            {
                for (let x = 0; x < 9; x++)
                {
                    this.map[y][x] = ary_map[y][x];
                }
            }
        }
    }

    private _init()
    {
        this.map = Array.from({ length: 9 }, () => Array(9).fill(null));
        this.comment = '';
    }

    public get_map(): (number|null)[][]
    {
        // return a copy of the map
        return this.map.map( row => row.slice());
    }

    public get_map_with_zeros(): number[][]
    {
        // return a copy of the map
        return this.map.map( row => row.map( val => val === null ? 0 : val ));
    }

    public foreach ( callback: ( x: number, y: number, value: number ) => void ): void
    {
        for (let y = 0; y < 9; y++)
        {
            for (let x = 0; x < 9; x++)
            {
                const value = this.map[y][x] || 0
                if ( value > 0 )
                    callback( x, y, value )
            }
        }
    }

    public decodeMapString(encoded_map: string): BasicMap
    {
        switch (true)
        {
            case encoded_map.startsWith('MAP:NR:A:'):
                this._decode_map_normal(encoded_map)
                break;
            case encoded_map.startsWith("MAP:RL:A:"):
                this._decode_map_rlengt(encoded_map)
                break
            default:
                throw new Error("InvalidMapDefinition")
        }

        return this;
    }

    private _decode_map_normal(e_normal: string)
    {
        const e_map = e_normal.substring(9);
        if (e_map.length !== 81) throw new Error("InvalidMapDefinition");

        let i = 0;
        for (let y = 0; y < 9; y++)
        {
            for (let x = 0; x < 9; x++, i++)
            {
                const val = parseInt(e_map.charAt(i));
                if (val !== 0) this.map[y][x] = val;
            }
        }
    }

    private _decode_map_rlengt(e_rlength: string)
    {
        let e_map = e_rlength.substring(9);
        let x = 0, y = 0, i = 0;

        while (e_map.length > 0 && x <= 9 && y <= 8)
        {
            const val = e_map.startsWith("R") ? 0 : parseInt(e_map.charAt(0));

            if ( x > 8 ) { x = 0; y++; }

            if ( val >= 1 && val <= 9 )
            {
                this.map[y][x] = val;
                e_map = e_map.substring(1);
                x++; i++;
                continue;
            }

            if ( e_map.startsWith("R") && e_map.indexOf('X') > 0 )
            {
                let r_len = parseInt(e_map.substring(1, e_map.indexOf('X')));
                e_map = e_map.substring(e_map.indexOf('X') + 1);
                while (r_len-- > 0) { x++; i++; if (x > 8) { x = 0; y++; } }
                continue;
            }

            if ( val === 0 ) { e_map = e_map.substring(1); x++; i++; continue; }

            throw new Error('InvalidMapDefinition');
        }

        // Proof things smelled right, we did not come up short OR go long 
        if ( e_map.length != 0 || i != 81 ) throw new Error("InvalidMapDefinition")
    }

    public encodeMapStringNR(): string
    {
        let mapstr = "MAP:NR:A:";
        for (let y = 0; y < 9; y++)
        {
            for (let x = 0; x < 9; x++)
            {
                const c = this.map[y][x];
                mapstr += c === null ? "0" : c;
            }
        }
        return mapstr;
    }

    public encodeMapStringRL(): string
    {
        let mapstr = "MAP:RL:A:";
        let count = 0;

        for ( let y = 0 ; y < 9 ; y++ )
        {
            for ( let x = 0 ; x < 9 ; x++ )
            {
                const c = this.map[y][x];
                if ( c === null || c === 0 )
                {
                    count++;
                    continue;
                }

                if ( count > 0 )
                {
                    mapstr += count > 4 ? `R${count}X` : "0000".substring(4 - count);
                    count = 0;
                }

                mapstr += c;
            }
        }

        if ( count > 0 )
        {
            mapstr += count > 4 ? `R${count}X` : "0000".substring(4 - count);
        }

        return mapstr;
    }

    public flip(): BasicMap
    {
        const flipped = new BasicMap();
        for (let y = 0; y < 9; y++)
        {
            for (let x = 0; x < 9; x++)
            {
                flipped.map[y][8 - x] = this.map[y][x];
            }
        }

        return flipped;
    }

    public rotate(): BasicMap
    {
        const clockwise = new BasicMap();

        for (let y = 0; y < 9; y++)
        {
            for (let x = 0; x < 9; x++)
            {
                clockwise.map[y][x] = this.map[8 - x][y];
            }
        }
        return clockwise;
    }

    public of(m: number): BasicMap
    {
        if (m < 1 || m > 9) throw new Error("IllegalArgumentException");

        const pattern = new BasicMap();
        for ( let y = 0 ; y < 9 ; y++ )
        {
            for ( let x = 0 ; x < 9 ; x++ )
            {
                if ( this.map[y][x] === m )
                    pattern.map[y][x] = 1;
            }
        }
        return pattern;
    }

    public max_of(m: number): bigint
    {
        return bigintMax(this.set_of(m));
    }

    public min_of(m: number): bigint
    {
        return bigintMin(this.set_of(m));
    }

    private set_of(m: number): bigint[]
    {
        const set: bigint[] = [];

        let wmap = this.of(m);
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate()
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate()
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate()
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate().flip()
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate()
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate()
        set.push(wmap.toBigInteger().toBigInt());   wmap = wmap.rotate()
        set.push(wmap.toBigInteger().toBigInt())

        return set;
    }

    public toStringMap(): string
    {
        let str = '+-------+-------+-------+\n';
        for (let y = 0; y < 9; y++)
        {
            str += '|';
            for (let x = 0; x < 9; x++)
            {
                str += this.map[y][x] === null ? ' -' : ` ${this.map[y][x]}`;
                if (x === 2 || x === 5) str += ' |';
            }
            str += ' |\n';
            if (y === 2 || y === 5) str += '+-------+-------+-------+\n';
        }
        str += '+-------+-------+-------+\n';
        return str;
    }

    public toString(): string
    {
        return this.page ? this.source + ', ' + this.page : this.source
    }

    public toStringAry(): string
    {
        return this.map.toString()
    }

    private toBigInteger(): EightyOneBits
    {
        const bi = new EightyOneBits();
        let bit_idx = 80;

        for ( let y = 0 ; y < 9; y++ )
        {
            for ( let x = 0 ; x < 9 ; x++, bit_idx-- )
            {
                if (this.map[y][x] !== null)
                {
                    // bi |= 1 << bit_idx;
                    bi.setBit(bit_idx);
                }
            }
        }
        return bi;
    }

    public toHashID(): string
    {
        // The HASH-ID created by this method computes a string that
        //  is capable of identifying a map regardless of it orientation,
        //  starting position or numbered assignments. The HASH describes the
        //  solved map in such a way that any two maps may be seen as being
        //  the same even when the eye cannot see this quality.

        // The following describes how rules Sudoku maps are judges as the same.

        // A SUDOKU Map:
        //  Lets describe the condition of a properly defined Sudoku
        //  puzzle. (rules not defined here). The primary features are:
        //  1) The solution (there must be only one!)
        //  2) The starting point
        //  3) The sets (rows, columns & blocks) that make up the Sudoku puzzle all
        //      contain nine cells (elements) composed of the unique set of
        //      integers 1-9.
        //
        // The map hash explains how a map is represented compared to other maps.
        //  In theory (and some practice) two maps considered logically the same will
        //  produce the identical hash. Therefore more than one map producing the same
        //  hash are the same map. The hash will indicate when two puzzles are exactly
        //  the same even though the maps map appear to display differently based on
        //  the defined solution and starting points. Lets see how this works.
        //
        // Consider: All Sudoku puzzles have an *ENDING* and a *BEGINNING*. While the
        //  ending plays a minor role in the puzzles beginning the BEGINNING has the
        //  significant influence over the puzzle difficulty to solve. This also means
        //  that the same puzzle can have many beginnings all having the same outcome
        //  but all providing a different difficulty and experience. This hashing is
        //  most useful on the final solution not its starting point. An analysis of
        //  the logical strategies required to solve the puzzle is the solution used
        //  to make that determination.
        //
        // *** Sudoku map comparison Rules for SAMENESS ***
        //
        // RULE #1: Every map with the same solution no matter how it is oriented,
        //  (rotated, flipped or both) are the same map. The "Natural Layout" of
        //  a puzzle is determined and the key to creating an identical HASH for
        //  seemingly differently looking puzzles. (Natural Layout is defined later)
        //
        // RULE #2: Every map is the same based on rule #1 regardless of starting
        //  point. As you already know the starting point is a puzzle with some of
        //  its cells unknown.
        //
        // RULE #3: Every map is made up of the integer set 1-9 having no value
        //  except their relative position to one another; therefore puzzles are
        //  the same by simply swapping all the twos with sevens; or any other
        //  combination of swapping so long as the relative positioning is unchanged!
        //
        // RULE #3: Every map has a "NATURAL LAYOUT"; simply put is a way of orienting
        //  the map so that all maps like it will produce the same "NATURAL LAYOUT"
        //
        // NATURAL LAYOUT: Is determined by converting the relative positioning of
        //  each of of the integers (but not their values, because a 9 is no greater
        //  than a 5 is) of all eight of the possible orientations based on flipping
        //  and rotating the puzzle. We then detect the lowest integer value for the eight
        //  possible orientations, HASH them using MD5 and then encoding using Base64;
        //  thus producing a reasonably short string that when equal to another map's
        //  hash are considered identical.
        //
        // STARTING POINT: HASH matching is still useful however it can only identify
        //  maps having the same STARTING POINT. This also means thay have the same
        //  solution and therefore are the same map. However as mentioned above not all
        //  maps with the same solution can and do have many different starting points.
        //

        const bigInts: bigint[] = []
        let hashid = 'HASHID'

        for ( let m = 1 ; m <= 9 ; m++ )
            bigInts.push(this.min_of(m))

        // Desending Order
        bigInts.sort((a, b) => { return a == b ? 0 : a < b ? 1 : -1 })

        const md5 = createHash('md5');
        for ( const value of bigInts )
            md5.update(value.toString())

        hashid += "-" + md5.digest('base64').replace(/=[/]+$/, '');

        return hashid;
    }

    // SOURCE
    public set_source( _source : string ) : void
    {
        this.source = '' + _source
        return
    }

    public get_source() : string { return this.source }

    // PAGE
    public set_page( _page : string ) : void
    {
        this.page = '' +  _page
        return
    }

    public get_page() : string { return this.page }

    // CREDITS
    public set_credits( _credits : string ) : void
    {
        this.credits = '' + _credits
        return
    }

    public get_credits() : string { return this.credits }

    // EMAIL
    public set_email( _emailaddress : string ) : void
    {
        this.emailaddress = '' + _emailaddress
        return
    }

    public get_email() : string { return this.emailaddress }

    // COMMENT
    public set_comment( _comment : string ) : void
    {
        this.comment = '' + _comment
        return
    }

    public get_comment() : string { return this.comment }

    // UUID
    public set_uuid( _uuid : string ) : void
    {
        this.uuid = '' + _uuid
        return
    }

    public get_uuid() : string { return this.uuid }

}


// public class BasicMap implements Comparable<BasicMap>
// {
//     public class InvalidMapDefinition extends IllegalArgumentException
//     {
//         private static final long serialVersionUID = 1L;
//     }

//     public BasicMap( ArrayList<ArrayList<Integer>> ary_map )
//     {
//         this._load( ary_map );
//     }

//     public BasicMap( BasicMap _map )
//     {
//         this._load( _map.map );
//     }

//     public int compareTo( BasicMap o )
//     {
//         return this.toString().compareTo(o.toString());
//     }


//     public Integer get( int x, int y )
//     {
//         if ( x < 1 || x > 9 || y < 1 || y > 9 )
//             throw new IllegalArgumentException();

//         return map.get( --y ).get( --x );
//     }

//     public static void main(String[] args)
//     {
//         System.out.println(" ---- PUZ#71 ----");

//         // Solve and print
//         System.out.println(" ---- Sudoku Board work ----");
//         Board board = new Board(Board.BoardMode.NORMAL);
//         board.setStart( map );

//         System.out.print( board.toString2() );
//         System.out.println( "Solved: " + board.isSolved());
//         board.solve();

//         System.out.print( board.toString2() );
//         System.out.println( "Solved: " + board.isSolved());

//         map = new BasicMap( board.to_arymap() );
//         System.out.println( map.toStringMap() );
//         System.out.println( "NOTE: ** When solved a map encodes the same using both formats" );
//         System.out.println( map.encodeMapStringRL() );
//         System.out.println( map.encodeMapString() );
//     }
// }


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
