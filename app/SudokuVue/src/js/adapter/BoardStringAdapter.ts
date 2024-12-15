
// BoardAdapterString.ts

import type { BoardModel    } from '@/js/model/BoardModel';

export class BoardStringAdapter
{
    static toString(board: BoardModel): string
    {
        const cellHeight = 3;
        const board_strings: string[] = []
        let row_idx = 0

        // Column labels
        board_strings.push(board.columnNamesAsArray().map( name => `   ${name}` ).join('  '))

        // CellIndex.arrayFactory.forEach( row_idx => {
        board.forEachRow( row => {

            // Each cell in a row having nine possible cell values will require three lines
            //  of text to represent the cell state in a 3x3 grid.

            const row_matrix: string[][] = []

            board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+')

            // Each row in the board is made up of three lines of text values
            //  I.E. one row of cells in a 3x27 grid of calle candidate values.
            for ( let i = 0 ; i < cellHeight ; i++ )
                row_matrix.push(
                    [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
                    , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
                    , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
                    ])

            // Map cell candidate values into the row matrix
            row.as_cell_array.forEach( cell => {

                if ( cell.isKnown )
                {
                    row_matrix[1][((cell.col-1) * 3 )     ] = '['
                    row_matrix[1][((cell.col-1) * 3 ) + 1 ] =  cell.cv.label
                    row_matrix[1][((cell.col-1) * 3 ) + 2 ] = ']'
                    return
                }

                cell.as_candidate_array.forEach( cv => {
                    switch ( cv.value )
                    {
                        case 1: row_matrix[0][((cell.col-1) * 3 )     ] = '1'; break;
                        case 2: row_matrix[0][((cell.col-1) * 3 ) + 1 ] = '2'; break;
                        case 3: row_matrix[0][((cell.col-1) * 3 ) + 2 ] = '3'; break;
                        case 4: row_matrix[1][((cell.col-1) * 3 )     ] = '4'; break;
                        case 5: row_matrix[1][((cell.col-1) * 3 ) + 1 ] = '5'; break;
                        case 6: row_matrix[1][((cell.col-1) * 3 ) + 2 ] = '6'; break;
                        case 7: row_matrix[2][((cell.col-1) * 3 )     ] = '7'; break;
                        case 8: row_matrix[2][((cell.col-1) * 3 ) + 2 ] = '8'; break;
                        case 9: row_matrix[2][((cell.col-1) * 3 ) + 2 ] = '9'; break;
                    }
                })
            })

            row_matrix.forEach( row => {
                let idx = 0
                const row_string: string[] = ['| ']

                row.forEach( value => {
                    idx++
                    row_string.push(value)
                    if ( idx < 27 && idx % 3 == 0 ) row_string.push(' | ')
                })
                row_string.push(' |')
                board_strings.push(row_string.join(''))
            })

            board_strings[row_idx * 4 + 3] += ' ' + (++row_idx).toString()
        })

        board_strings.push('+-----+-----+-----+-----+-----+-----+-----+-----+-----+')

        return board_strings.join('\n') + '\n';
    }

    // static fromString(boardString: string): BoardModel {
    //     const rows = boardString.split('\n');
    //     const size = rows.length;
    //     const board = new BoardModel(size);

    //     for (let row = 0; row < size; row++) {
    //         const cells = rows[row].split('');
    //         for (let col = 0; col < size; col++) {
    //             board.setCell(row, col, parseInt(cells[col], 10));
    //         }
    //     }

    //     return board;
    // }
}
