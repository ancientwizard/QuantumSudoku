// Sudoku Cell Identification

import { CellPoint    } from './CellPoint'

export
class CellIdentification {

  static factory ( x: integer, y: integer )
  {
    const id = new CellIdentification( 'N/A', new CellPoint(x,y))
    return id
  }

  #name: string
  #point: CellPoint

  private constructor ( name: string, location: CellPoint )
  {
    this.#name  = name
    this.#point = location
  }

  get coord () { return this.#point.coord }
  get  name () { return this.#point.name  }
//  return this.#name + ':' + this.#point.name
}

// vim: expandtab number tabstop=2 shiftwidth=4
// END
