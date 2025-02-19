
// StrategyYWing.ts

import type { iBoard      } from '@/js/interface/iBoard';
import type { CellModel   } from '@/js/model/CellModel';
import type { CellValue   } from '@/js/model/CellValue';
import type { iUnit       } from '@/js/interface/iUnit';
import { aStrategyBoard   } from '@/js/abstract/aStrategyBoard';

export
class StrategyYWing extends aStrategyBoard
{
  protected applyStrategy(board: iBoard): boolean
  {
    return this.strategy_Y_Wing(board);
  }

  private strategy_Y_Wing(board: iBoard): boolean
  {
    let changesMade = 0;

    // Preprocess the board to collect cells with exactly two candidates
    const candidateCells: Array<CellModel> = [];
    const peerMap = new Map<CellModel, Set<CellModel>>();

    const processUnit = (unit: iUnit) => {

      unit.forEachCell( cell => {

        // if (cell.isKnown) return

        if (cell.as_candidate_array.length === 2 && ! candidateCells.includes(cell))
          candidateCells.push(cell);

        // Build peer map
        peerMap.has(cell) || peerMap.set(cell, new Set());

        unit.forEachCell( peer => {
          ( peer !== cell ) && peerMap.get(cell)?.add(peer);
        })
      })
    }

    board.forEachRow(processUnit);
    board.forEachCol(processUnit);
    board.forEachBox(processUnit);

    // Debugging: Log candidate pairs and their cells
    // Looks incomplete! No it does not work!
    this.logger?.add(`# YWing: Found ${candidateCells.length} candidate pairs`);
    this.logger?.add(`# YWing: (${candidateCells.map(c => c.name).join(',')})`);

    // candidateCells.forEach(cell => {
    //   const key = cell.as_candidate_array.map(c => c.value).sort().join(',');
    //   this.logger?.add(`# YWing: Found candidate pair [${key}] in cell: ${cell.name}`);
    // });

    // Iterate over the candidate cells to find potential Y-Wing patterns
    for (const pivot of candidateCells)
    {
      // Skip if the pivot cell is already known
      //  We check them above BUT it's possible to have more than one Y-Wing
      //  and while we are at it, cells that were once unsolved may be solved
      //  by the time we get here. Odly enough a different verson of this solution
      //   didne;t bumpt into this issue. ALthough it didn't actually help solve
      //   more of the puzzles in the library. This version helpes solve a few more.
      if ( pivot.isKnown) continue;

      const [a, b] = pivot.as_candidate_array;

      // Find pincers for (A,B) => (B,C) and (A,B) => (C,A)
      // this code fails to verify the third leg of the Y-Wing of (C,A) => (A,B)

      // This is the first leg of a canidate Y-Wing (A,B) => F(B,C)
      const pincersBC = this.findPincerCells(candidateCells, pivot, b, a);
      // This is the second leg of a candidate Y-Wing (A,B) => F(C,A)
      const pincersCA = this.findPincerCells(candidateCells, pivot, a, b);

      const commonBC = pincersBC.filter( pincerBC => {
        return pincersCA.some( pincerCA => {
          const [a1, b1] = pincerBC.as_candidate_array;
          const [a2, b2] = pincerCA.as_candidate_array;
          return ( a1 == b2 ) // ( b === b1 && a === b2 ) || ( a === a1 && b === b1 );
        })
      })

      const commonCA = pincersCA.filter( pincerCA => {
        return pincersBC.some( pincerBC => {
          const [a1, b1] = pincerBC.as_candidate_array;
          const [a2, b2] = pincerCA.as_candidate_array;
          return ( a1 == b2 ) // ( b === b1 && a === b2 ) || ( a === a1 && b === b1 );
        })
      })

      // const whereABCintersects: Array<CellModel> = [...commonBC,...commonCA];

      // Debugging: Log the pincers found
      this.logger?.add(`# YWing: Pivot ${pivot.name} (${a.value},${b.value}) => (${pincersBC.map(c => c.name).join(',')}) => (${pincersCA.map(c => c.name).join(',')})`);
      // this.logger?.add(`# YWing: CAN: (${whereABCintersects.map(c => c.name).join(',')})`);

      // pincersBC.forEach(pincer => {
      //   this.logger?.add(`# YWing: Pincer BC: ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });
      // pincersCA.forEach(pincer => {
      //   this.logger?.add(`# YWing: Pincer CA: ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });
      // commonCA.forEach(pincer => {
      //   this.logger?.add(`# YWing: Common candidate: ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });
      // commonBC.forEach(pincer => {
      //   this.logger?.add(`# YWing: Common candidate: ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });

      for (const pincer1 of commonBC)
      {
        for (const pincer2 of commonCA)
        {
          if ( pincer1 !== pincer2 )
          {
            const commonCandidate = this.findCommonCandidate(pincer1, pincer2);

            if ( !commonCandidate ) continue;

            // Debugging: Log the found Y-Wing pattern
            // Just because we get here doesn't mean we have a Y-Wing
            // In fact most of the set are invalid and do not from a chain!

            this.logger?.add(`# YWing: Found Y-Wing with pivot ${pivot.name} having pincers [${pincer1.name},${pincer2.name}]`);
            this.logger?.add(`# YWing: ([A,B]=${pivot.as_candidate_array.map(c => c.value).join(',')}) => ([B,C]=${pincer1.as_candidate_array.map(c => c.value).join(',')}) => ([C,A]=${pincer2.as_candidate_array.map(c => c.value).join(',')})`);
            this.logger?.add(`# YWing: Common candidate: ${commonCandidate?.value}`);

            if ( commonCandidate !== null )
              changesMade += this.eliminateCandidateFromCommonPeers(peerMap, pivot, pincer1, pincer2, commonCandidate);
          }
        }
      }

      if ( a.value === 3 && b.value === 8 ) break
    }

    return changesMade > 0;
  }

  private findPincerCells(
          cells: Array<CellModel>
        , pivot: CellModel
        , include: CellValue
        , exclude: CellValue )
    : Array<CellModel>
  {
    return cells.filter(cell => {
      const cell_value_candidates = cell.as_candidate_array;
      return cell !== pivot && cell_value_candidates.length === 2 &&
        cell_value_candidates.includes(include) && !cell_value_candidates.includes(exclude);
    })
  }

  private findCommonCandidate(cell1: CellModel, cell2: CellModel): CellValue | null
  {
    return cell1.as_candidate_array.find(candidate => cell2.as_candidate_array.includes(candidate)) || null;
  }

  private eliminateCandidateFromCommonPeers(
          peerMap: Map<CellModel
        , Set<CellModel>>
        , pivot: CellModel
        , wing_a: CellModel
        , wing_b: CellModel
        , candidate: CellValue
    ) : number
  {
    const pivot_peers = peerMap.get(pivot);
    let changes = 0;

    if ( pivot_peers )
      for (const peer of pivot_peers)
      {
        if ( peer !== wing_a && peer !== wing_b && peer.as_candidate_array.includes(candidate)) {
          const excluded = peer.exclude(candidate);
          this.logger?.add(`# YWing: ${peer.name}.exclude(${candidate.value}) ${excluded}`);
          excluded && changes++;
        }
      }

    return changes;
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
