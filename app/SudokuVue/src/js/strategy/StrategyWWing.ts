// StrategyWWing.ts

import type { iBoard         } from '@/js/interface/iBoard'
import type { iUnit          } from '@/js/interface/iUnit'
import type { CellModel      } from '@/js/model/CellModel'
import type { CellValue      } from '@/js/model/CellValue'
import      { aStrategyBoard } from '@/js/abstract/aStrategyBoard'

export
class StrategyWWing extends aStrategyBoard
{
  protected applyStrategy( board: iBoard ) : boolean
  {
    let excludes = 0

    const peerMap = this.buildPeerMap(board)
    const strongLinks = this.findStrongLinks(board)
    const bivaluePairs = this.findBiValuePairs(board)

    // For each candidate pair (x,y), find two cells with same pair
    // that are connected by a strong link on x or y.
    bivaluePairs.forEach( cells => {

      for ( let i = 0 ; i < cells.length - 1 ; i++ )
      {
        for ( let j = i + 1 ; j < cells.length ; j++ )
        {
          const wingA = cells[i]
          const wingB = cells[j]

          // W-Wing endpoints are normally not direct peers.
          if ( peerMap.get(wingA)?.has(wingB) ) continue

          const [candidateX, candidateY] = wingA.as_candidate_array

          excludes += this.tryWWing(
              wingA
            , wingB
            , candidateX
            , candidateY
            , strongLinks
            , peerMap
          )

          excludes += this.tryWWing(
              wingA
            , wingB
            , candidateY
            , candidateX
            , strongLinks
            , peerMap
          )
        }
      }
    })

    return excludes > 0
  }

  private tryWWing(
      wingA: CellModel
    , wingB: CellModel
    , strongCandidate: CellValue
    , eliminateCandidate: CellValue
    , strongLinks: Map<CellValue, Array<[CellModel, CellModel]>>
    , peerMap: Map<CellModel, Set<CellModel>>
  ) : number
  {
    let excludes = 0
    const links = strongLinks.get(strongCandidate) || []

    for ( const [linkA, linkB] of links )
    {
      const linkMatchesWingPair = (
           ( peerMap.get(wingA)?.has(linkA) && peerMap.get(wingB)?.has(linkB) )
        || ( peerMap.get(wingA)?.has(linkB) && peerMap.get(wingB)?.has(linkA) )
      )

      if ( !linkMatchesWingPair ) continue

      const eliminations = this.eliminateFromCommonPeers(
          wingA
        , wingB
        , eliminateCandidate
        , peerMap
      )

      if ( eliminations > 0 )
      {
        this.logger?.add(`# (W-Wing): [${wingA.name},${wingB.name}] pair(${wingA.as_candidate_array.map(c => c.label).join(',')})`)
        this.logger?.add(`#  Strong-link: ${strongCandidate.label} via [${linkA.name},${linkB.name}]`)
      }

      excludes += eliminations
    }

    return excludes
  }

  private eliminateFromCommonPeers(
      wingA: CellModel
    , wingB: CellModel
    , candidate: CellValue
    , peerMap: Map<CellModel, Set<CellModel>>
  ) : number
  {
    let excludes = 0

    const wingAPeers = peerMap.get(wingA) || new Set<CellModel>()
    const wingBPeers = peerMap.get(wingB) || new Set<CellModel>()

    wingAPeers.forEach( peer => {
      if ( !wingBPeers.has(peer) ) return
      if ( peer.isKnown ) return
      if ( !peer.includes(candidate) ) return

      const changed = peer.exclude(candidate)
      changed && excludes++
      this.logger?.add(`W-Wing: ${peer.name}.exclude(${candidate.label}) ${changed}`)
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

  private findStrongLinks( board: iBoard ) : Map<CellValue, Array<[CellModel, CellModel]>>
  {
    const links = new Map<CellValue, Array<[CellModel, CellModel]>>()

    const processUnit = ( unit: iUnit ) => {
      const valueMap = new Map<CellValue, Array<CellModel>>()

      unit.forEachCell( cell => {
        if ( cell.isKnown ) return

        cell.forEachValue( cv => {
          valueMap.has(cv) && valueMap.get(cv)?.push(cell) || valueMap.set(cv, [cell])
        })
      })

      valueMap.forEach(( cells, cv ) => {
        if ( cells.length !== 2 ) return

        links.has(cv) || links.set(cv, [])
        links.get(cv)?.push([cells[0], cells[1]])
      })
    }

    board.forEachRow(processUnit)
    board.forEachCol(processUnit)
    board.forEachBox(processUnit)

    return links
  }

  private findBiValuePairs( board: iBoard ) : Map<string, Array<CellModel>>
  {
    const pairMap = new Map<string, Array<CellModel>>()

    board.forEachRow( row => {
      row.forEachCell( cell => {
        if ( cell.isKnown ) return
        if ( cell.as_candidate_array.length !== 2 ) return

        const key = cell.as_candidate_array
          .map(cv => cv.label)
          .sort()
          .join(',')

        pairMap.has(key) && pairMap.get(key)?.push(cell) || pairMap.set(key, [cell])
      })
    })

    return pairMap
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END