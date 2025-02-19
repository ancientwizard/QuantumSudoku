
// iStrategyBoard.ts

import type { iBoard      } from '@/js/interface/iBoard'

export
interface iStrategyBoard
{
  apply   (    board: iBoard          ): boolean
  setNext ( strategy: iStrategyBoard  ): iStrategyBoard
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
