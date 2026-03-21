import { describe, expect, test } from '@jest/globals'
import { StrategyLogger }         from '@/js/strategy/StrategyLogger'
import { StrategySwordfish }      from '@/js/strategy/StrategySwordfish'
import { TextAdapter }            from '@/js/adapter/TextAdapter'
import { loadBoardByPage }        from './strategy-library.helper'
import { stabilizeBefore }        from './strategy-library.helper'

const TF = TextAdapter.factory

describe('strategy/swordfish', () => {
  test('swordfish/triggers on puzzle page 280', async () => {
    const board = await loadBoardByPage('280')
    stabilizeBefore(board, 'swordfish')

    const before = TF(board).toStringState()
    const logger = new StrategyLogger()
    const strategy = new StrategySwordfish(logger)

    expect(strategy.apply(board)).toBe(true)
    expect(TF(board).toStringState()).not.toBe(before)
    expect(logger.as_array).toContain('# (Swordfish[ROW(detect)-COL(exclude)]): 8 (VALUE)')
    expect(logger.as_array).toContain('#  Include: ROWS:[ 0, 2, 8 ] x COLS:[ 2, 3, 5 ]')
    expect(logger.as_array.some(entry => entry.startsWith('Swordfish:'))).toBe(true)
  })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END