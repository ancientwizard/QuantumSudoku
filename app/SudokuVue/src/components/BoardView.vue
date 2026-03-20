// BoardView.vue

<script lang="ts">

export default {

  data: () => ({
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
  })

}

</script>

<template>
  <div>
    <h3>Sudoku Puzzle "Board"</h3>
    <button type="button" class="btn btn-primary">Do you want to play a game?</button>

    <div class="x-body">
      <div class="board-container">
        <div v-for="(row, ri) in puzzle" :key="ri" class="board-row">
          <div v-for="(cval, ci) in row" :key="ci" class="board-cell-wrap">
            <span class="cell">{{ cval }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.x-body {
  padding: 5px;
  background-color: #f5fcff;
  font-size: 2.2em;
}

.board-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  margin-top: 40px;
  margin-bottom: 40px;
  overflow: hidden;
}

.board-row {
  display: flex;
}

.board-row + .board-row {
  border-top: 1px solid black;
}

.board-cell-wrap {
  display: inline-flex;
}

.cell {
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
}

</style>

// vim: expandtab tabstop=2 number
// END
