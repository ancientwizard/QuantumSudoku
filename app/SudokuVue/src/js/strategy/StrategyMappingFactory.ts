
// StrategyMappingFactory.ts

import { IntersectMap } from '@/js/model/IntersectMap';

export class StrategyMappingFactory
{
    // Instances of the following layouts

    // LEDGEND-KEY:
    //  X = non-intersected-box   (cells)
    //  Y = non-intersected-line  (cells)
    //  Z = intersection          (cells)

    // INDEX-KEY:
    //  [0] = box index; a simple "number" from 0-8
    //        where a box is a 3x3 grid of cells numbered(indexed) 0-8
    //        as
    //        +---+---+---+
    //        | 0 | 1 | 2 |
    //        +---+---+---+
    //        | 3 | 4 | 5 |
    //        +---+---+---+
    //        | 6 | 7 | 8 |
    //        +---+---+---+
    //
    //  [1] = line index; a simple "number" from 0-8
    //        where a "LINE" is a row or column of cells numbered
    //        as (left to right)
    //    ROW +---+---+---+---+---+---+---+---+---+
    //        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
    //        +---+---+---+---+---+---+---+---+---+
    //
    //    COL +---+ (top to bottom)
    //        | 0 |
    //        +---+
    //        | 1 |
    //        +...+
    //   &-so-on vertically
    //
    //  [2] =  box intersect map; an IntersectMap object
    //  [3] = line intersect map; an IntersectMap object
    //  [4] = expected results; a tuple of three strings of Cell names
    //  [4][0] = expected results; three Cell Names (intercepts)
    //  [4][1] = expected results;   six Cell Names ( box non-intercepts)
    //  [4][2] = expected results;   six Cell Names (line non-intercepts)
    //

    public static createBoxColIntercepts (): Array<[number, number, IntersectMap, IntersectMap, [string, string, string]]>
    {
      return [
        // BEGIN BOX-COL Intercepts

        //  ALL Instances of the following layout COLUMNS
        //    where col-part-A intersects with box-part-A
        //  Z  X  X
        //  Z  X  X
        //  Z  X  X
        //  Y
        //  Y
        //  Y
        //  Y
        //  BLK.iC1 <=> LINE.iR1 (remember, columns index just like rows 0-8) (top to bottom)
        [ 0, 0, IntersectMap.iC1, IntersectMap.iR1, ['A1,A2,A3', 'B1,C1,B2,C2,B3,C3', 'A4,A5,A6,A7,A8,A9'] ],
        [ 1, 3, IntersectMap.iC1, IntersectMap.iR1, ['D1,D2,D3', 'E1,F1,E2,F2,E3,F3', 'D4,D5,D6,D7,D8,D9'] ],
        [ 2, 6, IntersectMap.iC1, IntersectMap.iR1, ['G1,G2,G3', 'H1,I1,H2,I2,H3,I3', 'G4,G5,G6,G7,G8,G9'] ],


        //  X  Z  X
        //  X  Z  X
        //  X  Z  X
        //     Y
        //     Y
        //     Y
        //     Y
        //     Y
        //     Y
        //     Y
        //  BLK.iC2 <=> LINE.iR1
        [ 0, 1, IntersectMap.iC2, IntersectMap.iR1, ['B1,B2,B3', 'A1,C1,A2,C2,A3,C3', 'B4,B5,B6,B7,B8,B9'] ],
        [ 1, 4, IntersectMap.iC2, IntersectMap.iR1, ['E1,E2,E3', 'D1,F1,D2,F2,D3,F3', 'E4,E5,E6,E7,E8,E9'] ],
        [ 2, 7, IntersectMap.iC2, IntersectMap.iR1, ['H1,H2,H3', 'G1,I1,G2,I2,G3,I3', 'H4,H5,H6,H7,H8,H9'] ],

        //  X  X  Z
        //  X  X  Z
        //  X  X  Z
        //        Y
        //        Y
        //        Y
        //        Y
        //        Y
        //        Y
        //  BLK.iC3 <=> LINE.iR1
        [ 0, 2, IntersectMap.iC3, IntersectMap.iR1, ['C1,C2,C3', 'A1,B1,A2,B2,A3,B3', 'C4,C5,C6,C7,C8,C9'] ],
        [ 1, 5, IntersectMap.iC3, IntersectMap.iR1, ['F1,F2,F3', 'D1,E1,D2,E2,D3,E3', 'F4,F5,F6,F7,F8,F9'] ],
        [ 2, 8, IntersectMap.iC3, IntersectMap.iR1, ['I1,I2,I3', 'G1,H1,G2,H2,G3,H3', 'I4,I5,I6,I7,I8,I9'] ],

        //  Y
        //  Y
        //  Y
        //  Z  X  X
        //  Z  X  X
        //  Z  X  X
        //  Y
        //  Y
        //  Y
        //  BLK.iC1 <=> LINE.iR2
        [ 3, 0, IntersectMap.iC1, IntersectMap.iR2, ['A4,A5,A6', 'B4,C4,B5,C5,B6,C6', 'A1,A2,A3,A7,A8,A9'] ],
        [ 4, 3, IntersectMap.iC1, IntersectMap.iR2, ['D4,D5,D6', 'E4,F4,E5,F5,E6,F6', 'D1,D2,D3,D7,D8,D9'] ],
        [ 5, 6, IntersectMap.iC1, IntersectMap.iR2, ['G4,G5,G6', 'H4,I4,H5,I5,H6,I6', 'G1,G2,G3,G7,G8,G9'] ],

        //     Y
        //     Y
        //     Y
        //  X  Z  X
        //  X  Z  X
        //  X  Z  X
        //     Y
        //     Y
        //     Y
        //  BLK.iC2 <=> LINE.iR2
        [ 3, 1, IntersectMap.iC2, IntersectMap.iR2, ['B4,B5,B6', 'A4,C4,A5,C5,A6,C6', 'B1,B2,B3,B7,B8,B9'] ],
        [ 4, 4, IntersectMap.iC2, IntersectMap.iR2, ['E4,E5,E6', 'D4,F4,D5,F5,D6,F6', 'E1,E2,E3,E7,E8,E9'] ],
        [ 5, 7, IntersectMap.iC2, IntersectMap.iR2, ['H4,H5,H6', 'G4,I4,G5,I5,G6,I6', 'H1,H2,H3,H7,H8,H9'] ],

        //        Y
        //        Y
        //        Y
        //  X  X  Z
        //  X  X  Z
        //  X  X  Z
        //        Y
        //        Y
        //        Y
        //  BLK.iC3 <=> LINE.iR2
        [ 3, 2, IntersectMap.iC3, IntersectMap.iR2, ['C4,C5,C6', 'A4,B4,A5,B5,A6,B6', 'C1,C2,C3,C7,C8,C9'] ],
        [ 4, 5, IntersectMap.iC3, IntersectMap.iR2, ['F4,F5,F6', 'D4,E4,D5,E5,D6,E6', 'F1,F2,F3,F7,F8,F9'] ],
        [ 5, 8, IntersectMap.iC3, IntersectMap.iR2, ['I4,I5,I6', 'G4,H4,G5,H5,G6,H6', 'I1,I2,I3,I7,I8,I9'] ],

        //  Y
        //  Y
        //  Y
        //  Y
        //  Y
        //  Y
        //  Z  X  X
        //  Z  X  X
        //  Z  X  X
        //  BLK.iC1 <=> LINE.iR3
        [ 6, 0, IntersectMap.iC1, IntersectMap.iR3, ['A7,A8,A9', 'B7,C7,B8,C8,B9,C9', 'A1,A2,A3,A4,A5,A6'] ],
        [ 7, 3, IntersectMap.iC1, IntersectMap.iR3, ['D7,D8,D9', 'E7,F7,E8,F8,E9,F9', 'D1,D2,D3,D4,D5,D6'] ],
        [ 8, 6, IntersectMap.iC1, IntersectMap.iR3, ['G7,G8,G9', 'H7,I7,H8,I8,H9,I9', 'G1,G2,G3,G4,G5,G6'] ],

        //     Y
        //     Y
        //     Y
        //     Y
        //     Y
        //     Y
        //  X  Z  X
        //  X  Z  X
        //  X  Z  X
        //  BLK.iC2 <=> LINE.iR3
        [ 6, 1, IntersectMap.iC2, IntersectMap.iR3, ['B7,B8,B9', 'A7,C7,A8,C8,A9,C9', 'B1,B2,B3,B4,B5,B6'] ],
        [ 7, 4, IntersectMap.iC2, IntersectMap.iR3, ['E7,E8,E9', 'D7,F7,D8,F8,D9,F9', 'E1,E2,E3,E4,E5,E6'] ],
        [ 8, 7, IntersectMap.iC2, IntersectMap.iR3, ['H7,H8,H9', 'G7,I7,G8,I8,G9,I9', 'H1,H2,H3,H4,H5,H6'] ],

        //        Y
        //        Y
        //        Y
        //        Y
        //        Y
        //        Y
        //  X  X  Z
        //  X  X  Z
        //  X  X  Z
        //  BLK.iC3 <=> LINE.iR3
        [ 6, 2, IntersectMap.iC3, IntersectMap.iR3, ['C7,C8,C9', 'A7,B7,A8,B8,A9,B9', 'C1,C2,C3,C4,C5,C6'] ],
        [ 7, 5, IntersectMap.iC3, IntersectMap.iR3, ['F7,F8,F9', 'D7,E7,D8,E8,D9,E9', 'F1,F2,F3,F4,F5,F6'] ],
        [ 8, 8, IntersectMap.iC3, IntersectMap.iR3, ['I7,I8,I9', 'G7,H7,G8,H8,G9,H9', 'I1,I2,I3,I4,I5,I6'] ],

        // END BOX-COL Intercepts
      ]
    }

    public static createBoxRowIntercepts (): Array<[number, number, IntersectMap, IntersectMap, [string, string, string]]>
    {
      return [
        // BEGIN BOX-ROW Intercepts
        
        //  Z  Z  Z  Y  Y  Y  Y  Y  Y
        //  X  X  X
        //  X  X  X
        // BLK.iR1 <=> LINE.iR1
        [ 0, 0, IntersectMap.iR1, IntersectMap.iR1, ['A1,B1,C1', 'A2,B2,C2,A3,B3,C3', 'D1,E1,F1,G1,H1,I1'] ],
        [ 3, 3, IntersectMap.iR1, IntersectMap.iR1, ['A4,B4,C4', 'A5,B5,C5,A6,B6,C6', 'D4,E4,F4,G4,H4,I4'] ],
        [ 6, 6, IntersectMap.iR1, IntersectMap.iR1, ['A7,B7,C7', 'A8,B8,C8,A9,B9,C9', 'D7,E7,F7,G7,H7,I7'] ],

        //  X  X  X
        //  Z  Z  Z  Y  Y  Y  Y  Y  Y
        //  X  X  X
        //  BLK.iR2 <=> LINE.iR1
        [ 0, 1, IntersectMap.iR2, IntersectMap.iR1, ['A2,B2,C2', 'A1,B1,C1,A3,B3,C3', 'D2,E2,F2,G2,H2,I2'] ],
        [ 3, 4, IntersectMap.iR2, IntersectMap.iR1, ['A5,B5,C5', 'A4,B4,C4,A6,B6,C6', 'D5,E5,F5,G5,H5,I5'] ],
        [ 6, 7, IntersectMap.iR2, IntersectMap.iR1, ['A8,B8,C8', 'A7,B7,C7,A9,B9,C9', 'D8,E8,F8,G8,H8,I8'] ],

        //  X  X  X
        //  X  X  X
        //  Z  Z  Z  Y  Y  Y  Y  Y  Y
        //  BLK.iR3 <=> LINE.iR1
        [ 0, 2, IntersectMap.iR3, IntersectMap.iR1, ['A3,B3,C3', 'A1,B1,C1,A2,B2,C2', 'D3,E3,F3,G3,H3,I3'] ],
        [ 3, 5, IntersectMap.iR3, IntersectMap.iR1, ['A6,B6,C6', 'A4,B4,C4,A5,B5,C5', 'D6,E6,F6,G6,H6,I6'] ],
        [ 6, 8, IntersectMap.iR3, IntersectMap.iR1, ['A9,B9,C9', 'A7,B7,C7,A8,B8,C8', 'D9,E9,F9,G9,H9,I9'] ],

        //  Y  Y  Y  Z  Z  Z  Y  Y  Y
        //           X  X  X
        //           X  X  X
        //  BLK.iR1 <=> LINE.iR2
        [ 1, 0, IntersectMap.iR1, IntersectMap.iR2, ['D1,E1,F1', 'D2,E2,F2,D3,E3,F3', 'A1,B1,C1,G1,H1,I1'] ],
        [ 4, 3, IntersectMap.iR1, IntersectMap.iR2, ['D4,E4,F4', 'D5,E5,F5,D6,E6,F6', 'A4,B4,C4,G4,H4,I4'] ],
        [ 7, 6, IntersectMap.iR1, IntersectMap.iR2, ['D7,E7,F7', 'D8,E8,F8,D9,E9,F9', 'A7,B7,C7,G7,H7,I7'] ],

        //           X  X  X
        //  Y  Y  Y  Z  Z  Z  Y  Y  Y
        //           X  X  X
        //  BLK.iR2 <=> LINE.iR2
        [ 1, 1, IntersectMap.iR2, IntersectMap.iR2, ['D2,E2,F2', 'D1,E1,F1,D3,E3,F3', 'A2,B2,C2,G2,H2,I2'] ],
        [ 4, 4, IntersectMap.iR2, IntersectMap.iR2, ['D5,E5,F5', 'D4,E4,F4,D6,E6,F6', 'A5,B5,C5,G5,H5,I5'] ],
        [ 7, 7, IntersectMap.iR2, IntersectMap.iR2, ['D8,E8,F8', 'D7,E7,F7,D9,E9,F9', 'A8,B8,C8,G8,H8,I8'] ],

        //           X  X  X
        //           X  X  X
        //  Y  Y  Y  Z  Z  Z  Y  Y  Y
        //  BLK.iR3 <=> LINE.iR2
        [ 1, 2, IntersectMap.iR3, IntersectMap.iR2, ['D3,E3,F3', 'D1,E1,F1,D2,E2,F2', 'A3,B3,C3,G3,H3,I3'] ],
        [ 4, 5, IntersectMap.iR3, IntersectMap.iR2, ['D6,E6,F6', 'D4,E4,F4,D5,E5,F5', 'A6,B6,C6,G6,H6,I6'] ],
        [ 7, 8, IntersectMap.iR3, IntersectMap.iR2, ['D9,E9,F9', 'D7,E7,F7,D8,E8,F8', 'A9,B9,C9,G9,H9,I9'] ],

        //  Y  Y  Y  Y  Y  Y  Z  Z  Z
        //                    X  X  X
        //                    X  X  X
        //  BLK.iR1 <=> LINE.iR3
        [ 2, 0, IntersectMap.iR1, IntersectMap.iR3, ['G1,H1,I1', 'G2,H2,I2,G3,H3,I3', 'A1,B1,C1,D1,E1,F1'] ],
        [ 5, 3, IntersectMap.iR1, IntersectMap.iR3, ['G4,H4,I4', 'G5,H5,I5,G6,H6,I6', 'A4,B4,C4,D4,E4,F4'] ],
        [ 8, 6, IntersectMap.iR1, IntersectMap.iR3, ['G7,H7,I7', 'G8,H8,I8,G9,H9,I9', 'A7,B7,C7,D7,E7,F7'] ],

        //                    X  X  X
        //  Y  Y  Y  Y  Y  Y  Z  Z  Z
        //                    X  X  X
        //  BLK.iR2 <=> LINE.iR3
        [ 2, 1, IntersectMap.iR2, IntersectMap.iR3, ['G2,H2,I2', 'G1,H1,I1,G3,H3,I3', 'A2,B2,C2,D2,E2,F2'] ],
        [ 5, 4, IntersectMap.iR2, IntersectMap.iR3, ['G5,H5,I5', 'G4,H4,I4,G6,H6,I6', 'A5,B5,C5,D5,E5,F5'] ],
        [ 8, 7, IntersectMap.iR2, IntersectMap.iR3, ['G8,H8,I8', 'G7,H7,I7,G9,H9,I9', 'A8,B8,C8,D8,E8,F8'] ],

        //                    X  X  X
        //                    X  X  X
        //  Y  Y  Y  Y  Y  Y  Z  Z  Z
        //  BLK.iR3 <=> LINE.iR3
        [ 2, 2, IntersectMap.iR3, IntersectMap.iR3, ['G3,H3,I3', 'G1,H1,I1,G2,H2,I2', 'A3,B3,C3,D3,E3,F3'] ],
        [ 5, 5, IntersectMap.iR3, IntersectMap.iR3, ['G6,H6,I6', 'G4,H4,I4,G5,H5,I5', 'A6,B6,C6,D6,E6,F6'] ],
        [ 8, 8, IntersectMap.iR3, IntersectMap.iR3, ['G9,H9,I9', 'G7,H7,I7,G8,H8,I8', 'A9,B9,C9,D9,E9,F9'] ],

        // END BOX-ROW Intercepts
      ]
    }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
