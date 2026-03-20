
// StrategyYWing.ts

import type { iBoard      } from '@/js/interface/iBoard';
import type { CellModel   } from '@/js/model/CellModel';
import type { CellValue   } from '@/js/model/CellValue';
import type { iBox        } from '@/js/interface/iBox';
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

    // All cells that are untested/proved candidates for Y-Wing
    //  - they have exactly two possible values
    const candidateCells: Array<CellModel> = [];

    // Map cells to their peers
    //  - this is used to find the common candidates
    const peerMap = new Map<CellModel, Set<CellModel>>();

    const processUnit = (unit: iUnit | iBox ) => {

      unit.forEachCell( cell => {

        // Skip if the cell has a "determined" value
        //  - It won't be a candidate for Y-Wing nor do we need to know its peers
        if (cell.isKnown) return

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
    // this.logger?.add(`# YWing: Found ${candidateCells.length} candidate pairs`);
    // this.logger?.add(`# YWing: (${candidateCells.map(c => c.name).join(',')})`);

    // My goal is to push y-wing triples into this array
    // TODO: store before cleanup... we'll get there
    // const yWingTriples: Array<[CellModel, CellModel, CellModel]> = [];
    // void yWingTriples

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

      // A Pivot candidate, lets find if we have cells that complete this Y-Wing
      //  - The pivot cell must have two candidates, unique candidates
      //  - that form (A,B) => (B,C) => (C,A)
      //  - The (B,C) pincer must intersect with the (A,B) pivot OR intersect with the (C,A) pincer
      //  - The (C,A) pincer must intersect with the (A,B) pivot OR intersect with the (B,C) pincer
      const [a, b] = pivot.as_candidate_array;

      // This is the first leg of a canidate Y-Wing (A,B) => F(B,C)
      //  - they are untested as intercepts; that will be the final after we have the BC's and CA's
      const pincersBC = this.findPincerCells(candidateCells, pivot, b, a);
      // This is the second leg of a candidate Y-Wing (A,B) => F(C,A)
      const pincersCA = this.findPincerCells(candidateCells, pivot, a, b);

      const commonBC = pincersBC.filter( pincerBC => {
        return pincersCA.some( pincerCA => {
          // const [a1, b1] = pincerBC.as_candidate_array;
          // const [a2, b2] = pincerCA.as_candidate_array;
          return ( // a1 == b2 && // b1 !== a2 &&
              peerMap.get(pivot)?.has(pincerBC) &&
              peerMap.get(pivot)?.has(pincerCA) &&
             !peerMap.get(pincerCA)?.has(pincerBC)
            );
        })
      })

      const commonCA = pincersCA.filter( pincerCA => {
        return pincersBC.some( pincerBC => {
          // const [a1, b1] = pincerBC.as_candidate_array;
          // const [a2, b2] = pincerCA.as_candidate_array;
          return ( // a1 == b2 && // && b1 !== a2
              peerMap.get(pivot)?.has(pincerCA) &&
              peerMap.get(pivot)?.has(pincerBC) &&
             !peerMap.get(pincerBC)?.has(pincerCA)
            );
        })
      })

      // const whereABCintersects: Array<CellModel> = [...commonBC,...commonCA];

      // Debugging: Log the pincers found
      // this.logger?.add(`# YWing: Pivot ${pivot.name} (${a.value},${b.value}) => (${pincersBC.map(c => c.name).join(',')}) => (${pincersCA.map(c => c.name).join(',')})`);
      // this.logger?.add(`# YWing: CAN: (${whereABCintersects.map(c => c.name).join(',')})`);

      // pincersBC.forEach(pincer => {
      //   this.logger?.add(`# YWing: Pincer BC: ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });
      // pincersCA.forEach(pincer => {
      //   this.logger?.add(`# YWing: Pincer CA: ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });
      // commonCA.forEach(pincer => {
      //   this.logger?.add(`# YWing: (B,C) ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
      // });
      // commonBC.forEach(pincer => {
      //   this.logger?.add(`# YWing: (C,A) ${pincer.name} (${pincer.as_candidate_array.map(c => c.value).join(',')})`);
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

            // this.logger?.add(`# YWing: Found Y-Wing with pivot ${pivot.name} having pincers [${pincer1.name},${pincer2.name}]`);
            // this.logger?.add(`# YWing: ([A,B]=${pivot.as_candidate_array.map(c => c.value).join(',')}) => ([B,C]=${pincer1.as_candidate_array.map(c => c.value).join(',')}) => ([C,A]=${pincer2.as_candidate_array.map(c => c.value).join(',')})`);
            // this.logger?.add(`# YWing: Common candidate: ${commonCandidate?.value}`);

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
    // Find the common peers between the two pincers
    //  - this is the set of cells that are common to both pincers
    //     (intersecting)
    //  - these cells are the ones that will have the candidate value excluded from them
    //  - unsolved, having the candidate value
    const wing_a_peers = peerMap.get(wing_a) || new Set([]);
    const wing_b_peers = peerMap.get(wing_b) || new Set([]);

    const wing_a_peers_intersect = [...wing_a_peers]
      .filter( peer => {
        return peer.as_candidate_array.includes(candidate)
            && peer !== pivot
            && wing_b_peers?.has(peer)
      });

    const wing_b_peers_intersect = [...wing_b_peers]
      .filter( peer => {
        return peer.as_candidate_array.includes(candidate)
            && peer !== pivot
            && wing_a_peers?.has(peer)
      });

    const unique_peers = new Set<CellModel>([ ...wing_a_peers_intersect, ...wing_b_peers_intersect]);

    // console.log('# A:', wing_a.name, [...wing_a_peers].map(cell => cell.name).sort().join(','));
    // console.log('# B:', wing_b.name, [...wing_b_peers].map(cell => cell.name).sort().join(','));
    // console.log([...unique_a_b_peers].map(cell => cell.name).join(','));

    let first = true;
    let changes = 0;

    for ( const peer of unique_peers )
    {
      const excluded = peer.exclude(candidate);

      if ( first && excluded )
      {
        this.logger?.add(`# YWing: Found Y-Wing with pivot ${pivot.name} having pincers [${wing_a.name},${wing_b.name}]`);
        this.logger?.add(`# YWing: ([A,B]=${pivot.as_candidate_array.map(c => c.value).join(',')}) => ([B,C]=${wing_a.as_candidate_array.map(c => c.value).join(',')}) => ([C,A]=${wing_b.as_candidate_array.map(c => c.value).join(',')})`);
        this.logger?.add(`# YWing: Common candidate: ${candidate?.value}`);
        this.logger?.add(`# YWing: ${peer.name}.exclude(${candidate.value}) ${excluded}`);
        first = false;
      }

      first && this.logger?.add(`# YWing: ${peer.name}.exclude(${candidate.value}) ${excluded}`);
      excluded && changes++;
    }

    return changes;
  }
}

// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
