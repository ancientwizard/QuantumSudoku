import { describe, expect, test } from '@jest/globals'
import { StrategyLogger }         from '@/js/strategy/StrategyLogger'
import { StrategyWWing }          from '@/js/strategy/StrategyWWing'
import { TextAdapter }            from '@/js/adapter/TextAdapter'
import { loadBoardByPage }        from './strategy-library.helper'
import { stabilizeBefore }        from './strategy-library.helper'

const TF = TextAdapter.factory

describe('strategy/w-wing', () => {
  test('w-wing/triggers on puzzle page 114', async () => {
    const board = await loadBoardByPage('114')
    stabilizeBefore(board, 'w-wing')

    const before = TF(board).toStringState()
    const logger = new StrategyLogger()
    const strategy = new StrategyWWing(logger)

    expect(strategy.apply(board)).toBe(true)
    expect(TF(board).toStringState()).not.toBe(before)
    expect(logger.as_array).toContain('W-Wing: G4.exclude(9) true')
    expect(logger.as_array).toContain('# (W-Wing): [F4,G6] pair(1,9)')
    expect(logger.as_array).toContain('#  Strong-link: 1 via [B4,B6]')
  })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END