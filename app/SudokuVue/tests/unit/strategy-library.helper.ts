import type { iStrategyUnit }           from '@/js/interface/iStrategyUnit'
import type { iStrategyBoard }          from '@/js/interface/iStrategyBoard'
import { BoardMode, BoardType }         from '@/js/model/BoardModel'
import { CellIndex }                    from '@/js/model/CellIndex'
import { CellValue }                    from '@/js/model/CellValue'
import { INI }                          from '@/js/util/INI'
import { BasicMap }                     from '@/js/model/BasicMap'
import { ChangeHistory }                from '@/js/model/ChangeHistory'
import { StrategyUnique }               from '@/js/strategy/StrategyUnique'
import { StrategyHiddenPair }           from '@/js/strategy/StrategyHiddenPair'
import { StrategyHiddenTriple }         from '@/js/strategy/StrategyHiddenTriple'
import { StrategyNakedPair }            from '@/js/strategy/StrategyNakedPair'
import { StrategyNakedTriple }          from '@/js/strategy/StrategyNakedTriple'
import { StrategyNakedQuad }            from '@/js/strategy/StrategyNakedQuad'
import { StrategyHiddenQuad }           from '@/js/strategy/StrategyHiddenQuad'
import { StrategyLogger }               from '@/js/strategy/StrategyLogger'
import { StrategyBoxLine }              from '@/js/strategy/StrategyBoxLine'
import { StrategyPointingLine }         from '@/js/strategy/StrategyPointingLine'
import { StrategyYWing }                from '@/js/strategy/StrategyYWing'
import { StrategyWWing }                from '@/js/strategy/StrategyWWing'
import { StrategyXYChain }              from '@/js/strategy/StrategyXYChain'
import { StrategyXWing }                from '@/js/strategy/StrategyXWing'
import { TextBoardModel as BoardModel } from '@/js/decorator/TextBoardModel'

const iniPromise = INI.parse_file_async('tests/unit/fixtures/test-map-1.ini')

export async function loadBoardByPage(page: string): Promise<BoardModel>
{
  const ini = await iniPromise

  for ( const sectionKey in ini.as_object )
  {
    if ( sectionKey === 'global' ) continue
    if ( ini.param(sectionKey, 'page') !== page ) continue

    const mapEncoded = ini.param(sectionKey, 'map')
    const map = new BasicMap().decodeMapString(mapEncoded)
    const board = new BoardModel(BoardMode.SOLVE, BoardType.NORMAL)
    const initHistory = new ChangeHistory()

    map.foreach((x, y, value) => {
      initHistory.include(CellIndex.by(x), CellIndex.by(y), CellValue.by(value))
    })

    board.toPlayMode()
    initHistory.foreach((x, y, value) => { board.set(x, y, value) })
    board.toSolveMode()

    return board
  }

  throw new Error(`Puzzle page not found: ${page}`)
}

export function stabilizeBefore(board: BoardModel, target: 'w-wing' | 'xy-chain' | 'swordfish'): void
{
  const unitChain = createUnitStrategyChain()
  const predecessors = createBoardPredecessors(target)
  let changed = true
  let attempts = 0

  while ( changed && attempts < 20 )
  {
    changed = false
    attempts++

    board.forEachRow(row => changed ||= unitChain.apply(row))
    board.forEachCol(column => changed ||= unitChain.apply(column))
    board.forEachBox(block => changed ||= unitChain.apply(block))

    predecessors.forEach(strategy => {
      changed ||= strategy.apply(board)
    })
  }
}

function createUnitStrategyChain(): iStrategyUnit
{
  const logger = new StrategyLogger()
  const unitStrategies: Array<iStrategyUnit> = [
    new StrategyUnique(logger),
    new StrategyNakedPair(logger),
    new StrategyHiddenPair(logger),
    new StrategyNakedTriple(logger),
    new StrategyHiddenTriple(logger),
    new StrategyNakedQuad(logger),
    new StrategyHiddenQuad(logger)
  ]

  unitStrategies.reduce((prev, curr) => prev.setNext(curr))
  return unitStrategies[0]
}

function createBoardPredecessors(target: 'w-wing' | 'xy-chain' | 'swordfish'): Array<iStrategyBoard>
{
  const strategies: Array<iStrategyBoard> = [
    new StrategyBoxLine(new StrategyLogger()),
    new StrategyPointingLine(new StrategyLogger()),
    new StrategyYWing(new StrategyLogger())
  ]

  if ( target === 'xy-chain' || target === 'swordfish' )
    strategies.push(new StrategyWWing(new StrategyLogger()))

  if ( target === 'swordfish' )
  {
    strategies.push(new StrategyXYChain(new StrategyLogger()))
    strategies.push(new StrategyXWing(new StrategyLogger()))
  }

  return strategies
}
