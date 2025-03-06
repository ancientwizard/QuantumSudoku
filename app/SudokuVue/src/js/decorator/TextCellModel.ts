
// TextCellModel.ts

import { CellModel    } from '@/js/model/CellModel';

export class TextCellModel extends CellModel
{
  public toString () : string
  {
    let s : string = '# ' + this.name + ': ' +  this.cv.label + ' [ '

    s += this.candidates.map( c => c.label ).join()
    s += this.candidates.length ? ' ]' : ']'

    return s;
  }
}

//