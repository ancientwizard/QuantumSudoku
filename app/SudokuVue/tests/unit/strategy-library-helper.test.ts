import { describe, expect, test }  from '@jest/globals'
import { TextAdapter }             from '@/js/adapter/TextAdapter'
import { loadBoardByPage }         from './strategy-library.helper'
import { stabilizeBefore }         from './strategy-library.helper'

const TF = TextAdapter.factory

describe('strategy/library-helper', () => {
  test('loadBoardByPage/loads known page', async () => {
    const board = await loadBoardByPage('114')

    expect(board).toBeDefined()
    expect(board.isSolveMode).toBe(true)
    expect(board.isSolved).toBe(false)
  })

  test('loadBoardByPage/throws on unknown page', async () => {
    await expect(loadBoardByPage('9999')).rejects.toThrow('Puzzle page not found: 9999')
  })

  test('stabilizeBefore/covers all target branches', async () => {
    const targets: Array<'w-wing' | 'xy-chain' | 'swordfish'> = ['w-wing', 'xy-chain', 'swordfish']

    for ( const target of targets )
    {
      const board = await loadBoardByPage('114')
      const before = TF(board).toStringState()

      stabilizeBefore(board, target)

      expect(TF(board).toStringState()).not.toBe(before)
    }
  })
})


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END