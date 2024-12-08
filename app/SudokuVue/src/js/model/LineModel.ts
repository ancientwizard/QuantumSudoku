
//
// Sudoku Cell Line Model (a UnitModel)
//

import { UnitModel } from '@/js/model/UnitModel'
export
class LineModel extends UnitModel
{
  // What make this a Line?
  //   as a row or column; its name
  //   though in Java I didn't have row, column, block names
  //   The cell names are the helper for naming the Line
  //   A through I for columns and 1 through 9 for rows
  //   or other way round; I need to make up my mind and be consistent!!!
  //
  // So do I really need a LineModel? If it is just a UnitModel and adds no value!
  //
  // Verdict: I don't need a LineModel!

}

// vim: expandtab number tabstop=2 shiftwidth=2
// END