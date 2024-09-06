// Sudoku Cell Ident

import { CellPoint    } from './CellPoint'

// Smells like a layer that provides no value
// Unless I migrate the naming up from CellPoint;
// that may have been what I intended!

export
class CellIdent {

  static factory ( x: number, y: number )
  {
    const id = new CellIdent( 'N/A', new CellPoint(x,y))
    return id
  }

  #ourname: string
  #point: CellPoint

  private constructor ( name: string, location: CellPoint )
  {
    this.#ourname = name
    this.#point   = location
  }

  get       x () { return this.#point.x       }
  get       y () { return this.#point.y       }
  get  column () { return this.#point.column  }
  get     row () { return this.#point.row     }
  get   coord () { return this.#point.coord   }
  get    name () { return this.#point.name    }
  get ourname () { return this.#ourname       }
}

// vim: expandtab number tabstop=2 shiftwidth=4
// END
