
// Sudoku Line Model
// Rules:
//  1) 
//

//port { CellValue } from '@/js/model/CellValue'
import { CellModel } from '@/js/model/CellModel'

export
class LineModel {

  private cell_set: array

  constructor ()
  {
    this.cell_set = [
        new CellModel()
      , new CellModel()
      , new CellModel()
      , new CellModel()
      , new CellModel()
      , new CellModel()
      , new CellModel()
      , new CellModel()
      , new CellModel()
    ]
  }

  set ( index: integer, value: CellValue ) : boolean
  {
    this.cell_set.at( index ).is( value )
    return this.toArray()
  }

  reset () : array
  {
    this.cell_set.forEach( c => c.reset() )

    return this.toArray()
  }

  toArray () : array
  {
    const _z = []
    this.cell_set.forEach( c => _z.push( c.isKnown() ? c.value() : c.toArray() ))
    return _z
  }
}

// vim: expandtab number tabstop=2
// END
