// Sudoku Cell Model
// DESIGN-GOALS:
//  - tracks state
//  - ensures values may be used; gotta-love-typing!
//  - include basic features useable for computerized
//    puzzle solving & building
//

import type { iObserver           } from '@/js/interface/iObserver'
import type { iCellIdentification } from '@/js/interface/iCellIdentification'
import      { Subject             } from '@/js/model/Observable'
import      { CellValue           } from '@/js/model/CellValue'
import      { CellIdent           } from '@/js/model/CellIdent'

export
class CellModel extends Subject implements iObserver
{
  // Identification
  private id: iCellIdentification

  // State
  private cvalue: CellValue
  private candidates: Array<CellValue>

  // Control
  public autosolve : boolean = false

  static factory ( x: number = 0, y: number = 0, solve: boolean = false )
  {
    let cell = new CellModel(CellIdent.factory(x,y))
    cell.autosolve = solve
    return cell
  }

  private constructor ( location: iCellIdentification )
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
    let changed : boolean = false

    CANDIDATE:
    {
      // Our FINAL value is known
      if ( this.isKnown ) break CANDIDATE

      // And the value is a member candidate
      // ( I.E. still a value candidate we've not already eliminated )
      let is_candidate : boolean = this.candidates.filter( mbr_value => mbr_value === value ).length == 1;

      // Remove this one candidate, leaving others
      if ( this.candidates.length > 1 )
      {
        changed = true
        this.candidates =
        this.candidates.filter( item => item !== value )
        break CANDIDATE
      }

      // Solution Strategy:
      //   Naked Single detection
      if ( this.autosolve && is_candidate )
      {
        changed = this.is( this.candidates[0] )
      }
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

  // TO BE RETIRED
  //   OR better suited on an adaptor as a TEXT formatter???
  public toString2 () : string
  {
    let first : boolean = true
    let s : string = '# ' + this.name + ': ' +  this.value + ' [ '

    s += this.candidates.map( c => c.value ).join()
    s += this.candidates.length ? ' ]' : ']'

    return s;
  }

}

// vim: expandtab number tabstop=2
// END
