// Sudoku Cell Model
// DESIGN-GOALS:
//  - tracks state
//  - ensures values may be used; gotta-love-typing!
//  - include basic features useable for computerized
//    puzzle solving & building
//

import type { iObserver     } from '../interface/iObserver'
import      { Subject       } from './Observable'
import      { CellValue     } from './CellValue'
import      { CellIdent     } from './CellIdent'

export
class CellModel extends Subject implements iObserver
{
  // Identification
  private id: CellIdent

  // State
  private cvalue: CellValue
  private candidates: Array<CellValue>

  // Control
  public autosolve = false

  static factory ( x: number, y: number )
  {
    return new CellModel(CellIdent.factory(x,y))
  }

  private constructor ( location: CellIdent )
  {
    super()
    this.id = location
    this.cvalue = CellValue.HIDDEN
    this.candidates = CellValue.arrayFactory
  }

  reset () : CellModel
  {
    this.cvalue = CellValue.HIDDEN
    this.candidates = CellValue.arrayFactory
    return this
  }

  get name  () : string { return this.id.name }
  get coord () : string { return this.id.coord }
  get value () : string { return this.cvalue.value }

  is ( value: CellValue ) : boolean
  {
    const changed =
        // We must be un-known!
           this.isUnknown
        // And the value is a valid candidate
        && this.candidates.filter( item => item === value ).length == 1;

    if ( changed )
    {
      this.cvalue = value
      this.candidates = []
      this.autosolve && this.notifyObservers( value )
    }

    return changed
  }

  exclude ( value: CellValue ) : boolean
  {
    const changed =
        // We must be un-known!
           this.isUnknown
        && this.candidates.length > 1
        // And the value is a valid candidate
        && this.candidates.filter( item => item === value ).length == 1;

    if ( changed )
    {
      this.candidates =
      this.candidates.filter( item => item !== value )

      // Solution Strategy:
      //   Naked Single detection
      if ( this.autosolve && this.candidates.length == 1 )
        this.is( this.candidates[0] )
    }

    return changed
  }

  update ( subject: Subject, arg: CellValue )
  {
    this.exclude( arg )
  }

  get isKnown () : boolean
  {
    return this.cvalue !== CellValue.HIDDEN
  }

  get isUnknown () : boolean
  {
    return this.cvalue === CellValue.HIDDEN
  }

  get length () : number
  {
    return this.candidates.length
  }

  toArray () : Array<string>
  {
    const _z: Array<string> = []
    this.candidates.forEach( item => _z.push( item.value ))
    return _z
  }
}

// vim: expandtab number tabstop=2
// END
