// AboutUnit.vue

<script lang="ts">

export default {
  methods: {
    goToNext() {
      this.$router.push({ name: 'line' })
    }
  }
}

</script>

<template>
  <div>
    <section class="card m-2 border-secondary-subtle shadow-sm">
      <div class="card-header bg-light text-secondary d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Anatomy of the Sudoku Unit</h5>
        <button type="button" class="btn btn-primary btn-sm" @click="goToNext">Next: Line →</button>
      </div>
      <div class="card-body">
        <p>
          A <strong>Unit</strong> is any logical grouping of nine (9) Cells that must contain all nine (9) distinct values (1-9).
          Units are the shared experience — the mutual behaviors and constraints that apply uniformly across all unit types,
          regardless of their organization.
        </p>
        <p>
          The Sudoku puzzle employs three primary unit types:
        </p>
        <ul>
          <li><strong>Rows</strong> — Horizontal Lines (cells aligned left-to-right)</li>
          <li><strong>Columns</strong> — Vertical Lines (cells aligned top-to-bottom)</li>
          <li><strong>Boxes</strong> — 3×3 regional groupings within the 9×9 board</li>
        </ul>
        <p>
          In extended Sudoku variants, additional units may include diagonals, which follow the same rules as rows, columns, and boxes but are constrained
          by different geometric relationships.
        </p>
        <p>
          What unifies all unit types is their core principle: <strong>uniqueness</strong>. Every cell in a unit must contain a different value,
          and every value (1-9) must appear exactly once in each unit. This shared constraint creates the logical foundation for all Sudoku solving strategies,
          whether applied to rows, columns, boxes, or any other unit type.
        </p>
        <p>
          Units interact with one another through shared cells. For example, a cell at position (3,3) belongs to exactly three units: a specific row,
          a specific column, and a specific 3×3 box. When a cell is assigned a value, that value is eliminated from all nine cells in each of the three units
          the cell belongs to.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>

// vim: expandtab tabstop=2 number
// END
