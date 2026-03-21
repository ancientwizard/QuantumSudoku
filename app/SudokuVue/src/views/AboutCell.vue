// AboutCell.vue

<script lang="ts">

import { CellValue } from '@/js/model/CellValue'
import { CellModel } from '@/js/model/CellModel'

export default {

  data: () => ({
    single_cell: CellModel.factory(0, 0),
    cell_value: '-',
    cell_status: '',
    show_story: false,
    notice: {
      message: '',
      variant: 'warning'
    }
  }),

  methods: {
    onCardAuxClick (event: MouseEvent) {
      if (event.button === 1) {
        event.preventDefault()
        this.cell_reset()
        this.showNotice('Cell: ' + this.single_cell.coord + ' reset using M2.', 'info')
      }
    },

    onCardContextMenu (event: MouseEvent) {
      event.preventDefault()
      this.cell_reset()
      this.showNotice('Cell: ' + this.single_cell.coord + ' reset using M2.', 'info')
    },

    onGlobalKeydown (event: KeyboardEvent) {
      if (this.show_story && event.key === 'Escape') {
        this.closeStory()
      }
    },

    update_status () {
      this.cell_status = this.single_cell.isKnown
        ? 'known (value ' + this.single_cell.value + ')'
        : 'unknown, having ' + this.single_cell.as_candidate_array.length + ' choices'
    },

    cell_reset () {
      this.cell_is(this.single_cell.reset().as_label_array)
      this.update_status()
    },

    cell_is (_value) {
      if (Array.isArray(_value)) {
        this.cell_value = _value
        this.update_status()
        return
      }

      const cell = this.single_cell

      if (cell.is(_value)) {
        this.cell_value = cell.isKnown ? cell.value : cell.as_label_array
        this.update_status()
        this.showNotice('IS: "' + this.cell_value + '"')
      }
    },

    cell_one    () { this.cell_is(CellValue.ONE)   },
    cell_two    () { this.cell_is(CellValue.TWO)   },
    cell_three  () { this.cell_is(CellValue.THREE) },
    cell_four   () { this.cell_is(CellValue.FOUR)  },
    cell_five   () { this.cell_is(CellValue.FIVE)  },
    cell_six    () { this.cell_is(CellValue.SIX)   },
    cell_seven  () { this.cell_is(CellValue.SEVEN) },
    cell_eight  () { this.cell_is(CellValue.EIGHT) },
    cell_nine   () { this.cell_is(CellValue.NINE)  },

    cell_exclude (_value) {
      const cell = this.single_cell

      if (cell.exclude(_value)) {
        this.cell_is(cell.isKnown ? cell.value : cell.as_label_array)
        this.showNotice('Cell: ' + cell.coord + ' Exclude: "' + _value.value + '"')
        this.update_status()
        return
      }

      if (cell.isKnown) {
        this.showNotice('Cell: ' + cell.coord + ' is known (' + cell.value + '). Reset to exclude candidates.', 'info')
        return
      }

      if (cell.includes(_value) && cell.length === 1) {
        this.showNotice('Cell: ' + cell.coord + ' cannot exclude "' + _value.value + '" because it is the last remaining candidate.', 'info')
        return
      }

      this.showNotice('Cell: ' + cell.coord + ' already excludes "' + _value.value + '".', 'info')
    },

    cell_ex_one () { this.cell_exclude(CellValue.ONE) },
    cell_ex_two () { this.cell_exclude(CellValue.TWO) },
    cell_ex_three () { this.cell_exclude(CellValue.THREE) },
    cell_ex_four () { this.cell_exclude(CellValue.FOUR) },
    cell_ex_five () { this.cell_exclude(CellValue.FIVE) },
    cell_ex_six () { this.cell_exclude(CellValue.SIX) },
    cell_ex_seven () { this.cell_exclude(CellValue.SEVEN) },
    cell_ex_eight () { this.cell_exclude(CellValue.EIGHT) },
    cell_ex_nine () { this.cell_exclude(CellValue.NINE) },

    showNotice (message, variant = 'warning') {
      console.log(message)
      this.notice = { message, variant }
    },

    clearNotice () {
      this.notice = { message: '', variant: 'warning' }
    },

    openStory () {
      this.show_story = true
    },

    closeStory () {
      this.show_story = false
    },

    goToNext () {
      this.$router.push({ name: 'unit' })
    }
  },

  mounted () {
    window.addEventListener('keydown', this.onGlobalKeydown)
    this.cell_reset()
  },

  beforeUnmount () {
    window.removeEventListener('keydown', this.onGlobalKeydown)
  }

}

</script>

<template>
  <div>
    <section
      class="card m-2 border-secondary-subtle shadow-sm"
      @auxclick="onCardAuxClick"
      @contextmenu="onCardContextMenu"
      @mousedown.middle.prevent
    >
      <div class="card-header bg-light text-secondary d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Anotomy of the Sudoku Single Cell Organism</h5>
        <button type="button" class="btn btn-primary btn-sm" @click="goToNext">Next: Unit →</button>
      </div>
      <div class="card-body">
        <button
          type="button"
          class="btn btn-warning btn-sm px-3 py-1 m-1 shadow-sm"
          @click="openStory"
        >
          Tell a "Cell" Story
        </button>

        <div class="p-2 text-primary">
          <h5>A Sudoku Cell:
            <span class="text-secondary h6">({{ cell_status }})</span>
          </h5>

          <div class="h1">
            <span class="badge rounded-pill text-bg-danger" id="single-cell">{{ cell_value }}</span>
          </div>

          <div v-if="notice.message" :class="['alert', 'alert-' + notice.variant, 'alert-dismissible', 'fade', 'show']" role="alert">
            {{ notice.message }}
            <button type="button" class="btn-close" aria-label="Close" @click="clearNotice"></button>
          </div>
        </div>

        <div class="p-2 text-primary">
          <h5 class="d-flex align-items-center gap-2">
            <span>Exclude:</span>
            <span class="badge text-bg-secondary" title="Many Sudoku logic strategies involve eliminating values until only one is remaining. The exclude(N) method removes one of the possibilities.">Info</span>
          </h5>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_one">One</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_two">Two</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_three">Three</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_four">Four</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_five">Five</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_six">Six</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_seven">Seven</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_eight">Eight</button>
          <button type="button" class="btn btn-outline-primary rounded-pill m-1" @click="cell_ex_nine">Nine</button>
        </div>

        <div class="p-2 text-primary">
          <h5 class="d-flex align-items-center gap-2">
            <span>Set:</span>
            <span class="badge text-bg-secondary" title="A cell is set to a value, changing its state to known. The is(N) method sets the Cell to the known state of N when that value has not been excluded.">Info</span>
          </h5>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_one">One</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_two">Two</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_three">Three</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_four">Four</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_five">Five</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_six">Six</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_seven">Seven</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_eight">Eight</button>
          <button type="button" class="btn btn-primary rounded-pill m-1" @click="cell_nine">Nine</button>
        </div>

        <div class="p-2 text-primary">
          <h5 class="d-flex align-items-center gap-2">
            <span>Reset:</span>
            <span class="badge text-bg-secondary" title="A cell is reset to its initial state using its reset() method.">Info</span>
          </h5>
          <button type="button" class="btn btn-secondary rounded-pill m-1" @click="cell_reset">Reset</button>
        </div>
      </div>
    </section>

    <div
      v-if="show_story"
      class="modal fade show d-block"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
      @click.self="closeStory"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">A single Cell Story</h5>
            <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="closeStory"></button>
          </div>
          <div class="modal-body">
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
              integer values. {{ [1, 2, 3, 4, 5, 6, 7, 8, 9] }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeStory">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show_story" class="modal-backdrop fade show" @click="closeStory"></div>
  </div>
</template>

// vim: expandtab tabstop=2 number
// END
