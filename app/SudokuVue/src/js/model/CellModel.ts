// Sudoku Cell Model
// DESIGN-GOALS:
//  - tracks state
//  - ensures values may be used; gotta-love-typing!
//  - include basic features useable for computerized
//    puzzle solving & building
//

import { CellValue  } from './CellValue.ts'
//import { Observer   } from '../interface/Observer.ts'
import { Observable   } from './Observable.ts'

export
class CellModel extends Observable // implements Observer
{
  // Identification
  private #id: CellIdentification

  // state
  private #value: CellValue
  private #candidates: array

  constructor ( location: CellIdentification )
  {
    super()
    this.#id = location
    this.reset()
  }

  reset () : CellModel
  {
    this.#value = CellValue.HIDDEN
    this.#candidates = //CellValue.factory
      [
          CellValue.ONE,   CellValue.TWO,   CellValue.THREE
        , CellValue.FOUR,  CellValue.FIVE,  CellValue.SIX
        , CellValue.SEVEN, CellValue.EIGHT, CellValue.NINE
      ] 


    return this
  }

  name  () : string { return this.#id.name }
  coord () : string { return this.#id.coord }
  value () : string { return this.#value.value() }

  is ( value: CellValue ) : boolean
  {
    const changed =
        // We must be un-known!
           this.isUnknown()
        // And the value is a valid candidate
        && this.#candidates.filter( item => item === value ).length == 1;

    if ( changed )
    {
      this.#value = value
      this.#candidates = []
    }

    return changed
  }

  exclude ( value: CellValue ) : array
  {
    const changed =
        // We must be un-known!
           this.isUnknown()
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

  isKnown () : boolean
  {
    return this.#value !== CellValue.HIDDEN
  }

  isUnknown () : boolean
  {
    return this.#value === CellValue.HIDDEN
  }

  toArray () : array
  {
    const _z = []
    this.#candidates.forEach( item => _z.push( item.value() ))
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
