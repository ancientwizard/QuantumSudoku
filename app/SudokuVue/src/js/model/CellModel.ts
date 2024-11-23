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
  public autosolve  = false

  static factory ( x = 0, y = 0, solve = false )
  {
    const cell = new CellModel(CellIdent.factory(x,y))
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
  get label () : string { return this.cvalue.label }
  get value () : number { return this.cvalue.value }
  get cv    () : CellValue { return this.cvalue }

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
    let changed  = false

    CANDIDATE:
    {
      // Our FINAL value is known
      if ( this.isKnown ) break CANDIDATE

      // And the value is a member candidate
      // ( I.E. still a value candidate we've not already eliminated )
      const is_candidate : boolean = this.candidates.filter( mbr_value => mbr_value === value ).length == 1;

      // Remove [exclude] this candidate, leaving others
      if ( is_candidate && this.candidates.length > 1 )
      {
        changed = true
        this.candidates =
        this.candidates.filter( item => item !== value )
      }

      // Solution Strategy:
      //   Naked Single detection
      if ( this.autosolve && is_candidate && this.candidates.length == 1 )
        changed = this.is( this.candidates[0] )
    }

    return changed
  }

  includes ( value: CellValue ) : boolean { return this.candidates.includes( value ) }

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

  get as_candidate_array () : Array<CellValue>
  {
    return [...this.candidates]
  }

  // TODO: VICB Retire this method!!!
  toArray () : Array<string>
  {
    const _z: Array<string> = []
    this.candidates.forEach( item => _z.push( item.label ))
    return _z
  }

  // TODO: RETIRE or better suited on an adaptor as a TEXT formatter???
  public toString2 () : string
  {
    let s : string = '# ' + this.name + ': ' +  this.label + ' [ '

    s += this.candidates.map( c => c.label ).join()
    s += this.candidates.length ? ' ]' : ']'

    return s;
  }

}

// vim: expandtab number tabstop=2
// END
