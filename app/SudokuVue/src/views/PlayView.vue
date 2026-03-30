<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { BoardMode, BoardModel } from '@/js/model/BoardModel'
import { CellIndex } from '@/js/model/CellIndex'
import { CellValue } from '@/js/model/CellValue'
import { StrategyUnique } from '@/js/strategy/StrategyUnique'
import { StrategyHiddenPair } from '@/js/strategy/StrategyHiddenPair'
import { StrategyHiddenTriple } from '@/js/strategy/StrategyHiddenTriple'
import { StrategyNakedPair } from '@/js/strategy/StrategyNakedPair'
import { StrategyNakedTriple } from '@/js/strategy/StrategyNakedTriple'
import { StrategyNakedQuad } from '@/js/strategy/StrategyNakedQuad'
import { StrategyHiddenQuad } from '@/js/strategy/StrategyHiddenQuad'
import { StrategyBoxLine } from '@/js/strategy/StrategyBoxLine'
import { StrategyPointingLine } from '@/js/strategy/StrategyPointingLine'
import { StrategyYWing } from '@/js/strategy/StrategyYWing'
import { StrategyWWing } from '@/js/strategy/StrategyWWing'
import { StrategyXYChain } from '@/js/strategy/StrategyXYChain'
import { StrategySimpleColoring } from '@/js/strategy/StrategySimpleColoring'
import { StrategyRemotePair } from '@/js/strategy/StrategyRemotePair'
import { StrategyXWing } from '@/js/strategy/StrategyXWing'
import { StrategySwordfish } from '@/js/strategy/StrategySwordfish'
import { StrategyLogger } from '@/js/strategy/StrategyLogger'
import type { iStrategyUnit } from '@/js/interface/iStrategyUnit'
import type { iStrategyBoard } from '@/js/interface/iStrategyBoard'
import {
  PUZZLE_LIBRARY_FALLBACK,
  loadPuzzleLibraryFromIni,
  type PuzzleLibraryEntry
} from '@/js/util/puzzle-library'

type PlayCellModelRef = {
  isKnown: boolean
  as_candidate_array: Array<{ value: number }>
  is: (value: unknown) => boolean
  exclude: (value: unknown) => boolean
}

type HelpMode = 'no-help' | 'tell-neighbors'

type CellSnapshot = {
  row: number
  col: number
  value: number
  candidates: number[]
}

type BoardSnapshot = {
  cells: CellSnapshot[]
  helpMode: HelpMode
}

type UiCell = {
  row: number
  col: number
  key: string
  value: number
  given: boolean
  candidates: number[]
}

const stage = ref<'choose' | 'play'>('choose')
const puzzleLibrary = ref<PuzzleLibraryEntry[]>([])
const selectedPuzzleId = ref<string>('')
const loadingLibrary = ref<boolean>(true)
const libraryError = ref<string>('')
const chosenPuzzle = computed<PuzzleLibraryEntry | null>(() => {
  return puzzleLibrary.value.find((item) => item.id === selectedPuzzleId.value) ?? null
})

const helpMode = ref<HelpMode>('tell-neighbors')

const board = shallowRef<BoardModel | null>(null)
const uiCells = ref<UiCell[]>([])
const givens = ref<Set<string>>(new Set<string>())
const history = ref<BoardSnapshot[]>([])
const brokenCellKeys = ref<Set<string>>(new Set<string>())
const boardIsBroken = ref<boolean>(false)
const lastAction = ref<string>('none')

const canUndo = computed<boolean>(() => history.value.length > 1)
const canReset = computed<boolean>(() => history.value.length > 0)
const isSolveAssistMode = computed<boolean>(() => helpMode.value === 'tell-neighbors')
const boardModeLabel = computed<string>(() => {
  if (!board.value) return 'Not Loaded'
  return isSolveAssistMode.value ? 'Solve' : 'Play'
})

watch(helpMode, (mode) => {
  const currentBoard = board.value
  if (!currentBoard) return
  if (mode === 'tell-neighbors') currentBoard.toSolveMode()
  else currentBoard.toPlayMode()
})

onMounted(async () => {
  loadingLibrary.value = true
  libraryError.value = ''

  try {
    let loaded: PuzzleLibraryEntry[] = []

    try {
      loaded = await loadPuzzleLibraryFromIni('/puzzles/test-map-1.sudoku')
    } catch {
      loaded = await loadPuzzleLibraryFromIni('/puzzles/test-map-1.ini')
    }

    puzzleLibrary.value = loaded.length > 0 ? loaded : PUZZLE_LIBRARY_FALLBACK
  } catch {
    libraryError.value = 'Could not load puzzle library file, using starter list.'
    puzzleLibrary.value = PUZZLE_LIBRARY_FALLBACK
  }

  selectedPuzzleId.value = puzzleLibrary.value[0]?.id ?? ''
  loadingLibrary.value = false
})

function keyOf(row: number, col: number): string {
  return `${row}-${col}`
}

function mapIsValid(map: string): boolean {
  return /^\d{81}$/.test(map)
}

function takeSnapshot(): BoardSnapshot {
  const currentBoard = board.value
  if (!currentBoard) {
    return { cells: [], helpMode: helpMode.value }
  }

  const cells: CellSnapshot[] = []
  currentBoard.forEachRow((rowUnit) => {
    rowUnit.as_cell_array.forEach((cell) => {
      cells.push({
        row: cell.row,
        col: cell.col,
        value: cell.value,
        candidates: cell.as_candidate_array.map((candidate) => candidate.value)
      })
    })
  })

  return { cells, helpMode: helpMode.value }
}

function buildUiFromBoard(): void {
  const currentBoard = board.value
  if (!currentBoard) {
    uiCells.value = []
    brokenCellKeys.value = new Set<string>()
    boardIsBroken.value = false
    return
  }

  const nextCells: UiCell[] = []
  currentBoard.forEachRow((rowUnit) => {
    rowUnit.as_cell_array.forEach((cell) => {
      const key = keyOf(cell.row, cell.col)
      nextCells.push({
        row: cell.row,
        col: cell.col,
        key,
        value: cell.value,
        given: givens.value.has(key),
        candidates: cell.as_candidate_array.map((candidate) => candidate.value)
      })
    })
  })

  uiCells.value = nextCells
  recomputeBrokenState()
}

type PlayCellStateRef = {
  row: number
  col: number
  value: number
  isKnown: boolean
  as_candidate_array: Array<{ value: number }>
}

type PlayUnitRef = {
  isBroken: boolean
  as_cell_array: PlayCellStateRef[]
}

function collectDuplicateKnownConflicts(unit: PlayUnitRef, out: Set<string>): void {
  const byValue = new Map<number, PlayCellStateRef[]>()
  unit.as_cell_array.forEach((cell) => {
    if (!cell.isKnown || cell.value < 1 || cell.value > 9) return
    const existing = byValue.get(cell.value) ?? []
    existing.push(cell)
    byValue.set(cell.value, existing)
  })

  byValue.forEach((cellsForValue) => {
    if (cellsForValue.length <= 1) return
    cellsForValue.forEach((cell) => out.add(keyOf(cell.row, cell.col)))
  })
}

function recomputeBrokenState(): void {
  const currentBoard = board.value
  if (!currentBoard) {
    brokenCellKeys.value = new Set<string>()
    boardIsBroken.value = false
    return
  }

  const conflictKeys = new Set<string>()
  let broken = false

  const visitUnit = (unitUnknown: unknown): void => {
    const unit = unitUnknown as PlayUnitRef
    if (unit.isBroken) broken = true
    collectDuplicateKnownConflicts(unit, conflictKeys)
  }

  currentBoard.forEachRow((rowUnit) => visitUnit(rowUnit))
  currentBoard.forEachCol((colUnit) => visitUnit(colUnit))
  currentBoard.forEachBox((boxUnit) => visitUnit(boxUnit))

  brokenCellKeys.value = conflictKeys
  boardIsBroken.value = broken
}

function resolveCellValueFromModelCell(modelCell: PlayCellModelRef, value: number): unknown | null {
  return modelCell.as_candidate_array.find((cv) => cv.value === value) ?? null
}

function describeModelCell(modelCell: PlayCellModelRef | null): string {
  if (!modelCell) return 'missing'
  const candidates = modelCell.as_candidate_array.map((cv) => cv.value).join(',')
  return `known=${modelCell.isKnown} value=${(modelCell as { value?: number }).value ?? '?'} cands=[${candidates}]`
}

function getLiveModelCell(row: number, col: number): PlayCellModelRef | null {
  const currentBoard = board.value
  if (!currentBoard) return null

  let found: PlayCellModelRef | null = null
  currentBoard.forEachRow((rowUnit, rowIdx) => {
    if (rowIdx !== row - 1) return
    found = (rowUnit.as_cell_array[col - 1] as unknown as PlayCellModelRef) ?? null
  })

  return found
}

function applyNeighborExcludes(rowOneBased: number, colOneBased: number, value: CellValue): void {
  const currentBoard = board.value
  if (!currentBoard) return

  const rowIdx = rowOneBased - 1
  const colIdx = colOneBased - 1

  currentBoard.forEachRow((rowUnit, idx) => {
    if (idx !== rowIdx) return

    for (let c = 0; c < 9; c++) {
      if (c === colIdx) continue
      rowUnit.exclude(CellIndex.by(c), value)
    }
  })

  currentBoard.forEachCol((colUnit, idx) => {
    if (idx !== colIdx) return

    for (let r = 0; r < 9; r++) {
      if (r === rowIdx) continue
      colUnit.exclude(CellIndex.by(r), value)
    }
  })

  currentBoard.forEachBox((boxUnit) => {
    boxUnit.forEachCell((cell, boxCellIdx) => {
      const inSameBox =
        Math.floor((cell.row - 1) / 3) === Math.floor(rowIdx / 3) &&
        Math.floor((cell.col - 1) / 3) === Math.floor(colIdx / 3)
      const isTargetCell = cell.row === rowOneBased && cell.col === colOneBased

      if (!inSameBox || isTargetCell) return
      boxUnit.exclude(CellIndex.by(boxCellIdx), value)
    })
  })
}

function restoreFromSnapshot(snapshot: BoardSnapshot): void {
  if (!chosenPuzzle.value) return

  const mode = snapshot.helpMode === 'tell-neighbors' ? BoardMode.SOLVE : BoardMode.PLAY
  const nextBoard = new BoardModel(mode)
  board.value = nextBoard
  helpMode.value = snapshot.helpMode

  // Restore solved values first.
  snapshot.cells
    .filter((cell) => cell.value > 0)
    .forEach((cell) => {
      nextBoard.set(
        CellIndex.by(cell.col - 1),
        CellIndex.by(cell.row - 1),
        CellValue.by(cell.value)
      )
    })

  // Restore candidate excludes to reproduce exact user state.
  nextBoard.forEachRow((rowUnit) => {
    rowUnit.as_cell_array.forEach((cell, colIndex) => {
      const target = snapshot.cells.find((s) => s.row === cell.row && s.col === cell.col)
      if (!target || target.value > 0) return

      for (let value = 1; value <= 9; value++) {
        if (!target.candidates.includes(value)) {
          rowUnit.exclude(CellIndex.by(colIndex), CellValue.by(value))
        }
      }
    })
  })

  buildUiFromBoard()
}

function loadSelectedPuzzle(): void {
  if (loadingLibrary.value) return
  if (!chosenPuzzle.value || !mapIsValid(chosenPuzzle.value.map)) return

  const mode = helpMode.value === 'tell-neighbors' ? BoardMode.SOLVE : BoardMode.PLAY
  const nextBoard = new BoardModel(mode)
  const nextGivens = new Set<string>()
  const seededValues: Array<{ row: number, col: number, value: number }> = []

  board.value = nextBoard
  givens.value = nextGivens
  stage.value = 'play'

  const map = chosenPuzzle.value.map
  for (let i = 0; i < map.length; i++) {
    const raw = Number.parseInt(map[i], 10)
    if (Number.isNaN(raw) || raw === 0) continue

    const row = Math.floor(i / 9) + 1
    const col = (i % 9) + 1
    nextBoard.set(CellIndex.by(col - 1), CellIndex.by(row - 1), CellValue.by(raw))
    nextGivens.add(keyOf(row, col))
    seededValues.push({ row, col, value: raw })
  }

  if (helpMode.value === 'tell-neighbors') {
    seededValues.forEach((entry) => {
      applyNeighborExcludes(entry.row, entry.col, CellValue.by(entry.value))
    })
  }

  buildUiFromBoard()

  history.value = [takeSnapshot()]
}

function placeValue(cell: UiCell, value: number): void {
  const currentBoard = board.value
  if (!currentBoard || cell.given) return
  if (boardIsBroken.value) {
    lastAction.value = 'blocked: board is broken; undo or choose puzzle'
    return
  }

  const modelCell = getLiveModelCell(cell.row, cell.col)
  if (!modelCell || modelCell.isKnown) {
    lastAction.value = `set r${cell.row}c${cell.col}=${value} changed=false (cell-known-or-missing ${describeModelCell(modelCell)})`
    return
  }

  const modelValue = resolveCellValueFromModelCell(modelCell, value)
  if (!modelValue) {
    lastAction.value = `set r${cell.row}c${cell.col}=${value} changed=false (candidate-missing ${describeModelCell(modelCell)})`
    return
  }

  // Direct model mutation avoids wrapper/index mismatch and keeps observer propagation.
  const changed = modelCell.is(modelValue)

  if (changed && helpMode.value === 'tell-neighbors') {
    applyNeighborExcludes(cell.row, cell.col, CellValue.by(value))
  }

  lastAction.value = `set r${cell.row}c${cell.col}=${value} changed=${changed} (${describeModelCell(modelCell)})`

  if (changed) {
    buildUiFromBoard()
    history.value.push(takeSnapshot())
  }
}

function excludeCandidate(cell: UiCell, value: number): void {
  const currentBoard = board.value
  if (!currentBoard || cell.given || cell.value > 0) return
  if (boardIsBroken.value) {
    lastAction.value = 'blocked: board is broken; undo or choose puzzle'
    return
  }

  const modelCell = getLiveModelCell(cell.row, cell.col)
  if (!modelCell || modelCell.isKnown) {
    lastAction.value = `exclude r${cell.row}c${cell.col}!=${value} changed=false (cell-known-or-missing ${describeModelCell(modelCell)})`
    return
  }

  const modelValue = resolveCellValueFromModelCell(modelCell, value)
  if (!modelValue) {
    lastAction.value = `exclude r${cell.row}c${cell.col}!=${value} changed=false (candidate-missing ${describeModelCell(modelCell)})`
    return
  }

  const changed = modelCell.exclude(modelValue)

  lastAction.value = `exclude r${cell.row}c${cell.col}!=${value} changed=${changed} (${describeModelCell(modelCell)})`

  if (changed) {
    buildUiFromBoard()
    history.value.push(takeSnapshot())
  }
}

function onCellCandidateLeftClick(cell: UiCell, value: number): void {
  if (cell.given || cell.value > 0) return
  placeValue(cell, value)
}

function onCellCandidateRightClick(cell: UiCell, value: number): void {
  if (cell.given || cell.value > 0) return
  excludeCandidate(cell, value)
}

function onBoardContextMenu(): void {
  if (!canUndo.value) return
  undoLast()
  lastAction.value = 'undo via M2'
}

function resetBoard(): void {
  if (history.value.length < 1) return
  const initial = history.value[0]
  restoreFromSnapshot(initial)
  history.value = [initial]
  lastAction.value = 'board reset'
}

function boardIsBrokenNow(): boolean {
  const currentBoard = board.value
  if (!currentBoard) return false

  let broken = false
  currentBoard.forEachRow((row) => (broken ||= row.isBroken))
  currentBoard.forEachCol((col) => (broken ||= col.isBroken))
  currentBoard.forEachBox((box) => (broken ||= box.isBroken))
  return broken
}

function createUnitStrategyChain(logger: StrategyLogger): iStrategyUnit {
  const unitStrategies: Array<iStrategyUnit> = [
    new StrategyUnique(logger),
    new StrategyNakedPair(logger),
    new StrategyHiddenPair(logger),
    new StrategyNakedTriple(logger),
    new StrategyHiddenTriple(logger),
    new StrategyNakedQuad(logger),
    new StrategyHiddenQuad(logger)
  ]

  unitStrategies.reduce((prev, curr) => prev.setNext(curr))
  return unitStrategies[0]
}

function createBoardStrategyChain(logger: StrategyLogger): iStrategyBoard {
  const boardStrategies: Array<iStrategyBoard> = [
    new StrategyBoxLine(logger),
    new StrategyPointingLine(logger),
    new StrategyYWing(logger),
    new StrategyWWing(logger),
    new StrategyXYChain(logger),
    new StrategySimpleColoring(logger),
    new StrategyRemotePair(logger),
    new StrategyXWing(logger),
    new StrategySwordfish(logger)
  ]

  boardStrategies.reduce((prev, curr) => prev.setNext(curr))
  return boardStrategies[0]
}

function solveWithStrategies(): void {
  const currentBoard = board.value
  if (!currentBoard) return
  if (!isSolveAssistMode.value) return

  const logger = new StrategyLogger()
  const unitSolver = createUnitStrategyChain(logger)
  const boardSolver = createBoardStrategyChain(logger)

  let iterations = 0
  let anyChanged = false

  for (let attempt = 0; attempt < 50; attempt++) {
    iterations = attempt + 1
    let changed = false

    currentBoard.forEachRow((row) => {
      const rowChanged = unitSolver.apply(row)
      changed = rowChanged || changed
    })
    currentBoard.forEachCol((col) => {
      const colChanged = unitSolver.apply(col)
      changed = colChanged || changed
    })
    currentBoard.forEachBox((box) => {
      const boxChanged = unitSolver.apply(box)
      changed = boxChanged || changed
    })

    const boardChanged = boardSolver.apply(currentBoard)
    changed = boardChanged || changed

    anyChanged ||= changed

    if (currentBoard.isSolved || boardIsBrokenNow() || !changed) break
  }

  buildUiFromBoard()
  history.value.push(takeSnapshot())

  console.group('[Sudoku] Solve run')
  console.log('mode:', boardModeLabel.value)
  console.log('iterations:', iterations)
  console.log('changed:', anyChanged)
  console.log('solved:', currentBoard.isSolved)
  console.log('broken:', boardIsBrokenNow())
  console.log('strategy logs:')
  logger.as_array.forEach((line) => console.log(line))
  console.groupEnd()

  lastAction.value = `solve run complete changed=${anyChanged} solved=${currentBoard.isSolved}`
}

function undoLast(): void {
  if (history.value.length <= 1) return

  history.value.pop()
  const previous = history.value[history.value.length - 1]
  restoreFromSnapshot(previous)
}

function restartChooser(): void {
  stage.value = 'choose'
  board.value = null
  uiCells.value = []
  givens.value = new Set<string>()
  history.value = []
  brokenCellKeys.value = new Set<string>()
  boardIsBroken.value = false
}

function cellClass(cell: UiCell): Record<string, boolean> {
  const rowIndex = cell.row - 1
  const colIndex = cell.col - 1

  return {
    given: cell.given,
    broken: brokenCellKeys.value.has(cell.key),
    'block-right': colIndex % 3 === 2 && colIndex !== 8,
    'block-bottom': rowIndex % 3 === 2 && rowIndex !== 8
  }
}
</script>

<template>
  <main class="play-view">
    <section v-if="stage === 'choose'" class="chooser card-shell">
      <h2>Play Sudoku</h2>
      <p class="muted">Pick a puzzle from the library file and press Go.</p>
      <p v-if="loadingLibrary" class="muted">Loading library...</p>
      <p v-if="libraryError" class="warn">{{ libraryError }}</p>

      <div class="field-row">
        <label for="puzzle-chooser">Puzzle Library</label>
        <select id="puzzle-chooser" v-model="selectedPuzzleId" class="select" :disabled="loadingLibrary || puzzleLibrary.length === 0">
          <option v-for="entry in puzzleLibrary" :key="entry.id" :value="entry.id">
            {{ entry.page }} ({{ entry.difficulty }})
          </option>
        </select>
      </div>

      <button type="button" class="go-button" :disabled="loadingLibrary || !selectedPuzzleId" @click="loadSelectedPuzzle">Go</button>
    </section>

    <section v-else class="play-shell card-shell">
      <div class="row g-3 align-items-start">
        <div class="col-12 col-lg-9 col-xl-9">
          <div class="board-wrap" role="grid" aria-label="Sudoku board" @contextmenu.prevent="onBoardContextMenu">
          <div
            v-for="cell in uiCells"
            :key="cell.key"
            class="board-cell"
            :class="cellClass(cell)"
            role="gridcell"
          >
            <span v-if="cell.value > 0" class="value">{{ cell.value }}</span>
            <div v-else class="candidates">
              <template
                v-for="n in 9"
                :key="`${cell.key}-cand-${n}`"
              >
                <button
                  v-if="cell.candidates.includes(n)"
                  type="button"
                  class="candidate candidate-live"
                  tabindex="-1"
                  @click.prevent.stop="onCellCandidateLeftClick(cell, n)"
                  @contextmenu.prevent.stop="onCellCandidateRightClick(cell, n)"
                >
                  {{ n }}
                </button>
                <span v-else class="candidate candidate-empty"></span>
              </template>
            </div>
          </div>
          </div>
        </div>

        <aside class="col-12 col-lg-3 col-xl-3 side-panel">
          <h2>{{ chosenPuzzle?.source }}{{ chosenPuzzle?.page || '' }}</h2>
          <p class="muted">Mode: {{ boardModeLabel }}</p>
          <p v-if="boardIsBroken" class="warn">Broken: conflicting values detected. Undo or choose puzzle.</p>

<!--      <p class="muted">Last: {{ lastAction }}</p> -->

          <div class="header-actions d-grid gap-2">
            <label class="help-mode" for="help-mode">Assist</label>
            <select id="help-mode" v-model="helpMode" class="assist-select">
              <option value="no-help">No Help (PLAY)</option>
              <option value="tell-neighbors">Provide Housekeeping (SOLVE)</option>
            </select>
            <button v-if="isSolveAssistMode" type="button" class="solve-button" @click="solveWithStrategies">Solve</button>
            <button type="button" class="undo-button" :disabled="!canUndo" @click="undoLast">Undo</button>
            <button type="button" class="reset-button" :disabled="!canReset" @click="resetBoard">Reset</button>
            <button type="button" class="back-button" @click="restartChooser">Choose Puzzle</button>
          </div>
        </aside>
      </div>

    </section>
  </main>
</template>

<style scoped>
.play-view {
  margin: 1rem;
}

.card-shell {
  border: 1px solid #d7dee7;
  border-radius: 12px;
  background: #f8fbff;
  padding: 1rem;
}

h2 {
  margin: 0;
}

.muted {
  margin-top: 0.25rem;
  color: #4a5d75;
}

.warn {
  color: #8a3a1f;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 1rem 0;
}

.select,
.assist-select {
  height: 2.2rem;
  border-radius: 8px;
  border: 1px solid #b8c9dc;
  background: #fff;
  padding: 0 0.6rem;
}

.go-button,
.solve-button,
.undo-button,
.reset-button,
.back-button {
  border: 1px solid #23436b;
  background: #1e4f86;
  color: #fff;
  border-radius: 8px;
  height: 2.2rem;
  padding: 0 0.85rem;
}

.undo-button:disabled {
  opacity: 0.5;
}

.side-panel {
  max-width: 420px;
}

.side-panel h2 {
  font-size: 1.15rem;
  line-height: 1.25;
  margin-bottom: 0.25rem;
}

.header-actions {
  margin-top: 0.5rem;
}

.help-mode {
  font-weight: 600;
  color: #2f435f;
}

.assist-select,
.solve-button,
.undo-button,
.reset-button,
.back-button {
  width: 100%;
}

.board-wrap {
  display: grid;
  grid-template-columns: repeat(9, minmax(2.4rem, 1fr));
  width: 100%;
  border: 2px solid #203653;
  background: #fff;
}

.board-cell {
  aspect-ratio: 1 / 1;
  border: 1px dotted #8ea5bf;
  background: #fff;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1e3550;
}

.board-cell.given {
  background: #eef5fd;
  font-weight: 700;
  cursor: default;
}

.board-cell.broken {
  background: #e40a0a;
  color: #ffffff;
}

.board-cell.given.broken {
  background: #771616;
}

.board-cell.broken .value,
.board-cell.broken .candidates,
.board-cell.broken .candidate-live {
  color: #ffffff;
}

.board-cell.block-right {
  border-right: 3px solid #203653;
}

.board-cell.block-bottom {
  border-bottom: 3px solid #203653;
}

.value {
  font-size: 1.2rem;
  font-weight: 700;
}

.candidates {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(0, 1fr));
  width: 100%;
  height: 100%;
  font-size: 0.68rem;
  line-height: 1;
  color: #3f5a79;
}

.candidate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.candidate-live {
  border: 0;
  padding: 0;
  background: transparent;
  color: #3f5a79;
  cursor: pointer;
  user-select: none;
  font-size: inherit;
  line-height: 1;
}

.candidate-empty {
  visibility: hidden;
}

.candidate-empty::before {
  content: '0';
}

@media (max-width: 920px) {
  .side-panel {
    max-width: 100%;
  }
}
</style>
