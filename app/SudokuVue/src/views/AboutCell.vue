// AboutCell.vue

<script>

//port { CellPoint          } from '../js/model/CellPoint.ts'
import { CellIdentification } from '../js/model/CellIdentification.ts'
import { CellValue          } from '../js/model/CellValue.ts'
import { CellModel          } from '../js/model/CellModel.ts'

// console.log(CellIdentification.factory)
// console.log(CellIdentification.factory(0,0))
// console.log(new CellIdentification('N/A', new CellPoint(2,5)))

export default {

  // components: {},

  data: () => ({
    single_cell: new CellModel(CellIdentification.factory(0,0)), // the Cell Model
    cell_value: '-',              // the cell value (visibility)
    cell_status: ''
  }),

  methods: {
    update_status ()
    {
      this.cell_status = this.single_cell.isKnown()
        ? 'is-known' : ( 'is-unknown, having ' + ( this.single_cell.toArray().length ) + ' choices' )
    },

    // RESET
    cell_reset () { this.cell_is(this.single_cell.reset().toArray()); this.update_status() },

    // SET .is()
    cell_is: function ( _value )
    {
      if ( Array.isArray( _value ))
      {
        this.cell_value = _value
        return
      }

      const cell = this.single_cell

      if ( cell.is( _value ))
      {
        this.cell_value = cell.isKnown() ? cell.value() : cell.toArray()

        this.update_status()
        this.makeToast( 'IS: "' + this.cell_value + '"', false )
      }
    },

    cell_one:   function () { this.cell_is( CellValue.ONE   )},
    cell_two:   function () { this.cell_is( CellValue.TWO   )},
    cell_three: function () { this.cell_is( CellValue.THREE )},
    cell_four:  function () { this.cell_is( CellValue.FOUR  )},
    cell_five:  function () { this.cell_is( CellValue.FIVE  )},
    cell_six:   function () { this.cell_is( CellValue.SIX   )},
    cell_seven: function () { this.cell_is( CellValue.SEVEN )},
    cell_eight: function () { this.cell_is( CellValue.EIGHT )},
    cell_nine:  function () { this.cell_is( CellValue.NINE  )},

    // EXCLUDE .exclude()
    cell_exclude ( _value )
    {
      const cell = this.single_cell

      if (cell.exclude(_value))
      {
        this.cell_is(cell.isKnown() ? cell.value() : cell.toArray())
        this.makeToast( 'Cell: ' + cell.coord() + ' Exclude: "' + _value.value() + '"', false)
        this.update_status()
      }
    },

    cell_ex_one:   function () { this.cell_exclude( CellValue.ONE   )},
    cell_ex_two:   function () { this.cell_exclude( CellValue.TWO   )},
    cell_ex_three: function () { this.cell_exclude( CellValue.THREE )},
    cell_ex_four:  function () { this.cell_exclude( CellValue.FOUR  )},
    cell_ex_five:  function () { this.cell_exclude( CellValue.FIVE  )},
    cell_ex_six:   function () { this.cell_exclude( CellValue.SIX   )},
    cell_ex_seven: function () { this.cell_exclude( CellValue.SEVEN )},
    cell_ex_eight: function () { this.cell_exclude( CellValue.EIGHT )},
    cell_ex_nine:  function () { this.cell_exclude( CellValue.NINE  )},

    makeToast (message, append = false) {
        console.log( message );
        this.$bvToast.toast( message, {
          title: 'Cell Change?',
          variant: 'warning',
          autoHideDelay: 5000,
          appendToast: append
        })
      }
  },

  mounted: function () {
    this.cell_reset()
//console.log(this.single_cell)
  }

}

</script>

<template>
  <div>

    <b-card class="m-2"
      header="Anotomy of the Sudoku Single Cell Organism"
      header-tag="h5"
      header-bg-variant="light"
      header-text-variant="secondary"
     >

      <b-button variant="warning" class="m-1" v-b-modal.a-cell-story>Tell a "Cell" story</b-button>

      <div class="p-2 text-primary">
        <h5>A Sudoku Cell:
          <span class="text-secondary h6">({{ cell_status }})</span>
        </h5>
        <div class="h1">
          <b-badge pill class="bg-danger" id="single-cell">{{ cell_value }}</b-badge>
        </div>
      </div>

      <div class="p-2 text-primary">
        <h5>Exclude: <b-icon-megaphone id="label-cell-exclude" /></h5>
        <b-tooltip target="label-cell-exclude" triggers="hover" right>
          Many Sudoku logic strategies involve eliminating values until only one
          is remaining. I.E. possibilities are "excluded" until we know what a Cell "IS".
          The exclude(N) method is used to exclude one of the possiblities.
        </b-tooltip>
        <b-button class="m-1" pill v-on:click="cell_ex_one">One</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_two">Two</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_three">Three</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_four">Four</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_five">Five</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_six">Six</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_seven">Seven</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_eight">Eight</b-button>
        <b-button class="m-1" pill v-on:click="cell_ex_nine">Nine</b-button>
      </div>

      <div class="p-2 text-primary">
        <h5>Set: <b-icon-megaphone id="label-cell-set" /></h5>
        <b-tooltip target="label-cell-set" triggers="hover">
          A cell is "SET" to a value thereby changing it's state to KNOWN.
          Once set it cannot be changed as there are no other possibilities.
          The only valid values are those that haven't been excluded.
          The is(N) method sets the Cell to the KNOWN state of N.
        </b-tooltip>
        <b-button class="m-1" pill v-on:click="cell_one">One</b-button>
        <b-button class="m-1" pill v-on:click="cell_two">Two</b-button>
        <b-button class="m-1" pill v-on:click="cell_three">Three</b-button>
        <b-button class="m-1" pill v-on:click="cell_four">Four</b-button>
        <b-button class="m-1" pill v-on:click="cell_five">Five</b-button>
        <b-button class="m-1" pill v-on:click="cell_six">Six</b-button>
        <b-button class="m-1" pill v-on:click="cell_seven">Seven</b-button>
        <b-button class="m-1" pill v-on:click="cell_eight">Eight</b-button>
        <b-button class="m-1" pill v-on:click="cell_nine">Nine</b-button>
      </div>

      <div class="p-2 text-primary"><h5>Reset: <b-icon-megaphone id="label-cell-reset" /></h5>
        <b-button class="m-1" pill v-on:click="cell_reset">Reset</b-button>
        <b-tooltip target="label-cell-reset" triggers="hover">
          A cell is reset to its initial state using its reset() method.
        </b-tooltip>
      </div>

    </b-card>

    <b-modal ok-only hide-header-close
            id="a-cell-story"
         title="A single Cell Story"
        header-bg-variant="primary"
      header-text-variant="white"
     >
      <p>
        The lowly Sudoku Cell makes up the smallest element of the Sudoku game board.
        The board is composed of eighty-one (81) Cell's arranged in GRID of Nine
        (9) Cells wide and Nine (9) Cells tall.
        Alone, the Cell has two states, KNOWN and UNKNOWN.
      </p>
      <p>
      <strong>UNKNOWN</strong> - A Cell begins in the STATE of unknown, having 9 possible values.
        While any nine (9) symbols may be used, the traditional Sudoku puzzle
        employes the digits one (1) through nine (9) and when in the 
        cell is UNKWOWN it is represented using a alternate value of a empty-space
        being VOID of a value.
      </p>
      <p>
      <strong>KNOWN</strong> - A Cell is "KNOWN" when it takes on one of the nine (9) values
        integer values. {{ [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }}
      </p>
    </b-modal>

  </div>
</template>

<style scoped>

</style>

// vim: expandtab tabstop=2 number
// END
