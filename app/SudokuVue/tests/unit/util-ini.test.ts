
// unit-ini-test.ts

import { describe, expect, test     } from '@jest/globals'
import { INI                        } from '@/js/util/INI';

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

        console.log(Object.keys(ini.as_object));
        console.log(ini.as_object['global']);
        // expect(ini.as_object).toEqual({
        //     section: {
        //         key: 'value'
        //     }
        // });
    });
});

// END