// AboutBlock.vue

<script lang="ts">

export default {
  methods: {
    goToNext() {
      this.$router.push({ name: 'board' })
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
              <p className="mt-2 mb-0">
                The introduction of the Block constraint transformed Sudoku from a simple Latin square puzzle into a genuinely challenging logical exercise.
                Where rows and columns alone could be solved through 1-dimensional reasoning, blocks force solvers to reason about spatial regions,
                creating complex interactions that demand multiple solving strategies working in tandem.
              </p>
            </div>
          </div>

          <div class="col-5">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Top<br/>Left<br/>(3x3 cells)
              </div>
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Top<br/>Middle<br/>(3x3 cells)
              </div>
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Top<br/>Right<br/>(3x3 cells)
              </div>

              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Middle<br/>Left<br/>(3x3 cells)
              </div>
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Middle<br/>Middle<br/>(3x3 cells)
              </div>
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Middle<br/>Right<br/>(3x3 cells)
              </div>

              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Bottom<br/>Left<br/>(3x3 cells)
              </div>
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Bottom<br/>Middle<br/>(3x3 cells)
              </div>
              <div class="border rounded p-3 bg-secondary text-white text-center" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500;">
                Bottom<br/>Right<br/>(3x3 cells)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>

// vim: expandtab tabstop=2 number
// END
