
// utit-wight-one-bits.test.ts

import { describe, expect, test     } from '@jest/globals'
import { EightyOneBits              } from '../../src/js/util/EightyOneBits';

describe('util/eightyone-bits', () => {

    test('exceptions', () => {
        const bit81 = new EightyOneBits();
        const exmsg = 'Position must be between 0 and 80'

        // Exceptions
        expect(() => { bit81.setBit(-1) }).toThrow(exmsg)
        expect(() => { bit81.setBit(81) }).toThrow(exmsg)
        expect(() => { bit81.getBit(-1) }).toThrow(exmsg)
        expect(() => { bit81.getBit(81) }).toThrow(exmsg)
        expect(() => { bit81.clearBit(-1) }).toThrow(exmsg)
        expect(() => { bit81.clearBit(81) }).toThrow(exmsg)
    })

    test('behaviors', () => {
        const bit81 = new EightyOneBits();
        // console.log('0'.repeat(81))

        expect(bit81.toBinaryString()).toBe(new EightyOneBits('0').toBinaryString())
        expect(bit81.getBit(0)).toBe(false)
        expect(bit81.getBit(80)).toBe(false)
        bit81.setBit(0);    // Set the MSB (top-left)
        expect(bit81.getBit(0)).toBe(true)
        expect(bit81.getBit(80)).toBe(false)
        expect(bit81.toBinaryString()).toBe(new EightyOneBits('1').toBinaryString())
        expect(bit81.toBinaryString()).toBe('000000000000000000000000000000000000000000000000000000000000000000000000000000001');
        expect(bit81.toBigInt().toString()).toBe('1')
        bit81.clearBit(0);  // Clear the MSB (top-left)
        bit81.setBit(1);    // Set the (near)LSB (bottom-right)
        expect(bit81.toBigInt().toString()).toBe('2')
        bit81.setBit(80); // Set the LSB (bottom-right)
        expect(bit81.getBit(80)).toBe(true)
        expect(bit81.toBinaryString()).toBe('100000000000000000000000000000000000000000000000000000000000000000000000000000010')
        expect(bit81.toBigInt().toString()).toBe('1208925819614629174706178')
    })

})

// END