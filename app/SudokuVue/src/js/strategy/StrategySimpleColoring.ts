// StrategySimpleColoring.ts

import type { iBoard         } from '@/js/interface/iBoard'
import type { iUnit          } from '@/js/interface/iUnit'
import type { CellModel      } from '@/js/model/CellModel'
import      { CellValue      } from '@/js/model/CellValue'
import      { aStrategyBoard } from '@/js/abstract/aStrategyBoard'

export
class StrategySimpleColoring extends aStrategyBoard
{
  protected applyStrategy( board: iBoard ) : boolean
  {
    let excludes = 0

    CellValue.arrayFactory.forEach(cv => {
      excludes += this.applyCandidateColoring(board, cv)
    })

    return excludes > 0
  }

  private applyCandidateColoring( board: iBoard, cv: CellValue ) : number
  {
    const candidateCells = this.findCandidateCells(board, cv)
    if ( candidateCells.length < 4 ) return 0

    const graph = this.buildStrongLinkGraph(board, cv)
    if ( graph.size === 0 ) return 0

    const { colorMap, components } = this.colorComponents(graph)
    if ( components.length === 0 ) return 0

    let excludes = 0

    for ( const component of components )
    {
      let applied = false
      const colorFalse = this.findInvalidColor(component, colorMap)

      if ( colorFalse !== null )
      {
        excludes += this.excludeColor(component, colorMap, colorFalse, cv)
        applied = true

        if ( this.logger )
        {
          this.logger.add(`# (Simple-Coloring Wrap): ${cv.label}`)
          this.logger.add(`#  Invalid color: ${colorFalse} in [ ${component.map(cell => cell.name).sort().join(', ')} ]`)
        }
      }

      if ( !applied )
      {
        const trapExcludes = this.excludeColorTraps(candidateCells, component, colorMap, cv)
        excludes += trapExcludes

        if ( trapExcludes > 0 && this.logger )
          this.logger.add(`# (Simple-Coloring Trap): ${cv.label}`)
      }
    }

    return excludes
  }

  private findCandidateCells( board: iBoard, cv: CellValue ) : Array<CellModel>
  {
    const cells: Array<CellModel> = []

    board.forEachRow(row => {
      row.forEachCell(cell => {
        if ( cell.isKnown ) return
        if ( !cell.includes(cv) ) return
        cells.push(cell)
      })
    })

    return cells
  }

  private buildStrongLinkGraph( board: iBoard, cv: CellValue ) : Map<CellModel, Set<CellModel>>
  {
    const graph = new Map<CellModel, Set<CellModel>>()

    const connect = ( a: CellModel, b: CellModel ) => {
      graph.has(a) || graph.set(a, new Set<CellModel>())
      graph.has(b) || graph.set(b, new Set<CellModel>())
      graph.get(a)?.add(b)
      graph.get(b)?.add(a)
    }

    const processUnit = ( unit: iUnit ) => {
      const unitCells: Array<CellModel> = []

      unit.forEachCell(cell => {
        if ( cell.isKnown ) return
        if ( !cell.includes(cv) ) return
        unitCells.push(cell)
      })

      if ( unitCells.length === 2 ) connect(unitCells[0], unitCells[1])
    }

    board.forEachRow(processUnit)
    board.forEachCol(processUnit)
    board.forEachBox(processUnit)

    return graph
  }

  private colorComponents( graph: Map<CellModel, Set<CellModel>> ) : {
      colorMap: Map<CellModel, 0 | 1>,
      components: Array<Array<CellModel>>
    }
  {
    const colorMap = new Map<CellModel, 0 | 1>()
    const components: Array<Array<CellModel>> = []

    graph.forEach((neighbors, start) => {
      if ( neighbors.size === 0 ) return
      if ( colorMap.has(start) ) return

      const queue: Array<CellModel> = [start]
      const component: Array<CellModel> = []
      colorMap.set(start, 0)

      while ( queue.length > 0 )
      {
        const cell = queue.shift()
        if ( !cell ) break

        component.push(cell)

        const color = colorMap.get(cell)
        if ( color == null ) continue

        graph.get(cell)?.forEach(neighbor => {
          const current = colorMap.get(neighbor)

          if ( current == null )
          {
            colorMap.set(neighbor, (color === 0 ? 1 : 0))
            queue.push(neighbor)
          }
        })
      }

      components.push(component)
    })

    return { colorMap, components }
  }

  private findInvalidColor( component: Array<CellModel>, colorMap: Map<CellModel, 0 | 1> ) : 0 | 1 | null
  {
    for ( let i = 0 ; i < component.length - 1 ; i++ )
      for ( let j = i + 1 ; j < component.length ; j++ )
      {
        const a = component[i]
        const b = component[j]
        const colorA = colorMap.get(a)
        const colorB = colorMap.get(b)

        if ( colorA == null || colorB == null ) continue
        if ( colorA !== colorB ) continue
        if ( !this.arePeers(a, b) ) continue

        return colorA
      }

    return null
  }

  private excludeColor(
      component: Array<CellModel>
    , colorMap: Map<CellModel, 0 | 1>
    , colorFalse: 0 | 1
    , cv: CellValue
  ) : number
  {
    let excludes = 0

    component.forEach(cell => {
      const color = colorMap.get(cell)
      if ( color == null || color !== colorFalse ) return

      const changed = cell.exclude(cv)
      if ( changed )
      {
        excludes++
        this.logger?.add(`Simple-Coloring: ${cell.name}.exclude(${cv.label}) true`)
      }
    })

    return excludes
  }

  private excludeColorTraps(
      allCandidateCells: Array<CellModel>
    , component: Array<CellModel>
    , colorMap: Map<CellModel, 0 | 1>
    , cv: CellValue
  ) : number
  {
    let excludes = 0
    const componentSet = new Set<CellModel>(component)
    const colorZero = component.filter(cell => colorMap.get(cell) === 0)
    const colorOne = component.filter(cell => colorMap.get(cell) === 1)

    allCandidateCells.forEach(cell => {
      if ( componentSet.has(cell) ) return

      const seesColorZero = colorZero.some(colored => this.arePeers(cell, colored))
      if ( !seesColorZero ) return

      const seesColorOne = colorOne.some(colored => this.arePeers(cell, colored))
      if ( !seesColorOne ) return

      const changed = cell.exclude(cv)
      if ( changed )
      {
        excludes++
        this.logger?.add(`Simple-Coloring: ${cell.name}.exclude(${cv.label}) true`)
      }
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