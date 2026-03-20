
// persistent-ini.ts

import { describe, expect, test } from '@jest/globals'
import { INI                    } from '@/js/util/INI'
import { PersistentINI          } from '@/js/adapter/PersistentINI'

// Use test-map-1.ini as the test input
const iniFileName = 'test-map-1.ini'

describe('sudoku/storage/persistent-ini', () => {

    test('load-persistent-map-data(INI)', async () => {
        const persistent = new PersistentINI( await load_ini( iniFileName ))
        expect(persistent.get_puzzles().length).toBe(300)
    })

    test('retrieve/puzzle(1,300)', async () => {
        const persistent = new PersistentINI( await load_ini( iniFileName ))
        const puzzles = persistent.get_puzzles()
        .sort((a, b) => a.source!.toString().localeCompare(b.source!.toString()) || a.page! - b.page! )

        const puzzle_page1 = persistent.retrieve(puzzles[0].uuid!)

        expect(puzzles.length).toBe(300)
        expect(puzzle_page1).toEqual(puzzles[0])
        expect(puzzle_page1.uuid).toBe('cad663bb-e85d-42bd-b8fe-f2fbd2554d71')
        expect(puzzle_page1.source).toBe('The HUGE Book Of Hard SUDOKU')
        expect(puzzle_page1.page).toBe(1)
        expect(puzzle_page1.credits).toBe('Will Shortz')
        expect(puzzle_page1.email).toBe('')
        expect(puzzle_page1.map).toBe('MAP:RL:A:R5X4R9X3400270801000060075000900004R6X10008000500007000028030104006800')

        const puzzle_page300 = persistent.retrieve(puzzles[299].uuid!)
        expect(puzzle_page300).toEqual(puzzles[299])
        expect(puzzle_page300.uuid).toBe('14e1b27e-9eb2-4534-ae6d-aa6015bc72f0')
        expect(puzzle_page300.source).toBe('The HUGE Book Of Hard SUDOKU')
        expect(puzzle_page300.page).toBe(300)
        expect(puzzle_page300.credits).toBe('Will Shortz')
        expect(puzzle_page300.email).toBe('')
        expect(puzzle_page300.map).toBe('MAP:RL:A:00790050050000100700900080070360000541008R11X40000800060200010004800209000')
    })

    test('make_uuid_v4', () => {
        expect(PersistentINI.make_uuid_v4()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    })
})

function load_ini ( filename: string ) : Promise<INI>
{
    return INI.parse_file_async('tests/unit/fixtures/' + filename)
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
