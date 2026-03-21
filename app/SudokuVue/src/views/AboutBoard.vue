// AboutBoard.vue

<script lang="ts">

export default {
  methods: {
    goToPlay() {
      this.$router.push({ name: 'play' })
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
      <div class="card-body">
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
        <p>
          The puzzle is typically seeded with a small number of known cells (the "givens" or "clues"). The challenge is to fill the remaining empty cells
          such that every row, column, and block contains all nine values (1-9) exactly once.
        </p>

        <div class="mt-3 p-3 bg-light border rounded">
          <strong>The Board's Story:</strong>
          <p className="mt-2 mb-0">
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

</style>

// vim: expandtab tabstop=2 number
// END
