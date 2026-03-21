// AboutLine.vue

<script lang="ts">

import { CellIndex } from '@/js/model/CellIndex'
import { CellModel } from '@/js/model/CellModel'
import { CellValue } from '@/js/model/CellValue'
import { LineModel } from '@/js/model/LineModel'

export default {

  data: () => ({}),


  methods: {
    goToNext() {
      this.$router.push({ name: 'block' })
    },

    run_line_test () {
      const cells = Array.from({ length: 9 }, (_, index) => CellModel.factory(index, 0))
      const line = new LineModel(cells)
      // Test passes silently; line is functional
    }
  }
}

</script>

<template>
  <div>
    <section class="card border-secondary-subtle shadow-sm">
      <div class="card-header bg-light text-secondary d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Anotomy of the Sudoku multi Cell Organism</h5>
        <button type="button" class="btn btn-primary btn-sm" @click="goToNext">Next: Block →</button>
      </div>
      <div class="card-body">
        <h5 class="card-title">The Line</h5>
        <button type="button" class="btn btn-outline-primary mb-3" v-on:click="run_line_test">Run Test</button>

        <p>
          The Sudoku "Line" is the simplest multi Cell relationship within the Sudoku puzzle board.
          There are eighteen (18) Lines wihin a traditional sudoku board, having nine (9) rows and
          nine (9) colums. The Line is formed by the relationship of a Cell having nine (9) neighbor Cells,
          above, below, left or right. This means that every Cell is a member of exactly two (2)
          "Lines", one virtical (a column) and one horizontal (a row).
        </p>
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

</style>

// vim: expandtab tabstop=2 number
// END
