
// ChangeHistory.ts
//   Models changes made to a sudoku borad in the order they are applied
//  - Undo/Redo
//  - History of changes
//  - Replay changes into a reset [ empty ] board

import type { CellIndex } from '@/js/model/CellIndex'
import type { CellValue } from '@/js/model/CellValue'

export
class ChangeHistory
{
    private history: Array<{ x: CellIndex, y: CellIndex, value: CellValue }> = []

    public include ( x: CellIndex, y: CellIndex, value: CellValue ): void
    {
        this.history.push({ x, y, value })
    }

    public undo(): { x: CellIndex, y: CellIndex, value: CellValue } | undefined
    {
        return this.history.pop()
    }

    public clear(): void
    {
        this.history = []
    }

    // A helper to playback the history of changes into a board
    public foreach ( callback: ( x: CellIndex, y: CellIndex, value: CellValue ) => void ): void
    {
        this.history.forEach(( change ) => {
            callback( change.x, change.y, change.value );
        });
    }

    public get length(): number
    {
        return this.history.length
    }
}


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
