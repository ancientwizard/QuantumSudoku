// AboutBoard.vue

<script lang="ts">

import { BoardMode, BoardModel } from '@/js/model/BoardModel'
import { CellIndex } from '@/js/model/CellIndex'
import { CellValue } from '@/js/model/CellValue'

type BoardCellView = {
  key: string
  rowIndex: number
  colIndex: number
  isKnown: boolean
  value: string
  candidates: Array<string>
}

export default {

  data: () => ({
    boardView: [] as Array<BoardCellView>,
    boardModel: null as BoardModel | null,
    givenCount: 0,
    givenTarget: 12,
    cycleMs: 20000,
    stepMs: 750,
    cycleTimer: null as ReturnType<typeof setInterval> | null,
    stepTimer: null as ReturnType<typeof setInterval> | null
  }),

  mounted () {
    this.startBoardDemoCycle()
    this.cycleTimer = setInterval(() => this.startBoardDemoCycle(), this.cycleMs)
  },

  beforeUnmount () {
    if (this.cycleTimer) {
      clearInterval(this.cycleTimer)
      this.cycleTimer = null
    }

    if (this.stepTimer) {
      clearInterval(this.stepTimer)
      this.stepTimer = null
    }
  },

  methods: {
    goToPlay() {
      this.$router.push({ name: 'play' })
    },

    shuffleArray<T>(values: Array<T>): Array<T> {
      const copy = [...values]
      for (let idx = copy.length - 1; idx > 0; idx -= 1) {
        const rand = Math.floor(Math.random() * (idx + 1))
        const keep = copy[idx]
        copy[idx] = copy[rand]
        copy[rand] = keep
      }
      return copy
    },

    buildBoardView(board: BoardModel) {
      const nextView: Array<BoardCellView> = []

      board.forEachRow((row, rowIndex) => {
        row.as_cell_array.forEach((cell, colIndex) => {
          nextView.push({
            key: `${rowIndex}-${colIndex}`,
            rowIndex,
            colIndex,
            isKnown: cell.isKnown,
            value: cell.isKnown ? cell.cv.label : '',
            candidates: cell.as_label_array
          })
        })
      })

      this.boardView = nextView
    },

    startBoardDemoCycle () {
      const board = new BoardModel(BoardMode.SOLVE)

      this.boardModel = board
      this.givenCount = 0
      this.givenTarget = 12 + Math.floor(Math.random() * 7)
      this.buildBoardView(board)

      if (this.stepTimer) {
        clearInterval(this.stepTimer)
        this.stepTimer = null
      }

      this.stepTimer = setInterval(() => this.applyNextGiven(), this.stepMs)
    },

    applyNextGiven () {
      if (!this.boardModel) {
        return
      }

      if (this.givenCount >= this.givenTarget) {
        if (this.stepTimer) {
          clearInterval(this.stepTimer)
          this.stepTimer = null
        }
        return
      }

      const unknownCells: Array<{ rowIndex: number, colIndex: number, candidates: Array<CellValue> }> = []

      this.boardModel.forEachRow((row, rowIndex) => {
        row.as_cell_array.forEach((cell, colIndex) => {
          if (cell.isUnknown && cell.as_candidate_array.length > 0) {
            unknownCells.push({
              rowIndex,
              colIndex,
              candidates: cell.as_candidate_array
            })
          }
        })
      })

      if (unknownCells.length === 0) {
        if (this.stepTimer) {
          clearInterval(this.stepTimer)
          this.stepTimer = null
        }
        return
      }

      const chosenCell = unknownCells[Math.floor(Math.random() * unknownCells.length)]
      const chosenValue = chosenCell.candidates[Math.floor(Math.random() * chosenCell.candidates.length)]
      const wasSet = this.boardModel.set(
        CellIndex.by(chosenCell.colIndex),
        CellIndex.by(chosenCell.rowIndex),
        chosenValue
      )

      if (!wasSet) {
        return
      }

      this.givenCount += 1
      this.buildBoardView(this.boardModel)

      if (this.givenCount >= this.givenTarget && this.stepTimer) {
        clearInterval(this.stepTimer)
        this.stepTimer = null
      }
    }
  }
}

</script>

<template>
  <div>
    <section class="card m-2 border-secondary-subtle shadow-sm">
      <div class="card-header bg-light text-secondary d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Anatomy of the Sudoku Board</h5>
        <button type="button" class="btn btn-primary btn-sm" @click="goToPlay">Next: Play →</button>
      </div>
      <div class="card-body pt-2 pb-4 px-4">
        <div class="row align-items-start g-4" style="margin-top:0;">
          <div class="col-lg-7">
            <p>
              The <strong>Board</strong> is the complete 9×9 grid that forms a standard Sudoku puzzle. It is the sum of all units and cells:
              eighty-one (81) Cells organized into three levels of units — Rows, Columns, and Blocks.
            </p>
            <p>
              A Sudoku Board contains:
            </p>
            <ul>
              <li><strong>81 Cells</strong> — individual positions that hold or can hold values 1-9</li>
              <li><strong>9 Rows</strong> — horizontal lines</li>
              <li><strong>9 Columns</strong> — vertical lines</li>
              <li><strong>9 Blocks</strong> — 3×3 regional groupings</li>
              <li><strong>27 Unit constraints</strong> — each unit (row, column, block) requiring all nine values exactly once</li>
            </ul>
            <p class="mb-0">
              The puzzle is typically seeded with a small number of known cells (the "givens" or "clues"). The challenge is to fill the remaining empty cells
              such that every row, column, and block contains all nine values (1-9) exactly once.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="board-demo-shell" aria-live="polite">
              <div class="board-demo">
                <div class="board-grid">
                  <div
                    v-for="cell in boardView"
                    :key="cell.key"
                    class="board-cell"
                    :class="{
                      'board-cell-known': cell.isKnown,
                      'board-cell-block-right': cell.colIndex % 3 === 2 && cell.colIndex < 8,
                      'board-cell-block-bottom': cell.rowIndex % 3 === 2 && cell.rowIndex < 8
                    }"
                  >
                    <span v-if="cell.isKnown" class="board-known-value">{{ cell.value }}</span>
                    <div v-else class="board-candidates-grid">
                      <span
                        v-for="digit in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
                        :key="digit"
                        class="board-candidate"
                        :class="{ 'board-candidate-hidden': !cell.candidates.includes(digit) }"
                      >
                        {{ digit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 p-3 bg-light border rounded">
          <strong>The Board's Story:</strong>
          <p class="mt-2 mb-0">
            Every Sudoku puzzle begins as a blank board. The puzzle setter then places clues strategically, ensuring a unique solution exists.
            A well-designed puzzle reveals itself through logic alone — no guessing required. The elegance of Sudoku lies in this balance:
            enough constraints to force a unique answer, yet enough freedom in the solving path to make discovery rewarding.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

.board-demo-shell {
  max-width: 30rem;
  margin: 0 auto;
}

.board-demo {
  border: 1px solid #d6dde8;
  border-radius: 0.6rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f2f6fb 100%);
  padding: 0.55rem;
  overflow-x: auto;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 0;
  border: 2px solid #52667d;
  background: #52667d;
}

.board-cell {
  aspect-ratio: 1 / 1;
  min-height: 2rem;
  border-right: 1px solid #b8c6d4;
  border-bottom: 1px solid #b8c6d4;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #1e3550;
}

.board-cell-known {
  background: #eef5fd;
}

.board-cell-block-right {
  border-right: 2px solid #52667d;
}

.board-cell-block-bottom {
  border-bottom: 2px solid #52667d;
}

.board-known-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e3550;
  line-height: 1;
}

.board-candidates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(0, 1fr));
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  font-size: 0.34rem;
  line-height: 1;
  color: #496581;
}

.board-candidate {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  line-height: 1;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.board-candidate-hidden {
  opacity: 0;
}

@media (max-width: 992px) {
  .board-demo-shell {
    max-width: 26rem;
  }

  .board-cell {
    min-height: 1.8rem;
  }

  .board-known-value {
    font-size: 0.86rem;
  }

  .board-candidates-grid {
    font-size: 0.3rem;
  }
}

@media (max-width: 576px) {
  .board-demo-shell {
    max-width: 100%;
  }

  .board-cell {
    min-height: 1.55rem;
  }

  .board-known-value {
    font-size: 0.76rem;
  }

  .board-candidates-grid {
    font-size: 0.26rem;
  }
}

</style>

// vim: expandtab tabstop=2 number
// END
