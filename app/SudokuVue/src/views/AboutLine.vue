// AboutLine.vue

<script>

//port   CellView     from './CellView.vue'
//port   LineView     from './LineView.vue'
import { CellValue  } from '../js/model/CellValue.ts'
import { LineModel  } from '../js/model/LineModel.ts'
//port { BoardModel } from '../js/model/BoardModel.ts'
//port   BoardView    from '../components/BoardView.vue'

export default {

//components: { BoardView },

  data: () => ({}),

  methods: {
    run_line_test () {
    //console.log( LineModel )
      const line = new LineModel()
      console.log( line.toArray() )
      console.log(line.set(7,CellValue.TWO))
    }
  }
}

</script>

<template>
  <div>

    <b-card
      header="Anotomy of the Sudoku multi Cell Organism"
      header-tag="h5"
      header-bg-variant='light'
      header-text-variant='secondary'
      title="The Line"
      title-tag="h5"
     >
      <b-button v-on:click="run_line_test">Run Test</b-button>
<!--  <board-view /> -->

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
    </b-card>
  </div>
</template>

<style scoped>

x-body {
  font-family: Arial, sans-serif;
  background-color: #F5FCFF;
}

.container {
display: flex;
flex-direction: column;
align-items: center;
margin-top: 50px;
}

.row {
display: flex;
}

.cell {
width: 30px;
height: 30px;
border: 1px solid black;
text-align: center;
line-height: 30px;
box-sizing: border-box;
}

.lightBackground {
background-color: #A9A9A9;
}

.darkBackground {
background-color: #EBF3E8;
}

.buttonContainer {
margin-top: 20px;
display: flex;
/* Ensure buttons are always displayed */
align-items: center;
justify-content: center;
}

.buttonContainer button {
margin-right: 10px;
/* Add margin between buttons */
}

.result {
margin-top: 20px;
font-weight: bold;
}

.correct {
color: green;
}

.incorrect {
color: red;
}

</style>

// vim: expandtab tabstop=2 number
// END
