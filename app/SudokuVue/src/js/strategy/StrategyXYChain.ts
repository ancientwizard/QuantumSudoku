// StrategyXYChain.ts

import type { iBoard         } from '@/js/interface/iBoard'
import type { iUnit          } from '@/js/interface/iUnit'
import type { CellModel      } from '@/js/model/CellModel'
import type { CellValue      } from '@/js/model/CellValue'
import      { aStrategyBoard } from '@/js/abstract/aStrategyBoard'

export
class StrategyXYChain extends aStrategyBoard
{
  // Slightly deeper search catches harder chains while remaining bounded.
  private static readonly MAX_CHAIN_LENGTH = 12

  protected applyStrategy( board: iBoard ) : boolean
  {
    const peerMap = this.buildPeerMap(board)
    const bivalueCells = this.findBivalueCells(board)
    let excludes = 0

    for ( const start of bivalueCells )
    {
      const startCandidates = start.as_candidate_array

      for ( const targetCandidate of startCandidates )
      {
        const outgoingCandidate = startCandidates.find(cv => cv !== targetCandidate)

        if ( !outgoingCandidate ) continue

        excludes += this.searchChain(
            start
          , start
          , targetCandidate
          , outgoingCandidate
          , peerMap
          , new Set<CellModel>([start])
          , 1
        )
      }
    }

    return excludes > 0
  }

  private searchChain(
      start: CellModel
    , current: CellModel
    , targetCandidate: CellValue
    , requiredCandidate: CellValue
    , peerMap: Map<CellModel, Set<CellModel>>
    , visited: Set<CellModel>
    , depth: number
  ) : number
  {
    if ( depth >= StrategyXYChain.MAX_CHAIN_LENGTH ) return 0

    const peers = peerMap.get(current) || new Set<CellModel>()
    let excludes = 0

    for ( const next of peers )
    {
      if ( visited.has(next) ) continue
      if ( next.isKnown ) continue
      if ( next.as_candidate_array.length !== 2 ) continue

      const sharedCandidates = current.as_candidate_array.filter(candidate => next.includes(candidate))
      if ( sharedCandidates.length !== 1 ) continue
      if ( sharedCandidates[0] !== requiredCandidate ) continue

      const nextCandidates = next.as_candidate_array
      const nextOutgoingCandidate = nextCandidates.find(candidate => candidate !== requiredCandidate)
      if ( !nextOutgoingCandidate ) continue

      const nextVisited = new Set<CellModel>(visited)
      nextVisited.add(next)

      if ( nextOutgoingCandidate === targetCandidate && depth >= 2 )
        excludes += this.eliminateFromCommonPeers(start, next, targetCandidate, peerMap)

      excludes += this.searchChain(
          start
        , next
        , targetCandidate
        , nextOutgoingCandidate
        , peerMap
        , nextVisited
        , depth + 1
      )
    }

    return excludes
  }

  private eliminateFromCommonPeers(
      start: CellModel
    , end: CellModel
    , candidate: CellValue
    , peerMap: Map<CellModel, Set<CellModel>>
  ) : number
  {
    let excludes = 0

    const startPeers = peerMap.get(start) || new Set<CellModel>()
    const endPeers = peerMap.get(end) || new Set<CellModel>()

    startPeers.forEach( peer => {
      if ( !endPeers.has(peer) ) return
      if ( peer === start || peer === end ) return
      if ( peer.isKnown ) return
      if ( !peer.includes(candidate) ) return

      const changed = peer.exclude(candidate)

      if ( changed && excludes === 0 )
      {
        this.logger?.add(`# (XY-Chain): ${candidate.label} via [${start.name} -> ${end.name}]`)
      }

      changed && excludes++
      this.logger?.add(`XY-Chain: ${peer.name}.exclude(${candidate.label}) ${changed}`)
    })

    return excludes
  }

  private buildPeerMap( board: iBoard ) : Map<CellModel, Set<CellModel>>
  {
    const peerMap = new Map<CellModel, Set<CellModel>>()

    const processUnit = ( unit: iUnit ) => {
      unit.forEachCell( cell => {
        if ( cell.isKnown ) return

        peerMap.has(cell) || peerMap.set(cell, new Set())

        unit.forEachCell( peer => {
          ( peer !== cell ) && peerMap.get(cell)?.add(peer)
        })
      })
    }

    board.forEachRow(processUnit)
    board.forEachCol(processUnit)
    board.forEachBox(processUnit)

    return peerMap
  }

  private findBivalueCells( board: iBoard ) : Array<CellModel>
  {
    const cells: Array<CellModel> = []

    board.forEachRow( row => {
      row.forEachCell( cell => {
        if ( cell.isKnown ) return
        if ( cell.as_candidate_array.length !== 2 ) return
        cells.push(cell)
      })
    })

    return cells
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END