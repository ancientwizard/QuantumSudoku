// AboutLine.vue

<script lang="ts">

import { CellIndex } from '@/js/model/CellIndex'
import { CellModel } from '@/js/model/CellModel'
import { CellValue } from '@/js/model/CellValue'
import { LineModel } from '@/js/model/LineModel'

type LineCellView = {
  isKnown: boolean
  value: string
  candidates: Array<string>
}

export default {

  data: () => ({
    lineView: Array.from({ length: 9 }, () => ({
      isKnown: false,
      value: '',
      candidates: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    })) as Array<LineCellView>,
    givenCount: 0,
    refreshSeconds: 5,
    givenTarget: 5,
    cycleTimer: null as ReturnType<typeof setInterval> | null,
    stepTimer: null as ReturnType<typeof setInterval> | null,
    lineCells: null as Array<CellModel> | null,
    lineModel: null as LineModel | null,
    pendingPositions: [] as Array<number>,
    pendingValues: [] as Array<CellValue>
  }),

  mounted () {
    this.startLineDemoCycle()
    this.cycleTimer = setInterval(() => this.startLineDemoCycle(), this.refreshSeconds * 1000)
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
    goToNext() {
      this.$router.push({ name: 'block' })
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

    buildView(cells: Array<CellModel>) {
      this.lineView = cells.map(cell => ({
        isKnown: cell.isKnown,
        value: cell.isKnown ? cell.cv.label : '',
        candidates: cell.as_label_array
      }))
    },

    startLineDemoCycle () {
      const cells = Array.from({ length: 9 }, (_, index) => CellModel.factory(index + 1, 1, true))
      const line = new LineModel(cells)
      line.reset()

      this.lineCells = cells
      this.lineModel = line
      this.pendingPositions = this.shuffleArray([...Array(9).keys()]).slice(0, this.givenTarget)
      this.pendingValues = this.shuffleArray(CellValue.arrayFactory).slice(0, this.givenTarget)
      this.givenCount = 0
      this.buildView(cells)

      if (this.stepTimer) {
        clearInterval(this.stepTimer)
        this.stepTimer = null
      }

      this.stepTimer = setInterval(() => this.applyNextGiven(), 750)
    },

    applyNextGiven () {
      if (!this.lineModel || !this.lineCells) {
        return
      }

      if (this.givenCount >= this.givenTarget) {
        if (this.stepTimer) {
          clearInterval(this.stepTimer)
          this.stepTimer = null
        }
        return
      }

      const nextCellIndex = this.pendingPositions[this.givenCount]
      const nextValue = this.pendingValues[this.givenCount]
      this.lineModel.is(CellIndex.by(nextCellIndex), nextValue)
      this.givenCount += 1
      this.buildView(this.lineCells)

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
        <h5 class="mb-0">Anotomy of the Sudoku multi Cell Organism</h5>
        <button type="button" class="btn btn-primary btn-sm" @click="goToNext">Next: Block →</button>
      </div>
      <div class="card-body">
        <h5 class="card-title">The Line</h5>

        <p>
          The Sudoku "Line" is the simplest multi Cell relationship within the Sudoku puzzle board.
          There are eighteen (18) Lines wihin a traditional sudoku board, having nine (9) rows and
          nine (9) colums. The Line is formed by the relationship of a Cell having nine (9) neighbor Cells,
          above, below, left or right. This means that every Cell is a member of exactly two (2)
          "Lines", one virtical (a column) and one horizontal (a row).
        </p>

        <div class="p-4 m-4">
          <div class="line-demo mb-3" aria-live="polite">
            <div class="line-grid">
              <div
                v-for="(cell, index) in lineView"
                :key="index"
                class="line-cell"
                :class="{ 'line-cell-known': cell.isKnown }"
              >
                <span v-if="cell.isKnown" class="cell-known">{{ cell.value }}</span>
                <div v-else class="cell-candidates-grid">
                  <span
                    v-for="digit in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
                    :key="digit"
                    class="cell-candidate"
                    :class="{ 'cell-candidate-hidden': !cell.candidates.includes(digit) }"
                  >
                    {{ digit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p class="line-demo-note py-0 my-0">
            As cells become known neighboring cells eliminate the known value from their candidate lists, which is the basis of the logic of Sudoku solving.
          </p>
        </div>

        <p>
          For a Sudoku Puzzle designed to include the additional element of diagional, then some
          Cells are members of zero, one or both diagonal lines.
        </p>
        <p>
          Since the nature of the Sudoku Puzzle is to solve using logic then for any given line
          some cells may be known, having an inital state that seeds the puzzles beginnings.
          Within a Line any KNOWN cells eliminate their known values from all neighbor Cells
          attributed the the requirement that all cells in a Line must be unique.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>

.line-demo {
  border: 1px solid #d6dde8;
  border-radius: 0.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f2f6fb 100%);
  padding: 0.9rem;
  overflow-x: auto;
}

.line-grid {
  display: grid;
  grid-template-columns: repeat(9, minmax(2.8rem, 1fr));
  min-width: 30rem;
  gap: 0.2rem;
  margin-bottom: 0.7rem;
}

.line-cell {
  aspect-ratio: 1 / 1;
  min-height: 3.25rem;
  border: 1px dotted #8ea5bf;
  border-radius: 0.35rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #1e3550;
}

.line-cell-known {
  background: #eef5fd;
  border-color: #8ea5bf;
}

.cell-known {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3550;
  line-height: 1;
}

.cell-candidates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(0, 1fr));
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  font-size: 0.9rem;
  line-height: 1;
  color: #3f5a79;
}

.cell-candidate {
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

.cell-candidate-hidden {
  opacity: 0;
}

.line-demo-note {
  font-size: 0.88rem;
  color: #3e5168;
}

@media (max-width: 992px) {
  .line-cell {
    min-height: 2.85rem;
  }

  .cell-known {
    font-size: 1.1rem;
  }

  .cell-candidates-grid {
    font-size: 0.62rem;
  }
}

</style>

// vim: expandtab tabstop=2 number
// END
