// BoardView.vue

<script>

export default {

  // components: {},

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
  }),
	
}

</script>

<template>
<div>
	<h3>Sudoku Puzzle "Board"</h3>
  <b-button>Do you want to play a game?</b-button>

  <div class="x-body">
  <span class="container">
    <b-row v-for="(row,ri) in puzzle" :key="ri">
      <b-col v-for="(cval,ci) in row" :key="ci">
        <span class="cell">{{ cval }}</span>
      </b-col>
    </b-row>
  </span>
  </div>

<!--
	<div class="container" id="container"></div>

	<div class="buttonContainer">
		<b-button id="solveButton">Solve</b-button>
		<b-button id="resetButton">Reset</b-button>
	</div>
-->
</div>
</template>


<JUNK>
/*
		document.addEventListener("DOMContentLoaded", function () {
			const container = document.getElementById("container");

			// Function to generate a random Sudoku puzzle
			function generateRandomSudoku() {
				// Placeholder function for generating a random puzzle (9x9)
				const puzzle = [
					[5, 3, 0, 0, 7, 0, 0, 0, 0],
					[6, 0, 0, 1, 9, 5, 0, 0, 0],
					[0, 9, 8, 0, 0, 0, 0, 6, 0],
					[8, 0, 0, 0, 6, 0, 0, 0, 3],
					[4, 0, 0, 8, 0, 3, 0, 0, 1],
					[7, 0, 0, 0, 2, 0, 0, 0, 6],
					[0, 6, 0, 0, 0, 0, 2, 8, 0],
					[0, 0, 0, 4, 1, 9, 0, 0, 5],
					[0, 0, 0, 0, 8, 0, 0, 7, 9]
				];
				return puzzle;
			}

			// Function to solve the Sudoku puzzle
			function solveSudoku(board) {
				// Placeholder function for solving Sudoku puzzle
				const solvedPuzzle = JSON.parse(JSON.stringify(board));
				solveHelper(solvedPuzzle);
				return solvedPuzzle;
			}

			// Helper function for solving Sudoku recursively
			function solveHelper(board) {
				const emptyCell = findEmptyCell(board);
				if (!emptyCell) {
					return true; // Puzzle solved
				}

				const [row, col] = emptyCell;
				for (let num = 1; num <= 9; num++) {
					if (isValidMove(board, row, col, num)) {
						board[row][col] = num;
						if (solveHelper(board)) {
							return true;
						}
						board[row][col] = 0; // Backtrack
					}
				}
				return false; // No valid number found for this cell
			}

			// Function to find an empty cell in the Sudoku puzzle
			function findEmptyCell(board) {
				for (let row = 0; row < 9; row++) {
					for (let col = 0; col < 9; col++) {
						if (board[row][col] === 0) {
							return [row, col];
						}
					}
				}
				return null; // No empty cell found
			}

			// Function to check if a move is valid
			function isValidMove(board, row, col, num) {
				// Check row
				for (let i = 0; i < 9; i++) {
					if (board[row][i] === num) {
						return false;
					}
				}
				// Check column
				for (let i = 0; i < 9; i++) {
					if (board[i][col] === num) {
						return false;
					}
				}
				// Check 3x3 grid
				const startRow = Math.floor(row / 3) * 3;
				const startCol = Math.floor(col / 3) * 3;
				for (let i = startRow; i < startRow + 3; i++) {
					for (let j = startCol; j < startCol + 3; j++) {
						if (board[i][j] === num) {
							return false;
						}
					}
				}
				return true; // Move is valid
			}

			// Function to create the Sudoku puzzle grid
			function createSudokuGrid(puzzle) {
				container.innerHTML = '';
				puzzle.forEach((row, rowIndex) => {
					const rowElement = document.createElement('div');
					rowElement.classList.add('row');
					row.forEach((cell, columnIndex) => {
						const cellElement = document.createElement('input');
						cellElement.classList.add('cell');
						cellElement.classList
							.add((rowIndex + columnIndex) % 2 === 0 ?
								'lightBackground' : 'darkBackground');
						cellElement.type = 'text';
						cellElement.maxLength = 1;
						cellElement.value = cell !== 0 ? cell : '';
						rowElement.appendChild(cellElement);
					});
					container.appendChild(rowElement);
				});
			}

			// Initialize puzzle
			let initialPuzzle = generateRandomSudoku();
			let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
			let solvedPuzzle = [];

			// Function to solve the puzzle
			function solvePuzzle() {
				solvedPuzzle = solveSudoku(puzzle);
				createSudokuGrid(solvedPuzzle);
			}

			// Function to reset the puzzle
			function resetPuzzle() {
				initialPuzzle = generateRandomSudoku();
				puzzle = JSON.parse(JSON.stringify(initialPuzzle));
				solvedPuzzle = [];
				createSudokuGrid(puzzle);
			}

			// Initial puzzle creation
			createSudokuGrid(puzzle);

			// Attach event listeners to buttons
			document.getElementById("solveButton")
				.addEventListener("click", solvePuzzle);
			document.getElementById("resetButton")
				.addEventListener("click", resetPuzzle);
		});

*/
</JUNK>

<style scoped>

		.x-body {
      padding: 5px;
			x-font-family: Arial, sans-serif;
			background-color: #F5FCFF;
      font-size: 2.2em;
		}

		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
      border: 1px solid #c5c5c5;
      border-radius: 10px;
			margin-top: 40px;
			margin-bottom: 40px;
		}

		.row {
			display: flex;
      border-bottom: 1px solid black;
		}

		.cell {
			width: 30px;
			height: 30px;
			border: 1px solid transparent;
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
