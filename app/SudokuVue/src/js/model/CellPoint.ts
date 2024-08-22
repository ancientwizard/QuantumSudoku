// Sudoku Cell Point

enum CELLNAMES { 'X', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' }

export
class CellPoint {

  #x: integer
  #y: integer

  constructor ( x: integer, y: integer )
  {
    if ( x > 9 || x < 0 || y > 9 || y < 0 )
      throw new Error("Invalid Sudoku location [ ${x}, ${y} ]")
    if ( x == 0 && y != 0 || y == 0 && x != 0 )
      throw new Error("Invalid Sudoku null-location [ ${x}, ${y} ]")

    this.#x = x
    this.#y = y
  }

  get x      () { return this.#x }
  get y      () { return this.#y }
  get column () { return this.#x }
  get row    () { return this.#y }
  get name   () { return CELLNAMES[this.#x] + this.#y }
  get coord  () { return 'r' + this.#x + 'c' + this.#y }
}

// vim: expandtab number tabstop=2 shiftwidth=4
// END
