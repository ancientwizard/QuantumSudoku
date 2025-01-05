
// unit-ini-test.ts

import { describe, expect, test     } from '@jest/globals'
import { INI                        } from '@/js/util/INI';
import { toISOStringWithoutFractionalSeconds } from '@/js/util/iso-8601';

describe('INI', () => {
    test('INI/parse', () => {
        const ini = INI.parse(`
            ; Comment
            [section]
            key=value
        `);

        expect(ini.as_object).toEqual({
            section: {
                key: 'value'
            }
        });
    });

    test('INI/parse_file', async () => {
        const ini = await INI.parse_file('tests/unit/fixtures/test-map-1.ini');

        expect(Object.keys(ini.as_object).length).toBe(301);    // 300 puzzles + 'global'
        expect(ini.param('global','a-key','a-value')).toBe('a-value');
        expect(ini.param('global','b-key','b-value')).toBe('b-value');
        expect(ini.as_object['global']).toEqual({
            name: 'The Quick Brown Fox Jumped Over The Lazy Dogs Back.',
            'a-key': 'a-value',
            'b-key': 'b-value'
          });
    });

    test('INI/param', () => {
        const ini = INI.parse(`
            [section]
            key=value
        `);

        expect(ini.param('section', 'key')).toBe('value');
        expect(ini.param('section', 'key', 'new-value')).toBe('new-value');
        expect(ini.param('section', 'key')).toBe('new-value');
    });

    test('INI/toString', () => {
        const ini = INI.parse(`
            [section]
            a-key=a-value
            b-key=b-value
            [global]
            name=The Quick Brown Fox Jumped Over The Lazy Dogs Back.
        `);

        expect(toISOStringWithoutFractionalSeconds(new Date(0))).toBe('1970-01-01T00:00:00Z');
        const strigified = ini.toString().split('\n')

        // console.log(ini.toString())
        // console.log(strigified)

        expect(strigified[0]).toBe('# config.ini');
        expect(strigified[1]).toBe('# version 0.1');
        expect(strigified[2]).toMatch(/^# [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/);
        expect(strigified[4]).toBe('[section]');
        expect(strigified[5]).toBe('a-key=a-value');
        expect(strigified[6]).toBe('b-key=b-value');
        expect(strigified[8]).toBe('[global]');
        expect(strigified[9]).toBe('name=The Quick Brown Fox Jumped Over The Lazy Dogs Back.');
    })

    test('INI/save', async () => {
        const ini_template = INI.parse(`
            [global]
            name=The Quick Brown Fox Jumped Over The Lazy Dogs Back.
            [section-A]
            name=a-value
            address=b-value
            [section-B]
            name=a-value
            address=b-value
        `);

        const file = 'tests/unit/fixtures/test-map-2.ini';
        ini_template.filename = file
        await ini_template.save(file)

        const ini_fixture = await INI.parse_file(file);
        expect(ini_fixture.filename).toEqual(file);
        expect(ini_fixture.filename).toEqual(ini_template.filename)
        expect(ini_fixture.as_object).toEqual(ini_template.as_object)
        expect(() => { ini_fixture.unlink() }).not.toThrow()
    })

});

// END