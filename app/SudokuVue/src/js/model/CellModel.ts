// Sudoku Cell Model
// DESIGN-GOALS:
//  - tracks state
//  - ensures values may be used; gotta-love-typing!
//  - include basic features useable for computerized
//    puzzle solving & building
//

//port { Observer       } from '../interface/Observer'
import { Observable     } from './Observable'
import { CellValue      } from './CellValue'
import { CellIdent      } from './CellIdent'

//export   CellIdent
//export { CellIdent  } from './CellIdent'

export
class CellModel extends Observable // implements Observer
{
  // Identification
  #id: CellIdent

  // state
  #value: CellValue
  #candidates: Array<CellValue>

  static factory ( x: number, y: number )
  {
    return new CellModel(CellIdent.factory(x,y))
  }

  private constructor ( location: CellIdent )
  {
    super()
    this.#id = location
    this.#value = CellValue.HIDDEN
    this.#candidates = CellValue.arrayFactory
  }

  reset () : CellModel
  {
    this.#value = CellValue.HIDDEN
    this.#candidates = CellValue.arrayFactory
    return this
  }

  get name  () : string { return this.#id.name }
  get coord () : string { return this.#id.coord }
  get value () : string { return this.#value.value }

  is ( value: CellValue ) : boolean
  {
    const changed =
        // We must be un-known!
           this.isUnknown
        // And the value is a valid candidate
        && this.#candidates.filter( item => item === value ).length == 1;

    if ( changed )
    {
      this.#value = value
      this.#candidates = []
    }

    return changed
  }

  exclude ( value: CellValue ) : Boolean
  {
    const changed =
        // We must be un-known!
           this.isUnknown
        && this.#candidates.length > 1
        // And the value is a valid candidate
        && this.#candidates.filter( item => item === value ).length == 1;

    if ( changed )
    {
      this.#candidates =
      this.#candidates.filter( item => item !== value )

    // Solution Strategy:
    //   Naked Single detection - disabled
    //if ( this.#candidates.length == 1 )
    //  console.log(this.is( this.#candidates[0] ))
    }

    return changed
  }

  get isKnown () : boolean
  {
    return this.#value !== CellValue.HIDDEN
  }

  get isUnknown () : boolean
  {
    return this.#value === CellValue.HIDDEN
  }

  toArray () : Array<String>
  {
    const _z: Array<String> = []
    this.#candidates.forEach( item => _z.push( item.value ))
    return _z
  }

//update ( cell: Observable, arg: CellValue ) : void
//{
//  if ( this.exclude( arg ))
//    this.#HUM.notifyObservers( arg )
//}
}

// vim: expandtab number tabstop=2
// END
