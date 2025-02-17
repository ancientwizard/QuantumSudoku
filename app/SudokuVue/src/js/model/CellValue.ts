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

  private value_idx: number
  private value_int: number
  private value_str: string

  private constructor ( value: number, label: string )
  {
    this.value_idx = value - 1
    this.value_int = value
    this.value_str = label
  }

  get label () : string { return this.value_str }
  get value () : number { return this.value_int }
  get index () : number { return this.value_idx }

  static by ( index: number ) : CellValue
  {
    switch ( index )
    {
      case 0: return CellValue.HIDDEN
      case 1: return CellValue.ONE
      case 2: return CellValue.TWO
      case 3: return CellValue.THREE
      case 4: return CellValue.FOUR
      case 5: return CellValue.FIVE
      case 6: return CellValue.SIX
      case 7: return CellValue.SEVEN
      case 8: return CellValue.EIGHT
      case 9: return CellValue.NINE
      default:
        throw new Error(`Invalid cell value index ${index}`)
    }
  }

  static get arrayFactory () : Array<CellValue>
  {
    return [
          CellValue.ONE,   CellValue.TWO,   CellValue.THREE
        , CellValue.FOUR,  CellValue.FIVE,  CellValue.SIX
        , CellValue.SEVEN, CellValue.EIGHT, CellValue.NINE
      ]
  }
}


// vim: expandtab number tabstop=2 shiftwidth=2 softtabstop=2 fileformat=unix
// END
