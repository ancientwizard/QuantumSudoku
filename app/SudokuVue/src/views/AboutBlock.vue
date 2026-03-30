// AboutBlock.vue

<script lang="ts">

import { BoxModel } from '@/js/model/BoxModel'
import { CellIndex } from '@/js/model/CellIndex'
import { CellModel } from '@/js/model/CellModel'
import { CellValue } from '@/js/model/CellValue'

type BlockCellView = {
  isKnown: boolean
  value: string
  candidates: Array<string>
}

export default {

  data: () => ({
    showStaticLabels: true,
    blockView: Array.from({ length: 9 }, () => ({
      isKnown: false,
      value: '',
      candidates: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    })) as Array<BlockCellView>,
    givenCount: 0,
    givenTarget: 5,
    staticPhaseMs: 2000,
    dynamicCycleMs: 5000,
    dynamicCycleCount: 2,
    completedDynamicCycles: 0,
    phaseTimer: null as ReturnType<typeof setTimeout> | null,
    dynamicCycleTimer: null as ReturnType<typeof setInterval> | null,
    stepTimer: null as ReturnType<typeof setInterval> | null,
    boxCells: null as Array<CellModel> | null,
    boxModel: null as BoxModel | null,
    pendingPositions: [] as Array<number>,
    pendingValues: [] as Array<CellValue>
  }),

  mounted () {
    this.startBlockPresentationLoop()
  },

  beforeUnmount () {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer)
      this.phaseTimer = null
    }

    if (this.dynamicCycleTimer) {
      clearInterval(this.dynamicCycleTimer)
      this.dynamicCycleTimer = null
    }

    if (this.stepTimer) {
      clearInterval(this.stepTimer)
      this.stepTimer = null
    }
  },

  methods: {
    goToNext() {
      this.$router.push({ name: 'board' })
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

    buildBlockView(cells: Array<CellModel>) {
      this.blockView = cells.map(cell => ({
        isKnown: cell.isKnown,
        value: cell.isKnown ? cell.cv.label : '',
        candidates: cell.as_label_array
      }))
    },

    startBlockPresentationLoop () {
      this.showStaticLabels = true

      if (this.dynamicCycleTimer) {
        clearInterval(this.dynamicCycleTimer)
        this.dynamicCycleTimer = null
      }

      if (this.stepTimer) {
        clearInterval(this.stepTimer)
        this.stepTimer = null
      }

      if (this.phaseTimer) {
        clearTimeout(this.phaseTimer)
        this.phaseTimer = null
      }

      this.phaseTimer = setTimeout(() => this.startDynamicPeriod(), this.staticPhaseMs)
    },

    startDynamicPeriod () {
      this.showStaticLabels = false
      this.completedDynamicCycles = 0
      this.startBlockDemoCycle()
      this.completedDynamicCycles += 1

      if (this.dynamicCycleTimer) {
        clearInterval(this.dynamicCycleTimer)
        this.dynamicCycleTimer = null
      }

      this.dynamicCycleTimer = setInterval(() => {
        if (this.completedDynamicCycles >= this.dynamicCycleCount) {
          clearInterval(this.dynamicCycleTimer as ReturnType<typeof setInterval>)
          this.dynamicCycleTimer = null
          this.startBlockPresentationLoop()
          return
        }

        this.startBlockDemoCycle()
        this.completedDynamicCycles += 1
      }, this.dynamicCycleMs)
    },

    startBlockDemoCycle () {
      const cells = Array.from({ length: 9 }, (_, index) => CellModel.factory(index + 1, 1, true))
      const box = new BoxModel(cells)
      box.reset()

      this.boxCells = cells
      this.boxModel = box
      this.pendingPositions = this.shuffleArray([...Array(9).keys()]).slice(0, this.givenTarget)
      this.pendingValues = this.shuffleArray(CellValue.arrayFactory).slice(0, this.givenTarget)
      this.givenCount = 0
      this.buildBlockView(cells)

      if (this.stepTimer) {
        clearInterval(this.stepTimer)
        this.stepTimer = null
      }

      this.stepTimer = setInterval(() => this.applyNextGiven(), 750)
    },

    applyNextGiven () {
      if (!this.boxModel || !this.boxCells) {
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
      this.boxModel.is(CellIndex.by(nextCellIndex), nextValue)
      this.givenCount += 1
      this.buildBlockView(this.boxCells)

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
        <h5 class="mb-0">Anatomy of the Sudoku Block</h5>
        <button type="button" class="btn btn-primary btn-sm" @click="goToNext">Next: Board →</button>
      </div>
      <div class="card-body">
        <p>
          The <strong>Block</strong> (also called a "Box" or "Region") is a 3×3 grouping of nine (9) Cells within the standard 9×9 Sudoku board.
          Together with Rows and Columns, Blocks form the three fundamental unit types that define the classic Sudoku puzzle structure.
        </p>
        <p>
          A traditional Sudoku board contains nine (9) Blocks arranged in a 3×3 grid.
        </p>
        <p>
          Like all units, each Block must contain all nine (9) values (1-9) exactly once. A cell must satisfy constraints across its containing row, column, <strong>and</strong> block simultaneously.
        </p>
        
        <div class="row">
          <div class="col-7">
            <div class="mt-3 p-3 bg-light border rounded">
              <strong>The Block's Story:</strong>
              <p class="mt-2 mb-0">
                The introduction of the Block constraint transformed Sudoku from a simple Latin square puzzle into a genuinely challenging logical exercise.
                Where rows and columns alone could be solved through 1-dimensional reasoning, blocks force solvers to reason about spatial regions,
                creating complex interactions that demand multiple solving strategies working in tandem.
              </p>
            </div>
          </div>

          <div class="col-5">
            <div class="block-visual-shell">
              <div v-if="showStaticLabels" class="block-label-grid">
                <div class="block-label-card">Top<br/>Left<br/>(3x3 cells)</div>
                <div class="block-label-card">Top<br/>Middle<br/>(3x3 cells)</div>
                <div class="block-label-card">Top<br/>Right<br/>(3x3 cells)</div>
                <div class="block-label-card">Middle<br/>Left<br/>(3x3 cells)</div>
                <div class="block-label-card">Middle<br/>Middle<br/>(3x3 cells)</div>
                <div class="block-label-card">Middle<br/>Right<br/>(3x3 cells)</div>
                <div class="block-label-card">Bottom<br/>Left<br/>(3x3 cells)</div>
                <div class="block-label-card">Bottom<br/>Middle<br/>(3x3 cells)</div>
                <div class="block-label-card">Bottom<br/>Right<br/>(3x3 cells)</div>
              </div>

              <div v-else class="block-demo" aria-live="polite">
                <div class="block-grid">
                  <div
                    v-for="(cell, index) in blockView"
                    :key="index"
                    class="block-cell"
                    :class="{ 'block-cell-known': cell.isKnown }"
                  >
                    <span v-if="cell.isKnown" class="block-cell-known-value">{{ cell.value }}</span>
                    <div v-else class="block-candidates-grid">
                      <span
                        v-for="digit in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
                        :key="digit"
                        class="block-candidate"
                        :class="{ 'block-candidate-hidden': !cell.candidates.includes(digit) }"
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
      </div>
    </section>
  </div>
</template>

<style scoped>

.block-visual-shell {
  width: 60%;
  margin: 0 auto;
}

.block-label-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.block-label-card {
  border: 1px solid #9baec3;
  border-radius: 0.35rem;
  padding: 0.75rem;
  background: #5d7087;
  color: #ffffff;
  text-align: center;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.2;
}

.block-demo {
  border: 1px solid #d6dde8;
  border-radius: 0.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f2f6fb 100%);
  padding: 0.7rem;
}

.block-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(3.4rem, 1fr));
  gap: 0.2rem;
}

.block-cell {
  aspect-ratio: 1 / 1;
  min-height: 3.4rem;
  border: 1px dotted #8ea5bf;
  border-radius: 0.35rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #1e3550;
}

.block-cell-known {
  background: #eef5fd;
  border-color: #8ea5bf;
}

.block-cell-known-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e3550;
  line-height: 1;
}

.block-candidates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(0, 1fr));
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  font-size: 0.95rem;
  line-height: 1;
  color: #3f5a79;
}

.block-candidate {
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

.block-candidate-hidden {
  opacity: 0;
}

@media (max-width: 992px) {
  .block-visual-shell {
    width: 75%;
  }

  .block-cell {
    min-height: 3rem;
  }

  .block-cell-known-value {
    font-size: 2.5rem;
  }

  .block-candidates-grid {
    font-size: 0.58rem;
  }
}

@media (max-width: 576px) {
  .block-visual-shell {
    width: 100%;
  }
}

</style>

// vim: expandtab tabstop=2 number
// END
