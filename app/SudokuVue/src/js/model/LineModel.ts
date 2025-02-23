
//
// Sudoku Cell Line Model (a LINE ONLY UnitModel)
//

import type { iLine } from '@/js/interface/iLine'
import type { iUnit } from '@/js/interface/iUnit'
import { UnitModel  } from '@/js/model/UnitModel'

export
class LineModel extends UnitModel implements iLine, iUnit
{
  // Used to identify line type for formatting purposes
  //  it could be useful. TBD

  get isRow(): boolean
  {
    return this.cells[0].row == this.cells[1].row
  }

  get isCol(): boolean
  {
    return this.cells[0].col == this.cells[1].col
  }

  get isDiagional(): boolean
  {
    return this.isTopLeftBotRight || this.isBotLeftTopRight
  }

  get isTopLeftBotRight(): boolean
  {
    const cell1 = this.cells[0]
    const cell9 = this.cells[8]
    return cell1.cname == 'A' && cell1.row == 1
        && cell9.cname != 'A' && cell9.row == 9
  }

  get isBotLeftTopRight(): boolean
  {
    const cell1 = this.cells[0]
    const cell9 = this.cells[8]
    return cell1.cname == 'A' && cell1.row == 9
        && cell9.cname != 'A' && cell9.row == 1
  }

  // private    is_row = true;

  // get isCol(): boolean { return ! this.is_row }
  // get isRow(): boolean { return   this.is_row }

  // public toggleType(): boolean
  // {
  //   return this.is_row = ! this.is_row
  // }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
