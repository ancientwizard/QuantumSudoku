
// TextBoadModel.ts

import { BoardModel, BoardMode, BoardType } from '@/js/model/BoardModel'
import { LineModel                        } from '@/js/model/LineModel'
import { BoxModel                         } from '@/js/model/BoxModel'
import { TextCellModel                    } from '@/js/decorator/TextCellModel'

// With time and tests the Line and Boc models may become Text versions; TBD!
export class TextBoardModel extends BoardModel
{
  constructor( mode: BoardMode = BoardMode.EDIT, type: BoardType = BoardType.NORMAL ) 
  {
    super( mode, type, TextCellModel, LineModel, BoxModel )
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
