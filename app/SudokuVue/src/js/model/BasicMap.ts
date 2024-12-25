
// An implementation to represent a basic 9x9 Sudoku map. The map is represented
// as inetegers and can be encoded and decoded from a string.

import { EightyOneBits } from '@/js/util/EightyOneBits';


function bigintMax(arr: bigint[]): bigint {
    if (arr.length === 0) throw new Error("Array is empty");
    return arr.reduce((max, val) => (val > max ? val : max), arr[0]);
}

function bigintMin(arr: bigint[]): bigint {
    if (arr.length === 0) throw new Error("Array is empty");
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
        return this.map.map((row) => row.slice());
    }

    public decodeMapString(encoded_map: string): BasicMap
    {
        if (encoded_map.startsWith('MAP:NR:A:'))
        {
            this._decode_map_normal(encoded_map);
        }
        else if (encoded_map.startsWith("MAP:RL:A:"))
        {
            this._decode_map_rlengt(encoded_map);
        }
        else
        {
            throw new Error("InvalidMapDefinition");
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

    public encodeMapString(): string
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
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate();
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate();
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate();
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate().flip();
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate();
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate();
        set.push(wmap.toBigInteger().toBigInt());        wmap = wmap.rotate();
        set.push(wmap.toBigInteger().toBigInt());

        return set;
    }

    public toStringMap(): string
    {
        let str = "+-------+-------+-------+\n";
        for (let y = 0; y < 9; y++)
        {
            str += "|";
            for (let x = 0; x < 9; x++)
            {
                str += this.map[y][x] === null ? " -" : ` ${this.map[y][x]}`;
                if (x === 2 || x === 5) str += " |";
            }
            str += " |\n";
            if (y === 2 || y === 5) str += "+-------+-------+-------+\n";
        }
        str += "+-------+-------+-------+\n";
        return str;
    }

    public toString(): string
    {
        let description = this.source + ', ';
        let formatted_page = '';

        // try {
        //     formatted_page = `#${("000" + parseInt(this.page)).slice(-3)}`;
        // } catch (e) {
            formatted_page = this.page;
        // }

        description += formatted_page;
        return description;
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

//     public String toHashID()
//     {
//         // The HASH-ID created by this method computes a string that
//         //  is capable of identifying a map regardless of it orientation,
//         //  starting position or numbered assignments. The HASH describes the
//         //  solved map in such a way that any two maps may be seen as being
//         //  the same even when the eye cannot see this quality.

//         // The following describes how rules Sudoku maps are judges as the same.

//         // A SUDOKU Map:
//         //  Lets describe the condition of a properly defined Sudoku
//         //  puzzle. (rules not defined here). The primary features are:
//         //  1) The solution (there must be only one!)
//         //  2) The starting point
//         //  3) The groups that make up the Sudoku puzzle all contain nine cells (elements)
//         //		composed of the unique set of number 1-9.
//         //
//         // The map hash explains how a map is represented compared to other maps.
//         //  In theory (and some practice) two maps considered logically the same will
//         //  produce the identical hash. Therefore more than one map producing the same
//         //  hash are the same map. The hash will indicate when two puzzles are exactly
//         //  the same even though the maps map appear to display differently based on
//         //  the defined solution and starting points. Lets see how this works.
//         //
//         // Consider: All Sudoku puzzles have an *ENDING* and a *BEGINNING*. While the
//         //	ending plays a minor role in the puzzles beginning the BEGINNING has the
//         //  significant influence over the puzzle difficulty to solve. This also means
//         //  that the same puzzle can have many beginnings all having the same outcome
//         //  but all providing a different level of experience. This hashing is only
//         //  the final solution not its starting point. An analysis of the logical
//         //  strategies required to solve the puzzle is the solution used to make
//         //  that determination.
//         //
//         // *** Sudoku map comparison Rules for SAMENESS ***
//         //
//         // RULE #1: Every map with the same solution no matter how it is oriented,
//         //  (rotated, flipped or both) are the same map. The "Natural Layout" of
//         //  a puzzle is determined and the key to creating an identical HASH for
//         //  seemingly differently looking puzzles. (Natural Layout is defined later)
//         //
//         // RULE #2: Every map is the same based on rule #1 regardless of starting
//         //  point. As you already know the starting point is a puzzle with some of
//         //  its cells unknown.
//         //
//         // RULE #3: Every map is made up of the integer set 1-9 having no value
//         //  except their relative position to one another; therefore puzzles are
//         //  the same by simply swapping all the twos with sevens; or any other
//         //	combination of swapping so long as the relative positioning is unchanged!
//         //
//         // RULE #3: Every map has a "NATURAL LAYOUT"; simply put is a way of orienting
//         //  the map so that all maps like it will produce the same "NATURAL LAYOUT"
//         //
//         // NATURAL LAYOUT: Is determined by converting the relative positioning of
//         //  each of of the integers (but not their values, because a 9 is no greater
//         //  than a 5 is Sudoku) of all eight of the possible orientations based on flipping
//         //  and rotating the puzzle. We then that the lowest integer value for the eight
//         //  possible orientations, HASH them using MD5 and then encoding using Base64;
//         //  thus producing a reasonably short string that when equal to other map hashes
//         //  are considered identical when concerning their relative positioning
//         //

//         ArrayList<BigInteger> set = new ArrayList<BigInteger>(9);
//         String hashid = "HASHID";

//         try
//         {
//             for ( int m = 1 ; m <= 9 ; m++ )
//                 set.add( min_of(m) );

//             Collections.sort( set );
//             Collections.reverse( set );

//             MessageDigest md5 = MessageDigest.getInstance( "MD5" );
//             Iterator<BigInteger> i = set.iterator();

//             while ( i.hasNext())
//             {
//                 md5.update( i.next().toByteArray());
//             }

//             hashid += "-" + Base64.getEncoder().withoutPadding().encodeToString(md5.digest());
//         }
//         catch ( NoSuchAlgorithmException a )
//         {
//             System.out.println( a );
//         }

//         return hashid;
//     }

//     public Integer get( int x, int y )
//     {
//         if ( x < 1 || x > 9 || y < 1 || y > 9 )
//             throw new IllegalArgumentException();

//         return map.get( --y ).get( --x );
//     }


//     // STRINGS
//     public String toString()
//     {
//         String description = source + ", ";
//         String formatted_page = "";

//         try { formatted_page = String.format("#%03d", Integer.parseInt( page )); }
//         catch ( Exception e ) { formatted_page = page; }

//         description += formatted_page;

//         return description;
//     }

//     public String toStringAry() { return map.toString(); }

//     public String toStringMap()
//     {
//         String str = "+-------+-------+-------+\n";
//         Integer p;

//         for ( int y = 0 ; y < 9 ; y++ )
//         {
//             ArrayList<Integer> _y = map.get( y );
//             str += "|";

//             for ( int x = 0 ; x < 9 ; x++ )
//             {
//                 str += ( p = _y.get( x )) == null
//                     ? " -"
//                     : " " + p;

//                 if ( x == 2 || x == 5 )
//                     str += " |";
//             }

//             str += " |\n";

//             if ( y == 2 || y == 5 )
//                 str += "+-------+-------+-------+\n";
//         }

//         str += "+-------+-------+-------+\n";

//         return str;
//     }

//     private BigInteger toBigInteger()
//     {
//         BigInteger bi = BigInteger.ZERO;
//         int bit_idx = 80;

//         for ( int y = 0 ; y < 9 ; y++ )
//             for ( int x = 0 ; x < 9 ; x++, bit_idx-- )
//                 if ( map.get( y ).get( x ) != null )
//                     bi = bi.setBit( bit_idx );

//         return bi;
//     }

//     private void _decode_map_normal( String e_normal )
//     {
//         String e_map = e_normal.substring( 9 );

//         if ( e_map.length() != 81 )
//             throw new InvalidMapDefinition();

//         int i = 0;

//         for ( int y = 0 ; y < 9 ; y++ )
//             for ( int x = 0 ; x < 9 ; x++, i++ )
//             {
//                 int val = Integer.parseInt( "" + e_map.charAt( i ));
//             //	System.out.format( "# (%d,%d) = %d\n", x, y, val );

//                 if ( val == 0 )
//                     continue;

//                 if ( val >= 1 && val <= 9 )
//                 {
//                     map.get( y ).set( x, new Integer(val) );
//                     continue;
//                 }

//                 // Everything else is wrong
//                 throw new InvalidMapDefinition();
//             }
//     }

//     private void _decode_map_rlengt( String e_rlength )
//     {
//         String e_map = e_rlength.substring( 9 );

//         int i = 0; // decoded map length
//         int x = 0;
//         int y = 0;

//         while ( e_map.length() > 0 && x <= 9 && y <= 8 )
//         {
//             int val = e_map.startsWith( "R" )
//                     ? 0
//                     : Integer.parseInt( "" + e_map.charAt( 0 ));

//             if ( x > 8 ) { x = 0; y++; }

//             /*
//             * We're looking for a single digit OR
//             * 	a run length of zeros.
//             */

//             if ( val >= 1 && val <= 9 )
//             {
//             //	System.out.format( "# (%x,%d) = %d\n", x, y, val );
//                 map.get( y ).set( x, new Integer(val) );
//                 e_map = e_map.substring( 1 );
//                 x++;
//                 i++;

//                 continue;
//             }

//             if ( e_map.startsWith( "R" ) && e_map.indexOf( 'X' ) > 0 )
//             {
//                 int r_len = Integer.parseInt( e_map.substring( 1, e_map.indexOf( 'X' )));
//                 e_map = e_map.substring( e_map.indexOf( 'X' ) + 1 );

//                 while ( r_len-- > 0 )
//                     { i++; x++; if ( x > 8 ) { x = 0; y++; }}

//             //	System.out.println( e_map );
//                 continue;
//             }

//             if ( val == 0 ) { e_map = e_map.substring( 1 ); x++; i++; continue; }

//             // Found something unexpected
//             throw new InvalidMapDefinition();
//         }

//         // Proof things smelled right, we did not come up short OR go long 
//         if ( e_map.length() != 0 || i != 81 )
//             throw new InvalidMapDefinition();
//     }


//     private void _load( ArrayList<ArrayList<Integer>> ary_map )
//     {
//         // Prepare Empty map ArrayList and other defaults
//         this._init();

//         Integer p = null;

//         for ( int y = 0 ; y < 9 ; y++ )
//             for ( int x = 0 ; x < 9 ; x++ )
//                 if (( p = ary_map.get( y ).get( x )) != null )
//                     map.get( y ).set( x, new Integer( p ) );
//     }

//     public static void main(String[] args)
//     {
//         // Basic testing
//         BasicMap map = new BasicMap();
//         System.out.println( "(empty): " + map );
//         System.out.println( " ---- NULL MAP Encodings ----");
//         System.out.println( map.encodeMapString() );
//         System.out.println( map.encodeMapStringRL() );

//         System.out.println(" ---- Null MAP Encode/Decode compare ----");
//         System.out.println(
//             "Compare (empty): " + new BasicMap().decodeMapString(
//                 map.encodeMapStringRL()).encodeMapStringRL().equals(
//                     map.encodeMapStringRL()));

//         // From PAGE #40 PUZ#71
//         Integer[][] map_ary = {
//             {    5, null, null, null, null, null,    1, null, null },
//             { null, null, null, null,    6,    8, null, null, null },
//             { null, null, null, null, null, null, null, null, null },
//             {    4, null, null,    5, null, null, null,    7, null },
//             { null, null, null, null, null, null, null,    9,    6 },
//             { null, null, null, null, null, null, null, null, null },
//             { null, null,    8, null, null, null,    3, null,    1 },
//             { null,    7, null,    1, null, null,    5, null, null },
//             { null,    9,    6, null, null,    5,    7, null, null }
//         };

//         System.out.println(" ---- PUZ#71 ----");

//         map = new BasicMap( map_ary );
//         System.out.println( "(start) : " + map );
//         System.out.println( map.encodeMapString() );
//         System.out.println( map.encodeMapStringRL() );

//         System.out.println( "Check decode    normal: " +
//         new BasicMap().decodeMapString( "MAP:NR:A:500000100000068000000000000400500070000000096000000000008000301070100500096005700" ).toStringMap().equals( map.toStringMap() ));

//         System.out.println( "Check decode run-lenth: " +
//         new BasicMap().decodeMapString( "MAP:RL:A:5R5X1R6X68R12X40050007R8X96R11X8000301070100500096005700" ).toStringMap().equals( map.toStringMap() ));
//         System.out.print(map.toStringMap());

//         // From ArrayList
//         System.out.println( "Map(ArrayList) = "
//         + new BasicMap(map.map).encodeMapStringRL().equals( map.encodeMapStringRL()));
//         System.out.println(new BasicMap(map.map).encodeMapStringRL());

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

//         // Map ID
//         //  explore the positional relationship of each number
//         //  to determine a method for identifying "LIKE" puzzles
//         //  even when their likeness has been hidden OR rather
//         //	simply unnoticed. It is believed that relationship
//         //  or likeness is a simple matter of position and is
//         //	realized through encoding each pattern.
//         //
//         // The tools we need:
//         //  1) Ability to Rotate and Flip a map. Every map has
//         //    eight (8) unique orientations. Assuming the original
//         //    is #1 then each turn to the right or left will after
//         //    four turns land you back at start. If the map is flipped
//         //    once there are four additional turns. Same map with
//         //    eight different orientations we'll call "views".
//         //
//         //  2) Encode "A" number's positional relationship for each
//         //    of the eight views and compute the max. The max for
//         //    that number is its ID. Each numbers max ID is computed
//         //    and sorted to form a maps ID. Each numbers value plays
//         //    no role in this encoding only its position! Therefore
//         //    all maps with the same positional relevance will be seen
//         //    as the same by virtue of having the same encoded ID.
//         //
//         // 4) HASH the results: using the sort(descending) of the nine
//         //    max() view encodings into an encoded string. All maps
//         //    are a like as defined above will produce the same HASH.
//         //

//         System.out.println(" ---- Explore MAP HASHING fundamentals ----");
// //		map = new BasicMap( map_ary );
//         System.out.println( map.toStringAry() );
//         System.out.println( map.toStringMap());

//         System.out.println( "FLIP" );
//         System.out.println( map.flip().toStringMap() );
//         System.out.println( "ROTATE #1" );
//         System.out.println( map.flip().rotate().toStringMap() );
//         System.out.println( "ROTATE #2" );
//         System.out.println( map.flip().rotate().rotate().toStringMap() );
//         System.out.println( "ROTATE #3" );
//         System.out.println( map.flip().rotate().rotate().rotate().toStringMap() );
//         System.out.println( "*** HOME Checks ***" );
//         System.out.println( "FRRFRR: " + map.encodeMapString().equals( map.flip().rotate().rotate().flip().rotate().rotate().encodeMapString()));
//         System.out.println( "RFRRFR: " + map.encodeMapString().equals( map.rotate().flip().rotate().rotate().flip().rotate().encodeMapString()));
//         System.out.println( "RFRF  : " + map.encodeMapString().equals( map.rotate().flip().rotate().flip().encodeMapString()));
//         System.out.println( "FRFR  : " + map.encodeMapString().equals( map.flip().rotate().flip().rotate().encodeMapString()));
//         System.out.println( "RRRR  : " + map.encodeMapString().equals( map.rotate().rotate().rotate().rotate().encodeMapString()));
//         System.out.println( "FF    : " + map.encodeMapString().equals( map.flip().flip().encodeMapString()));

//         System.out.println( "\n*** Hash (max) of each pattern **" );

//         try {
//             MessageDigest md5 = MessageDigest.getInstance( "MD5" );
//             Encoder b64 = Base64.getEncoder().withoutPadding();

//             for ( int x = 1 ; x <= 9 ; x++ )
//             {
//                 md5.update(map.min_of(x).toByteArray());
// //				byte [] digest = md5.digest(map.min_of(x).toByteArray());
// //				MessageDigest md5 = MessageDigest.getInstance( "MD5" );
// //				System.out.println( "  Member: " + x );
//                 System.out.println( "     max: " + map.min_of( x ) );
//                 System.out.println( "Encoding: " + map.of( x ).encodeMapString() );
// //				System.out.println( "        : " + digest.length + " << " + map.min_of(x).toByteArray().length );
// //				System.out.println( "        : " + b64.encodeToString(digest));
// //				System.out.println( "        : " + b64.encodeToString(map.min_of(x).toByteArray()));

// //				System.out.print( "        : " );
// //				for ( int i = 0 ; i < digest.length ; i++ )
// //				{
// //					System.out.print(String.format("%02x", digest[i]));
// //				}
// //				System.out.println();


// //				System.out.println( "        : " +
// //					String.format("%x",md5.digest(map.min_of(x).toByteArray())));
// //				md5.reset();
//             }

//             System.out.println(" HASH: " + b64.encodeToString( md5.digest() ));
//         }
//         catch ( NoSuchAlgorithmException a )
//         {
//             System.out.println( a );
//         }

//         System.out.println( map.toHashID() );
//         System.out.println("Char set?: " + Charset.defaultCharset().toString());

//         // Prove ID is the same on maps that are the "SAME"!
//         System.out.println(" ---- MAP ID Proofs ----");
//         System.out.println(" - " + map.toStringMap().equals(map.rotate().toStringMap()));
//         System.out.println(" - " + map.toStringMap().equals(map.rotate().flip().rotate().flip().toStringMap()));
//         System.out.println(" - " + map.toStringMap().equals(map.rotate().toStringMap()));
//         System.out.println(" - " + map.toHashID().equals(map.rotate().flip().toHashID()));
//     }

//     // Instance variables
//     private ArrayList<ArrayList<Integer>>      map;
//     private String                         comment;
//     private String                    emailaddress;
//     private String                          source;
//     private String                            page;
//     private String                         credits;
//     private String                            uuid;
// }

// END