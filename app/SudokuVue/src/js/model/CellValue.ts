// Sudoku Cell values

export
class CellValue
{

  static HIDDEN  = new CellValue(0,"?")
  static ONE     = new CellValue(1,"1")
  static TWO     = new CellValue(2,"2")
  static THREE   = new CellValue(3,"3")
  static FOUR    = new CellValue(4,"4")
  static FIVE    = new CellValue(5,"5")
  static SIX     = new CellValue(6,"6")
  static SEVEN   = new CellValue(7,"7")
  static EIGHT   = new CellValue(8,"8")
  static NINE    = new CellValue(9,"9")

  private value_int: number
  private value_str: string

  private constructor ( value: number, label: string )
  {
    this.value_int = value
    this.value_str = label
  }

  get value () : string { return this.value_str }

  static get arrayFactory () : Array<CellValue> {
    return [
          CellValue.ONE,   CellValue.TWO,   CellValue.THREE
        , CellValue.FOUR,  CellValue.FIVE,  CellValue.SIX
        , CellValue.SEVEN, CellValue.EIGHT, CellValue.NINE
      ]
  }
}

// vim: expandtab number tabstop=2 shiftwidth=4
// END
