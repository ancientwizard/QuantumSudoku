
// TextBoadModel.ts

import { BoardModel, BoardMode, BoardType } from '@/js/model/BoardModel'
import { LineModel                        } from '@/js/model/LineModel'
import { BoxModel                         } from '@/js/model/BoxModel'
import { TextCellModel                    } from '@/js/decorator/TextCellModel'
import { TextAdapter                      } from '@/js/adapter/TextAdapter'

const TF = TextAdapter.factory

// With time and tests the Line and Boc models may become Text versions; TBD!
export class TextBoardModel extends BoardModel
{
  constructor( mode: BoardMode = BoardMode.EDIT, type: BoardType = BoardType.NORMAL ) 
  {
    super( mode, type, TextCellModel, LineModel, BoxModel )
  }

  public toString()           : string { return TF( this ).toString() }
  public toStringBox()        : string { return TF( this ).toStringBox() }
  public toStringCoords()     : string { return TF( this ).toStringCoords() }
  public toStringNames()      : string { return TF( this ).toStringNames() }
  public toStringState()      : string { return TF( this ).toStringState() }
  public toStringValues()     : string { return TF( this ).toStringValues() }
  public toStringValuesBasic(): string { return TF( this ).toStringValuesBasic() }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
