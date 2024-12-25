
// EightyOneBits class to store 81 bits.
//  A bit or each sudoku cell position, used to represent the state of puzzle
//  0 - Untermined call
//  1 - Determined cell
//    For a given value, all 7s, 8s, etc. All known 3's, their postion and orintations
//    make up the set of possible values; the max value of the set is the winner.
//    This value is a technique for detering sameness of a puzzle.

export
class EightyOneBits
{
    private bits: bigint;

    constructor(bits: bigint | string = 0n)
    {
        if ( typeof bits === 'string' )
        {
            this.bits = BigInt('0b' + bits);
        }
        else
        {
            this.bits = bits;
        }
    }

    // Set a bit at a specific position (0-80)
    setBit(position: number): EightyOneBits
    {
        if ( position < 0 || position >= 81 )
            throw new RangeError('Position must be between 0 and 80');

        this.bits |= 1n << BigInt(position);
        return this;
    }

    // Clear a bit at a specific position (0-80)
    clearBit(position: number): EightyOneBits
    {
        if ( position < 0 || position >= 81 )
            throw new RangeError('Position must be between 0 and 80');

        this.bits &= ~(1n << BigInt(position));
        return this;
    }

    // Get the value of a bit at a specific position (0-80)
    getBit(position: number): boolean
    {
        if ( position < 0 || position >= 81 )
            throw new RangeError('Position must be between 0 and 80');

        return (this.bits & (1n << BigInt(position))) !== 0n;
    }

    // Convert to binary string
    toBinaryString(): string { return this.bits.toString(2).padStart(81, '0'); }

    // Convert to BigInt
    toBigInt(): bigint { return this.bits; }
}

// END