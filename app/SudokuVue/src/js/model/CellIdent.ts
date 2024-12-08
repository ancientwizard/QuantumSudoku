
//
// Sudoku Cell Identification
//

import type { iCellIdentification } from '@/js/interface/iCellIdentification'
import      { CellPoint           } from '@/js/model/CellPoint'

enum CELLNAMES { 'X', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' }

export
class CellIdent implements iCellIdentification
{

  static factory ( x: number, y: number, label = 'N/A' ) : iCellIdentification
  {
    return new CellIdent( label, new CellPoint(x,y))
  }

  public  label: string
  private point: CellPoint

  private constructor ( label: string, location: CellPoint )
  {
    this.label = label
    this.point = location
  }

  get     x () { return this.point.x       }
  get     y () { return this.point.y       }
  get   col () { return this.point.column  }
  get   row () { return this.point.row     }
  get coord () { return this.point.coord   }
  get  name () { return CELLNAMES[this.point.column] + this.point.row }
  get cname () { return CELLNAMES[this.point.column] }
}

// vim: expandtab number tabstop=2 shiftwidth=4
// END
