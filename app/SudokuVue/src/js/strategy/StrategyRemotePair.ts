// StrategyRemotePair.ts

import type { iBoard         } from '@/js/interface/iBoard'
import type { CellModel      } from '@/js/model/CellModel'
import type { CellValue      } from '@/js/model/CellValue'
import      { aStrategyBoard } from '@/js/abstract/aStrategyBoard'

export
class StrategyRemotePair extends aStrategyBoard
{
  protected applyStrategy( board: iBoard ) : boolean
  {
    let excludes = 0
    const pairMap = this.findBivaluePairCells(board)

    pairMap.forEach((cells, key) => {
      if ( cells.length < 4 ) return
      excludes += this.applyPairChain(board, key, cells)
    })

    return excludes > 0
  }

  private findBivaluePairCells( board: iBoard ) : Map<string, Array<CellModel>>
  {
    const pairMap = new Map<string, Array<CellModel>>()

    board.forEachRow(row => {
      row.forEachCell(cell => {
        if ( cell.isKnown ) return
        if ( cell.as_candidate_array.length !== 2 ) return

        const key = cell.as_candidate_array.map(cv => cv.label).sort().join(',')
        pairMap.has(key) && pairMap.get(key)?.push(cell) || pairMap.set(key, [cell])
      })
    })

    return pairMap
  }

  private applyPairChain( board: iBoard, key: string, cells: Array<CellModel> ) : number
  {
    const graph = this.buildPeerGraph(cells)
    const components = this.getComponents(graph)
    let excludes = 0

    components.forEach(component => {
      if ( component.length < 4 ) return

      const colorMap = this.colorComponent(graph, component)
      const colorZero = component.filter(cell => colorMap.get(cell) === 0)
      const colorOne = component.filter(cell => colorMap.get(cell) === 1)

      if ( colorZero.length === 0 || colorOne.length === 0 ) return

      excludes += this.excludeFromTraps(board, key, component, colorZero, colorOne)
    })

    return excludes
  }

  private buildPeerGraph( cells: Array<CellModel> ) : Map<CellModel, Set<CellModel>>
  {
    const graph = new Map<CellModel, Set<CellModel>>()

    cells.forEach(cell => graph.set(cell, new Set<CellModel>()))

    for ( let i = 0 ; i < cells.length - 1 ; i++ )
      for ( let j = i + 1 ; j < cells.length ; j++ )
      {
        const a = cells[i]
        const b = cells[j]
        if ( !this.arePeers(a, b) ) continue

        graph.get(a)?.add(b)
        graph.get(b)?.add(a)
      }

    return graph
  }

  private getComponents( graph: Map<CellModel, Set<CellModel>> ) : Array<Array<CellModel>>
  {
    const visited = new Set<CellModel>()
    const components: Array<Array<CellModel>> = []

    graph.forEach((neighbors, start) => {
      if ( visited.has(start) ) return
      if ( neighbors.size === 0 ) return

      const queue: Array<CellModel> = [start]
      const component: Array<CellModel> = []
      visited.add(start)

      while ( queue.length > 0 )
      {
        const cell = queue.shift()
        if ( !cell ) break

        component.push(cell)

        graph.get(cell)?.forEach(next => {
          if ( visited.has(next) ) return
          visited.add(next)
          queue.push(next)
        })
      }

      components.push(component)
    })

    return components
  }

  private colorComponent(
      graph: Map<CellModel, Set<CellModel>>
    , component: Array<CellModel>
  ) : Map<CellModel, 0 | 1>
  {
    const colorMap = new Map<CellModel, 0 | 1>()
    const queue: Array<CellModel> = []

    colorMap.set(component[0], 0)
    queue.push(component[0])

    while ( queue.length > 0 )
    {
      const cell = queue.shift()
      if ( !cell ) break

      const color = colorMap.get(cell)
      if ( color == null ) continue

      graph.get(cell)?.forEach(next => {
        if ( colorMap.has(next) ) return
        colorMap.set(next, color === 0 ? 1 : 0)
        queue.push(next)
      })
    }

    return colorMap
  }

  private excludeFromTraps(
      board: iBoard
    , pairKey: string
    , component: Array<CellModel>
    , colorZero: Array<CellModel>
    , colorOne: Array<CellModel>
  ) : number
  {
    const labels = pairKey.split(',')
    let pairValues: Array<CellValue> = []
    let excludes = 0
    const componentSet = new Set<CellModel>(component)

    // Pull actual CellValue objects from any component cell to avoid parsing labels.
    const sourceCell = component[0]
    pairValues = sourceCell.as_candidate_array

    board.forEachRow(row => {
      row.forEachCell(cell => {
        if ( cell.isKnown ) return
        if ( componentSet.has(cell) ) return
        if ( !cell.includes(pairValues[0]) && !cell.includes(pairValues[1]) ) return

        const seesZero = colorZero.some(colored => this.arePeers(cell, colored))
        if ( !seesZero ) return

        const seesOne = colorOne.some(colored => this.arePeers(cell, colored))
        if ( !seesOne ) return

        pairValues.forEach(cv => {
          if ( !cell.includes(cv) ) return

          const changed = cell.exclude(cv)
          if ( changed )
          {
            excludes++
            this.logger?.add(`Remote-Pair(${labels.join(',')}): ${cell.name}.exclude(${cv.label}) true`)
          }
        })
      })
    })

    return excludes
  }

  private arePeers( a: CellModel, b: CellModel ) : boolean
  {
    if ( a === b ) return false
    if ( a.row === b.row ) return true
    if ( a.col === b.col ) return true

    const boxA = Math.floor((a.row - 1) / 3) * 3 + Math.floor((a.col - 1) / 3)
    const boxB = Math.floor((b.row - 1) / 3) * 3 + Math.floor((b.col - 1) / 3)

    return boxA === boxB
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END