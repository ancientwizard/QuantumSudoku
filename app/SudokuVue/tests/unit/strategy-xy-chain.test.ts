import { describe, expect, test } from '@jest/globals'
import { StrategyLogger }         from '@/js/strategy/StrategyLogger'
import { StrategyXYChain }        from '@/js/strategy/StrategyXYChain'
import { TextAdapter }            from '@/js/adapter/TextAdapter'
import { loadBoardByPage }        from './strategy-library.helper'
import { stabilizeBefore }        from './strategy-library.helper'

const TF = TextAdapter.factory

describe('strategy/xy-chain', () => {
  test('xy-chain/triggers on puzzle page 114', async () => {
    const board = await loadBoardByPage('114')
    stabilizeBefore(board, 'xy-chain')

    const before = TF(board).toStringState()
    const logger = new StrategyLogger()
    const strategy = new StrategyXYChain(logger)

    expect(strategy.apply(board)).toBe(true)
    expect(TF(board).toStringState()).not.toBe(before)
    expect(logger.as_array).toContain('# (XY-Chain): 9 via [E2 -> D7]')
    expect(logger.as_array).toContain('XY-Chain: D1.exclude(9) true')
    expect(logger.as_array).toContain('XY-Chain: F9.exclude(9) true')
  })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END