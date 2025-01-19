
// basic-map.test.ts

import { describe, expect, test         } from '@jest/globals'
import { BasicMap, bigintMax, bigintMin } from '@/js/model/BasicMap'


describe('model/sudoku/basic-map', () => {

    test('bigint/max+nim', () => {
        expect(()=>{bigintMax([])}).toThrow()
        expect(()=>{bigintMin([])}).toThrow()
        expect(bigintMax([1n,2n,3n])).toBe(3n)
        expect(bigintMin([2n,1n,3n])).toBe(1n)
        expect([5n,1n,2n,0n,3n].sort((a,b) => { return a == b ? 0 : a > b ?  1 : -1 })).toEqual([0n,1n,2n,3n,5n])
        expect([5n,1n,2n,0n,3n].sort((a,b) => { return a == b ? 0 : b > a ?  1 : -1 })).toEqual([5n,3n,2n,1n,0n])
        expect([5n,1n,2n,0n,3n].sort((a,b) => { return a == b ? 0 : a > b ?  1 : -1 }).reverse()).toEqual([5n,3n,2n,1n,0n])
        expect([5n,1n,2n,0n,3n].sort((a,b) => { return a == b ? 0 : b > a ?  1 : -1 }).reverse()).toEqual([0n,1n,2n,3n,5n])
        expect([1n,0n,2n,2n,3n].sort((a,b) => { return a == b ? 0 : b > a ?  1 : -1 })).toEqual([3n,2n,2n,1n,0n])
    })

    test('basic-map/empty', () => {
        const map : BasicMap = new BasicMap();
        // console.log( "(empty): " + map );
        // console.log( " ---- NULL MAP Encodings ----");
        // console.log( map.encodeMapString() );
        // console.log( map.encodeMapStringRL() );
        expect(map).not.toBeNull()
        expect(map.encodeMapStringNR()).toBe('MAP:NR:A:000000000000000000000000000000000000000000000000000000000000000000000000000000000')
        expect(map.encodeMapStringRL()).toBe('MAP:RL:A:R81X')
    })

    test('basic-map/compare', () => {
        const map : BasicMap = new BasicMap()
        // console.log( " ---- Null MAP Encode/Decode compare ----")
        // console.log( "Compare (empty): " + (new BasicMap().decodeMapString(map.encodeMapStringRL()).encodeMapStringRL() === map.encodeMapStringRL()))
        expect(new BasicMap().decodeMapString(map.encodeMapStringRL()).encodeMapStringRL()).toBe(map.encodeMapStringRL())
    })

    test('basic-map/decode', () => {
        // console.log(" ---- PUZ#71 ----")
        expect(new BasicMap().decodeMapString(puzzle_71_nr()).toStringMap()).toBe(puzzle_71().toStringMap())
        expect(new BasicMap().decodeMapString(puzzle_71_rl()).toStringMap()).toBe(puzzle_71().toStringMap())
        expect(new BasicMap(puzzle_71().get_map()).encodeMapStringRL()).toBe(puzzle_71().encodeMapStringRL());

        // console.log(" ---- PUZ#96 ----")
        expect(new BasicMap().decodeMapString(puzzle_96_nr()).toStringMap()).toBe(puzzle_96().toStringMap())
        expect(new BasicMap().decodeMapString(puzzle_96_rl()).toStringMap()).toBe(puzzle_96().toStringMap())
        expect(new BasicMap(puzzle_96().get_map()).encodeMapStringRL()).toBe(puzzle_96().encodeMapStringRL());
    })

    test('basic-map/exceptions', () => {
        const ex = 'InvalidMapDefinition'
        expect(() => { new BasicMap().decodeMapString('MAP:XX') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:NP:B:') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:NP:A:') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:RL:A:R80X') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:RL:A:2R80X1') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:RL:A:123') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:NR:A:123') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:RL:A:000K') }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:NR:A:' + Array.from({length:80}, () => {return '0'}).join('')) }).toThrow(ex)
        expect(() => { new BasicMap().decodeMapString('MAP:NR:A:' + Array.from({length:82}, () => {return '0'}).join('')) }).toThrow(ex)
        expect(() => { puzzle_71().of(0) }).toThrow('IllegalArgumentException')
        expect(() => { puzzle_96().of(0) }).toThrow('IllegalArgumentException')
    })

    test('basic-map/identification', () => {
        const map : BasicMap = puzzle_71();
        map.set_comment('PUZ#71'); expect(map.get_comment()).toBe('PUZ#71')
        map.set_credits('SH'); expect(map.get_credits()).toBe('SH')
        map.set_email('bob@hope.org'); expect(map.get_email()).toBe('bob@hope.org')
        map.set_page('40'); expect(map.get_page()).toBe('40')
        map.set_source('The HUGE Book ...'); expect(map.get_source()).toBe('The HUGE Book ...')
        map.set_uuid('12345678-1234-1234-1234-1234567890AB'); expect(map.get_uuid()).toBe('12345678-1234-1234-1234-1234567890AB')
    })

    test('basic-map/max-min', () => {
        const map : BasicMap = puzzle_71()
        expect(map.max_of(7)).toBe(302249901647748183097344n)
        expect(map.min_of(7)).toBe(70368744243204n)
        expect(map.max_of(3)).toEqual(1152921504606846976n)
        expect(map.min_of(3)).toEqual(1048576n)

        map.set_source('BOOK')
        expect(map.toString()).toEqual('BOOK')
        map.set_page('41')
        expect(map.toString()).toEqual('BOOK, 41')
    })

    test('basic-map/rotate+flip-n-rotate', () => {
        // Map ID
        //  explore the positional relationship of each number
        //  to determine a method for identifying "LIKE" puzzles
        //  even when their likeness has been hidden OR rather
        //	simply obstructed. It is believed that relationship
        //  or puzzle-likeness is a simple matter of position and is
        //	realized through encoding a puzzle pattern.
        //
        // The tools we need:
        //  1) Ability to Rotate and Flip a map. Every map has
        //    eight (8) unique orientations. Assuming the original
        //    is #1 then each turn to the right or left will after
        //    four turns land you back at the start. When the map
        //    is flipped once there are four additional turns.
        //    Same map with eight different orientations we'll
        //    call "views".
        //
        //  2) Encode "A" number's positional relationship for each
        //    of the eight views and compute the max. The max for
        //    that number is its ID. Each numbers max ID is computed
        //    and sorted to form a maps ID. Each numbers value plays
        //    no role in this encoding only its position! Therefore
        //    all maps with the same positional relevance will be seen
        //    as the same by virtue of having the same encoded ID.
        //
        // 4) HASH the results: using the sort(descending) of the nine
        //    max() view encodings into an encoded string. All maps
        //    that are alike will produce the same HASH.
        //

        // console.log(' ---- Explore MAP HASHING fundamentals ----')
        const map = puzzle_71()

        // console.log('toStringAry(): ', map.toStringAry())
        expect(map.toStringAry()).toBe('5,,,,,,1,,,,,,,6,8,,,,,,,,,,,,,4,,,5,,,,7,,,,,,,,,9,6,,,,,,,,,,,,8,,,,3,,1,,7,,1,,,5,,,,9,6,,,5,7,,')
        expect(map.flip().toStringAry()).toBe(',,1,,,,,,5,,,,8,6,,,,,,,,,,,,,,,7,,,,5,,,4,6,9,,,,,,,,,,,,,,,,,1,,3,,,,8,,,,,5,,,1,,7,,,,7,5,,,6,9,')
        expect(map.rotate().toStringAry()).toBe(',,,,,4,,,5,9,7,,,,,,,,6,,8,,,,,,,,1,,,,5,,,,,,,,,,,6,,5,,,,,,,8,,7,5,3,,,,,,1,,,,,9,7,,,,,,1,,6,,,,')
        expect(map.flip().rotate().toStringAry()).toBe(',,1,,6,,,,,,,,,9,7,,,,7,5,3,,,,,,1,5,,,,,,,8,,,,,,,,,6,,,1,,,,5,,,,6,,8,,,,,,,9,7,,,,,,,,,,,,,4,,,5')
        expect(map.flip().rotate().rotate().toStringAry()).toBe(',9,6,,,5,7,,,,7,,1,,,5,,,,,8,,,,3,,1,,,,,,,,,,,,,,,,,9,6,4,,,5,,,,7,,,,,,,,,,,,,,,6,8,,,,5,,,,,,1,,')
        expect(map.flip().rotate().rotate().rotate().toStringAry()).toBe('5,,,4,,,,,,,,,,,,,7,9,,,,,,,8,,6,,,,5,,,,1,,,6,,,,,,,,,8,,,,,,,5,1,,,,,,3,5,7,,,,7,9,,,,,,,,,6,,1,,')

        // console.log(map.toStringAry())
        // console.log(map.toStringMap())
        // console.log(puzzle_96().rotate().toStringMap())

        // console.log("FLIP");
        // console.log(map.toStringMap() + '\n' + map.flip().toStringMap() + map.toStringAry() + '\n' + map.flip().toStringAry());
        // console.log("ROTATE #1");
        // console.log(map.flip().rotate().toStringMap());
        // console.log("ROTATE #2");
        // console.log(map.flip().rotate().rotate().toStringMap());
        // console.log("ROTATE #3");
        // console.log(map.flip().rotate().rotate().rotate().toStringMap());
    })

    test('basic-map/FRRFRR', () => {
        expect(puzzle_71().encodeMapStringNR()).toBe(puzzle_71().flip().rotate().rotate().flip().rotate().rotate().encodeMapStringNR())
        expect(puzzle_71().encodeMapStringRL()).toBe(puzzle_71().flip().rotate().rotate().flip().rotate().rotate().encodeMapStringRL())
        expect(puzzle_96().encodeMapStringNR()).toBe(puzzle_96().flip().rotate().rotate().flip().rotate().rotate().encodeMapStringNR())
        expect(puzzle_96().encodeMapStringRL()).toBe(puzzle_96().flip().rotate().rotate().flip().rotate().rotate().encodeMapStringRL())
    })

    test('basic-map/RFRF',   () => {
        expect(puzzle_71().encodeMapStringNR()).toBe(puzzle_71().rotate().flip().rotate().flip().encodeMapStringNR())
        expect(puzzle_71().encodeMapStringRL()).toBe(puzzle_71().rotate().flip().rotate().flip().encodeMapStringRL())
        expect(puzzle_96().encodeMapStringNR()).toBe(puzzle_96().rotate().flip().rotate().flip().encodeMapStringNR())
        expect(puzzle_96().encodeMapStringRL()).toBe(puzzle_96().rotate().flip().rotate().flip().encodeMapStringRL())
    })

    test('basic-map/FRFR',   () => {
        expect(puzzle_71().encodeMapStringNR()).toBe(puzzle_71().flip().rotate().flip().rotate().encodeMapStringNR())
        expect(puzzle_71().encodeMapStringRL()).toBe(puzzle_71().flip().rotate().flip().rotate().encodeMapStringRL())
        expect(puzzle_96().encodeMapStringNR()).toBe(puzzle_96().flip().rotate().flip().rotate().encodeMapStringNR())
        expect(puzzle_96().encodeMapStringRL()).toBe(puzzle_96().flip().rotate().flip().rotate().encodeMapStringRL())
    })

    test('basic-map/RRRR',   () => {
        expect(puzzle_71().encodeMapStringNR()).toBe(puzzle_71().rotate().rotate().rotate().rotate().encodeMapStringNR())
        expect(puzzle_71().encodeMapStringRL()).toBe(puzzle_71().rotate().rotate().rotate().rotate().encodeMapStringRL())
        expect(puzzle_96().encodeMapStringNR()).toBe(puzzle_96().rotate().rotate().rotate().rotate().encodeMapStringNR())
        expect(puzzle_96().encodeMapStringRL()).toBe(puzzle_96().rotate().rotate().rotate().rotate().encodeMapStringRL())
    })

    test('basic-map/FF',     () => {
        expect(puzzle_71().encodeMapStringNR()).toBe(puzzle_71().flip().flip().encodeMapStringNR())
        expect(puzzle_71().encodeMapStringRL()).toBe(puzzle_71().flip().flip().encodeMapStringRL())
        expect(puzzle_96().encodeMapStringNR()).toBe(puzzle_96().flip().flip().encodeMapStringNR())
        expect(puzzle_96().encodeMapStringRL()).toBe(puzzle_96().flip().flip().encodeMapStringRL())
    })

    test('basic-map/!RRR', () => {
        [ puzzle_71(), puzzle_96() ].forEach((map) => {
            expect(map.encodeMapStringNR()).not.toBe(map.rotate().encodeMapStringNR())
            expect(map.encodeMapStringRL()).not.toBe(map.rotate().rotate().encodeMapStringRL())
            expect(map.encodeMapStringNR()).not.toBe(map.rotate().rotate().rotate().encodeMapStringNR())

            expect(map.encodeMapStringRL()).not.toBe(map.rotate().encodeMapStringRL())
            expect(map.encodeMapStringRL()).not.toBe(map.rotate().rotate().encodeMapStringRL())
            expect(map.encodeMapStringRL()).not.toBe(map.rotate().rotate().rotate().encodeMapStringRL())
        })
    })

    test('basic-map/!FRRR', () => {
        [ puzzle_71(), puzzle_96() ].forEach((map) => {
            expect(map.encodeMapStringNR()).not.toBe(map.flip().encodeMapStringNR())
            expect(map.encodeMapStringNR()).not.toBe(map.flip().rotate().encodeMapStringNR())
            expect(map.encodeMapStringNR()).not.toBe(map.flip().rotate().rotate().encodeMapStringNR())
            expect(map.encodeMapStringNR()).not.toBe(map.flip().rotate().rotate().rotate().encodeMapStringNR())

            expect(map.encodeMapStringRL()).not.toBe(map.flip().encodeMapStringRL())
            expect(map.encodeMapStringRL()).not.toBe(map.flip().rotate().encodeMapStringRL())
            expect(map.encodeMapStringNR()).not.toBe(map.flip().rotate().rotate().encodeMapStringNR())
            expect(map.encodeMapStringRL()).not.toBe(map.flip().rotate().rotate().rotate().encodeMapStringRL())
        })
    })

    test('basic-map/hash-id', () => {
        // puzzle #71
        expect(puzzle_71_id()).toBe(puzzle_71().toHashID())
        expect(puzzle_71_nr()).toBe(puzzle_71().encodeMapStringNR())
        expect(puzzle_71_rl()).toBe(puzzle_71().encodeMapStringRL())
        expect(puzzle_71_sa().split(',').length).toBe(81)
        expect(puzzle_71_sa()).toBe(puzzle_71().toStringAry())

        // puzzle #96
        expect(puzzle_96_id()).toBe(puzzle_96().toHashID())
        expect(puzzle_96_nr()).toBe(puzzle_96().encodeMapStringNR())
        expect(puzzle_96_rl()).toBe(puzzle_96().encodeMapStringRL())
        expect(puzzle_96_sa().split(',').length).toBe(81)
        expect(puzzle_96_sa()).toBe(puzzle_96().toStringAry())

        // Prove ID is the same on maps that are the "SAME"!
        expect(puzzle_71().toHashID()).toBe(puzzle_71().rotate().flip().toHashID())
        expect(puzzle_71().toHashID()).toBe(puzzle_71().rotate().flip().rotate().flip().toHashID())
        expect(puzzle_71().toHashID()).toBe(puzzle_71().rotate().rotate().rotate().rotate().toHashID())
        expect(puzzle_96().toHashID()).toBe(puzzle_96().rotate().flip().toHashID())
        expect(puzzle_96().toHashID()).toBe(puzzle_96().rotate().flip().rotate().flip().toHashID())
        expect(puzzle_96().toHashID()).toBe(puzzle_96().rotate().rotate().rotate().rotate().toHashID())
})

// Remember the following was written in Java, so please convert to TypeScript before offering up code
// TODO: Tests for solved puzzles

// Solve and print
// console.log(" ---- Sudoku Board work ----");
// const board = new Board(Board.BoardMode.NORMAL);
// board.setStart(puzzle_71());

// console.log(board.toString2());
// console.log("Solved: " + board.isSolved());
// board.solve();

// console.log(board.toString2());
// console.log("Solved: " + board.isSolved());

// map = new BasicMap(board.to_arymap());
// console.log(map.toStringMap());
// console.log("NOTE: ** When solved a map encodes the same using both formats (NO-NULLS)");
// console.log(map.encodeMapStringRL());
// console.log(map.encodeMapString());

})

// SOURCE: "2015 The Must Have Sudoku Puzzle BOOK"

function puzzle_71() { return new BasicMap(puzzle_page_40_puzzle_71()) }
function puzzle_71_nr() { return 'MAP:NR:A:500000100000068000000000000400500070000000096000000000008000301070100500096005700' }
function puzzle_71_rl() { return 'MAP:RL:A:5R5X1R6X68R12X40050007R8X96R11X8000301070100500096005700' }
function puzzle_71_sa() { return '5,,,,,,1,,,,,,,6,8,,,,,,,,,,,,,4,,,5,,,,7,,,,,,,,,9,6,,,,,,,,,,,,8,,,,3,,1,,7,,1,,,5,,,,9,6,,,5,7,,' }
function puzzle_71_id() { return 'HASHID-igiYPlqH/786eU779jNW5w==' }

function puzzle_page_40_puzzle_71()
{
    // From PAGE #40 PUZ#71
    const map_ary : (number|null)[][] = [
        [    5, null, null, null, null, null,    1, null, null ],
        [ null, null, null, null,    6,    8, null, null, null ],
        [ null, null, null, null, null, null, null, null, null ],
        [    4, null, null,    5, null, null, null,    7, null ],
        [ null, null, null, null, null, null, null,    9,    6 ],
        [ null, null, null, null, null, null, null, null, null ],
        [ null, null,    8, null, null, null,    3, null,    1 ],
        [ null,    7, null,    1, null, null,    5, null, null ],
        [ null,    9,    6, null, null,    5,    7, null, null ]
    ]

    return map_ary
}

function puzzle_96() { return new BasicMap(puzzle_page_53_puzzle_96()) }
function puzzle_96_nr() { return 'MAP:NR:A:080000020000350000000000000000084090307000000100002000500600703000000500020000000' }
function puzzle_96_rl() { return 'MAP:RL:A:08R5X2000035R17X84090307R6X100002000500600703R6X50002R7X' }
function puzzle_96_sa() { return ',8,,,,,,2,,,,,3,5,,,,,,,,,,,,,,,,,,8,4,,9,,3,,7,,,,,,,1,,,,,2,,,,5,,,6,,,7,,3,,,,,,,5,,,,2,,,,,,,' }
function puzzle_96_id() { return 'HASHID-19lB8TlButSbE7Qagvn5Lg==' }

function puzzle_page_53_puzzle_96()
{
    // From PAGE #53 PUZ#96
    const map_ary : (number|null)[][] = [
        [ null,    8, null, null, null, null, null,    2, null ],
        [ null, null, null,    3,    5, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null,    8,    4, null,    9, null ],
        [    3, null,    7, null, null, null, null, null, null ],
        [    1, null, null, null, null,    2, null, null, null ],
        [    5, null, null,    6, null, null,    7, null,    3 ],
        [ null, null, null, null, null, null,    5, null, null ],
        [ null,    2, null, null, null, null, null, null, null ]
    ]

    return map_ary
}

// END