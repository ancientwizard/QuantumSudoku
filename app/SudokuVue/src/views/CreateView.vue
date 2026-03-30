<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { BoardMode, BoardModel } from '@/js/model/BoardModel'
import { CellIndex } from '@/js/model/CellIndex'
import { CellValue } from '@/js/model/CellValue'
import {
  parsePuzzleLibraryIniDocument,
  serializePuzzleLibraryIniText,
  type PuzzleLibraryEntry
} from '@/js/util/puzzle-library'

type CreateCellModelRef = {
  isKnown: boolean
  as_candidate_array: Array<{ value: number }>
  is: (value: unknown) => boolean
  exclude: (value: unknown) => boolean
}

type CellSnapshot = {
  row: number
  col: number
  value: number
  candidates: number[]
}

type BoardSnapshot = {
  cells: CellSnapshot[]
}

type UiCell = {
  row: number
  col: number
  key: string
  value: number
  candidates: number[]
}

type LibraryState = 'no-library' | 'library-clean' | 'library-dirty'
type PuzzleState = 'no-selection' | 'selected-unchanged' | 'selected-changed'

type FsWritableFileStreamRef = {
  write: (data: Blob | string) => Promise<void>
  close: () => Promise<void>
}

type FsFileHandleRef = {
  name: string
  getFile: () => Promise<File>
  createWritable: () => Promise<FsWritableFileStreamRef>
}

type FsPickerAcceptType = {
  description?: string
  accept: Record<string, string[]>
}

type FsOpenFilePickerOptions = {
  excludeAcceptAllOption?: boolean
  multiple?: boolean
  types?: FsPickerAcceptType[]
}

type FsSaveFilePickerOptions = {
  excludeAcceptAllOption?: boolean
  suggestedName?: string
  types?: FsPickerAcceptType[]
}

type FsAccessWindow = Window & {
  showOpenFilePicker?: (options?: FsOpenFilePickerOptions) => Promise<FsFileHandleRef[]>
  showSaveFilePicker?: (options?: FsSaveFilePickerOptions) => Promise<FsFileHandleRef>
}

function buildPlaceholderCells(): UiCell[] {
  const cells: UiCell[] = []

  for (let row = 1; row <= 9; row++) {
    for (let col = 1; col <= 9; col++) {
      cells.push({
        row,
        col,
        key: `${row}-${col}`,
        value: 0,
        candidates: []
      })
    }
  }

  return cells
}

const board = shallowRef<BoardModel | null>(null)
const uiCells = ref<UiCell[]>(buildPlaceholderCells())
const history = ref<BoardSnapshot[]>([])
const brokenCellKeys = ref<Set<string>>(new Set<string>())
const boardIsBroken = ref<boolean>(false)
const lastAction = ref<string>('ready')

const libraryEntries = ref<PuzzleLibraryEntry[]>([])
const selectedPuzzleId = ref<string>('')
const loadedLibraryFileName = ref<string>('')
const libraryName = ref<string>('Sudoku Library')
const libraryFileHandle = shallowRef<FsFileHandleRef | null>(null)
const libraryMessage = ref<string>('Choose File or New Library to begin editing.')
const draftSource = ref<string>('Custom')
const draftComment = ref<string>('')
const draftPage = ref<string>('')
const draftCredits = ref<string>('')
const draftEmail = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const DEFAULT_LIBRARY_FILENAME = 'new-library.sudoku'
const libraryInitialized = ref<boolean>(false)
const libraryDirty = ref<boolean>(false)
const selectedPuzzleBaseline = ref<string>('')
const hydratingSelection = ref<boolean>(false)
const openFold = ref<'library' | 'puzzles'>('library')
const FILE_PICKER_TYPES: FsPickerAcceptType[] = [
  {
    description: 'Sudoku library',
    accept: {
      'text/plain': ['.sudoku', '.ini', '.txt']
    }
  }
]

const canUndo = computed<boolean>(() => history.value.length > 1)
const canReset = computed<boolean>(() => history.value.length > 0)
const canSave = computed<boolean>(() => libraryInitialized.value && libraryDirty.value)
const canNewPuzzle = computed<boolean>(() => libraryInitialized.value)
const selectedPuzzle = computed<PuzzleLibraryEntry | null>(() => {
  return libraryEntries.value.find((item) => item.id === selectedPuzzleId.value) ?? null
})
const libraryState = computed<LibraryState>(() => {
  if (!libraryInitialized.value) return 'no-library'
  return libraryDirty.value ? 'library-dirty' : 'library-clean'
})
const puzzleState = computed<PuzzleState>(() => {
  if (!libraryInitialized.value) return 'no-selection'
  const current = selectedPuzzle.value
  if (!current) return 'no-selection'
  return puzzleSignature(current) === selectedPuzzleBaseline.value
    ? 'selected-unchanged'
    : 'selected-changed'
})
const activePuzzlePage = computed<string>(() => {
  return selectedPuzzle.value?.page ?? (draftPage.value.trim() || 'UnPaged Puzzle')
})

function keyOf(row: number, col: number): string {
  return `${row}-${col}`
}

function buildBlankBoard(): BoardModel {
  return new BoardModel(BoardMode.PLAY)
}

function currentMapString(): string {
  const ordered = [...uiCells.value].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row
    return a.col - b.col
  })

  return ordered.map((cell) => (cell.value > 0 ? String(cell.value) : '0')).join('')
}

function mapIndex(row: number, col: number): number {
  return (row - 1) * 9 + (col - 1)
}

function mapWithCellValue(map: string, row: number, col: number, value: number): string {
  if (!/^\d{81}$/.test(map)) return map
  const idx = mapIndex(row, col)
  if (idx < 0 || idx >= 81) return map
  return `${map.slice(0, idx)}${value}${map.slice(idx + 1)}`
}

function puzzleSignature(entry: PuzzleLibraryEntry): string {
  return JSON.stringify({
    source: entry.source ?? '',
    comment: entry.comment ?? '',
    page: entry.page ?? '',
    credits: entry.credits ?? '',
    email: entry.email ?? '',
    map: entry.map,
    difficulty: entry.difficulty
  })
}

function takeSnapshot(): BoardSnapshot {
  const currentBoard = board.value
  if (!currentBoard) return { cells: [] }

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

  return { cells }
}

type CreateCellStateRef = {
  row: number
  col: number
  value: number
  isKnown: boolean
  as_candidate_array: Array<{ value: number }>
}

type CreateUnitRef = {
  isBroken: boolean
  as_cell_array: CreateCellStateRef[]
}

function collectDuplicateKnownConflicts(unit: CreateUnitRef, out: Set<string>): void {
  const byValue = new Map<number, CreateCellStateRef[]>()
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
    const unit = unitUnknown as CreateUnitRef
    if (unit.isBroken) broken = true
    collectDuplicateKnownConflicts(unit, conflictKeys)
  }

  currentBoard.forEachRow((rowUnit) => visitUnit(rowUnit))
  currentBoard.forEachCol((colUnit) => visitUnit(colUnit))
  currentBoard.forEachBox((boxUnit) => visitUnit(boxUnit))

  brokenCellKeys.value = conflictKeys
  boardIsBroken.value = broken
}

function buildUiFromBoard(): void {
  const currentBoard = board.value
  if (!currentBoard) {
    uiCells.value = buildPlaceholderCells()
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
        candidates: cell.as_candidate_array.map((candidate) => candidate.value)
      })
    })
  })

  uiCells.value = nextCells
  recomputeBrokenState()
}

function resolveCellValueFromModelCell(modelCell: CreateCellModelRef, value: number): unknown | null {
  return modelCell.as_candidate_array.find((cv) => cv.value === value) ?? null
}

function getLiveModelCell(row: number, col: number): CreateCellModelRef | null {
  const currentBoard = board.value
  if (!currentBoard) return null

  let found: CreateCellModelRef | null = null
  currentBoard.forEachRow((rowUnit, rowIdx) => {
    if (rowIdx !== row - 1) return
    found = (rowUnit.as_cell_array[col - 1] as unknown as CreateCellModelRef) ?? null
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
  const nextBoard = buildBlankBoard()
  board.value = nextBoard

  snapshot.cells
    .filter((cell) => cell.value > 0)
    .forEach((cell) => {
      nextBoard.set(
        CellIndex.by(cell.col - 1),
        CellIndex.by(cell.row - 1),
        CellValue.by(cell.value)
      )
    })

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

function initializeBlank(): void {
  board.value = buildBlankBoard()
  buildUiFromBoard()
  history.value = [takeSnapshot()]
  lastAction.value = 'new blank puzzle'
}

function clearDraftFields(): void {
  draftSource.value = ''
  draftComment.value = ''
  draftPage.value = ''
  draftCredits.value = ''
  draftEmail.value = ''
}

function fillDraftFields(entry: PuzzleLibraryEntry): void {
  draftSource.value = entry.source ?? ''
  draftComment.value = entry.comment ?? ''
  draftPage.value = entry.page ?? ''
  draftCredits.value = entry.credits ?? ''
  draftEmail.value = entry.email ?? ''
}

function prepareBlankPuzzle(): void {
  clearDraftFields()
  initializeBlank()
}

function syncSelectedPuzzleState(): void {
  if (!libraryInitialized.value) return

  const entry = selectedPuzzle.value
  if (!entry) {
    selectedPuzzleBaseline.value = ''
    prepareBlankPuzzle()
    return
  }

  hydratingSelection.value = true
  selectedPuzzleBaseline.value = puzzleSignature(entry)
  fillDraftFields(entry)
  loadFromMap(entry.map)
  void nextTick(() => {
    hydratingSelection.value = false
  })
  lastAction.value = `selected ${entry.page}`
}

function updateSelectionBaselineToCurrent(): void {
  const current = selectedPuzzle.value
  selectedPuzzleBaseline.value = current ? puzzleSignature(current) : ''
}

function confirmReplaceCurrentLibrary(): boolean {
  if (!libraryInitialized.value) return true
  if (!libraryDirty.value) return true

  return window.confirm(
    'Loading a library will replace the current unsaved library in memory. Continue?'
  )
}

function onCreateViewKeydown(event: KeyboardEvent): void {
  const usesCtrl = event.ctrlKey || event.metaKey
  if (!usesCtrl) return

  const key = event.key.toLowerCase()
  if (key === 'l') {
    event.preventDefault()
    void chooseLibraryFile()
    return
  }

  if (key === 's') {
    event.preventDefault()
    if (event.shiftKey) {
      void saveLibraryAsFile()
      return
    }

    void saveLibraryFile()
  }
}

function supportsFileSystemAccess(): boolean {
  const fsWindow = window as FsAccessWindow
  return typeof fsWindow.showOpenFilePicker === 'function' && typeof fsWindow.showSaveFilePicker === 'function'
}

async function writeLibraryToFileHandle(handle: FsFileHandleRef, filename: string): Promise<void> {
  const iniText = serializePuzzleLibraryIniText(libraryEntries.value, {
    filename,
    name: libraryName.value.trim() || 'Sudoku Library'
  })
  const writable = await handle.createWritable()
  await writable.write(iniText)
  await writable.close()
}

async function saveLibraryByDownload(filename: string): Promise<void> {
  const iniText = serializePuzzleLibraryIniText(libraryEntries.value, {
    filename,
    name: libraryName.value.trim() || 'Sudoku Library'
  })
  const blob = new Blob([iniText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

async function loadLibraryFromFile(file: File, handle: FsFileHandleRef | null = null): Promise<void> {
  const text = await file.text()
  const parsed = parsePuzzleLibraryIniDocument(text)

  libraryEntries.value = parsed.entries
  libraryName.value = parsed.meta.name?.trim() || 'Sudoku Library'
  libraryInitialized.value = true
  libraryFileHandle.value = handle
  loadedLibraryFileName.value = normalizeLibraryFilename(file.name)
  selectedPuzzleId.value = parsed.entries[0]?.id ?? ''
  libraryMessage.value = `Loaded ${parsed.entries.length} puzzle(s) from ${file.name}`
  libraryDirty.value = false
  openFold.value = 'puzzles'

  if (parsed.entries.length > 0) {
    syncSelectedPuzzleState()
  } else {
    prepareBlankPuzzle()
    lastAction.value = 'library ready (empty)'
  }

  void nextTick(() => {
    updateSelectionBaselineToCurrent()
    libraryDirty.value = false
  })
}

function syncSelectedEntryFromForm(): void {
  if (hydratingSelection.value) return
  if (!libraryInitialized.value) return
  if (!selectedPuzzleId.value) return

  const selectedIndex = libraryEntries.value.findIndex((entry) => entry.id === selectedPuzzleId.value)
  if (selectedIndex < 0) return

  const current = libraryEntries.value[selectedIndex]
  const map = /^\d{81}$/.test(currentMapString()) ? currentMapString() : current.map
  const updated: PuzzleLibraryEntry = {
    ...current,
    source: draftSource.value.trim() || undefined,
    comment: draftComment.value.trim() || undefined,
    page: draftPage.value.trim() || undefined,
    credits: draftCredits.value.trim() || undefined,
    email: draftEmail.value.trim() || undefined,
    difficulty: inferDifficultyByGivens(map),
    map
  }

  const changed =
    updated.source !== current.source ||
    updated.comment !== current.comment ||
    updated.page !== current.page ||
    updated.credits !== current.credits ||
    updated.email !== current.email ||
    updated.map !== current.map ||
    updated.difficulty !== current.difficulty

  if (!changed) return

  const nextEntries = [...libraryEntries.value]
  nextEntries[selectedIndex] = updated
  libraryEntries.value = nextEntries
  libraryDirty.value = true
}

function loadFromMap(map: string): void {
  if (!/^\d{81}$/.test(map)) {
    libraryMessage.value = 'Load failed: map must be 81 digits.'
    return
  }

  const nextBoard = buildBlankBoard()
  board.value = nextBoard

  const seededValues: Array<{ row: number, col: number, value: number }> = []
  for (let i = 0; i < map.length; i++) {
    const raw = Number.parseInt(map[i], 10)
    if (Number.isNaN(raw) || raw === 0) continue

    const row = Math.floor(i / 9) + 1
    const col = (i % 9) + 1
    nextBoard.set(CellIndex.by(col - 1), CellIndex.by(row - 1), CellValue.by(raw))
    seededValues.push({ row, col, value: raw })
  }

  seededValues.forEach((entry) => {
    applyNeighborExcludes(entry.row, entry.col, CellValue.by(entry.value))
  })

  buildUiFromBoard()
  history.value = [takeSnapshot()]
  lastAction.value = 'Puzzle loaded'
}

function placeValue(cell: UiCell, value: number): void {
  if (!libraryInitialized.value) return
  const currentBoard = board.value
  if (!currentBoard) return
  if (boardIsBroken.value) {
    lastAction.value = 'blocked: board is broken; undo or reset'
    return
  }

  const modelCell = getLiveModelCell(cell.row, cell.col)
  if (!modelCell || modelCell.isKnown) return

  const modelValue = resolveCellValueFromModelCell(modelCell, value)
  if (!modelValue) return

  const changed = modelCell.is(modelValue)
  if (changed) {
    applyNeighborExcludes(cell.row, cell.col, CellValue.by(value))
    buildUiFromBoard()
    history.value.push(takeSnapshot())
    syncSelectedEntryFromForm()
    lastAction.value = `set r${cell.row}c${cell.col}=${value}`
  }
}

function setOrClearCellValueByClick(cell: UiCell, value: number): void {
  if (!libraryInitialized.value) return
  const map = currentMapString()
  if (!/^\d{81}$/.test(map)) return

  const nextValue = cell.value === value ? 0 : value
  const nextMap = mapWithCellValue(map, cell.row, cell.col, nextValue)
  loadFromMap(nextMap)
  history.value.push(takeSnapshot())
  syncSelectedEntryFromForm()
  lastAction.value = nextValue === 0
    ? `clear r${cell.row}c${cell.col}`
    : `set r${cell.row}c${cell.col}=${nextValue}`
}

function excludeCandidate(cell: UiCell, value: number): void {
  if (!libraryInitialized.value) return
  const currentBoard = board.value
  if (!currentBoard || cell.value > 0) return
  if (boardIsBroken.value) {
    lastAction.value = 'blocked: board is broken; undo or reset'
    return
  }

  const modelCell = getLiveModelCell(cell.row, cell.col)
  if (!modelCell || modelCell.isKnown) return

  const modelValue = resolveCellValueFromModelCell(modelCell, value)
  if (!modelValue) return

  const changed = modelCell.exclude(modelValue)
  if (changed) {
    buildUiFromBoard()
    history.value.push(takeSnapshot())
    syncSelectedEntryFromForm()
    lastAction.value = `exclude r${cell.row}c${cell.col}!=${value}`
  }
}

function onCellCandidateLeftClick(cell: UiCell, value: number): void {
  setOrClearCellValueByClick(cell, value)
}

function onCellCandidateRightClick(cell: UiCell, value: number): void {
  if (cell.value > 0) return
  excludeCandidate(cell, value)
}

function onCellValueLeftClick(cell: UiCell): void {
  if (cell.value <= 0) return
  setOrClearCellValueByClick(cell, cell.value)
}

function undoLast(): void {
  if (history.value.length <= 1) return
  history.value.pop()
  const previous = history.value[history.value.length - 1]
  restoreFromSnapshot(previous)
  syncSelectedEntryFromForm()
  lastAction.value = 'undo'
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
  syncSelectedEntryFromForm()
  lastAction.value = 'reset'
}

async function chooseLibraryFile(): Promise<void> {
  if (!confirmReplaceCurrentLibrary()) return

  if (!supportsFileSystemAccess()) {
    fileInput.value?.click()
    return
  }

  try {
    const fsWindow = window as FsAccessWindow
    const [handle] = await fsWindow.showOpenFilePicker!({
      excludeAcceptAllOption: true,
      multiple: false,
      types: FILE_PICKER_TYPES
    })

    if (!handle) return
    const file = await handle.getFile()
    await loadLibraryFromFile(file, handle)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    libraryMessage.value = 'Could not open selected library file.'
  }
}

function normalizeLibraryFilename(filename: string): string {
  const trimmed = filename.trim()
  if (!trimmed) return DEFAULT_LIBRARY_FILENAME
  if (/\.sudoku$/i.test(trimmed)) return trimmed

  const base = trimmed.replace(/\.[^.\\/]+$/, '')
  const safeBase = base.trim() || 'new-library'
  return `${safeBase}.sudoku`
}

async function onLibraryFileChosen(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!confirmReplaceCurrentLibrary()) {
    input.value = ''
    return
  }

  try {
    await loadLibraryFromFile(file)
  } catch {
    libraryMessage.value = 'Could not parse selected library file.'
  } finally {
    input.value = ''
  }
}

function inferDifficultyByGivens(map: string): 'easy' | 'medium' | 'hard' {
  const givens = map.split('').filter((ch) => ch !== '0').length
  if (givens >= 36) return 'easy'
  if (givens >= 30) return 'medium'
  return 'hard'
}

function newPuzzleEntry(): void {
  const map = currentMapString()
  if (!/^\d{81}$/.test(map)) {
    libraryMessage.value = 'Current board map is invalid.'
    return
  }

  const hasGivens = map.split('').some((d) => d !== '0')
  if (hasGivens) {
    const selectedId = selectedPuzzleId.value
    const selectedIndex = selectedId
      ? libraryEntries.value.findIndex((entry) => entry.id === selectedId)
      : -1
    const replacingSelected = selectedIndex >= 0
    const nextEntry: PuzzleLibraryEntry = {
      id: replacingSelected ? libraryEntries.value[selectedIndex].id : uuidv4(),
      difficulty: inferDifficultyByGivens(map),
      map,
      source: draftSource.value.trim() || 'Custom',
      comment: draftComment.value.trim() || undefined,
      page: draftPage.value.trim() || undefined,
      credits: draftCredits.value.trim() || undefined,
      email: draftEmail.value.trim() || undefined
    }

    if (replacingSelected) {
      const nextEntries = [...libraryEntries.value]
      nextEntries[selectedIndex] = nextEntry
      libraryEntries.value = nextEntries
    } else {
      libraryEntries.value = [...libraryEntries.value, nextEntry]

      nextTick(() => {
        const listbox = document.getElementById('library-puzzle') as HTMLSelectElement | null
        if (listbox) {
          const last = listbox.options[listbox.options.length - 1]
          last?.scrollIntoView({ block: 'nearest' })
        }
      })
    }

    libraryDirty.value = true
    selectedPuzzleId.value = ''
    libraryMessage.value = replacingSelected
      ? `Saved progress to "${nextEntry.page}" and started a new puzzle.`
      : `Added "${nextEntry.page}" (${libraryEntries.value.length} total). Fill in meta for next puzzle.`
  } else {
    libraryMessage.value = 'Nothing to save yet. Add at least one given before starting a new puzzle.'
  }

  prepareBlankPuzzle()
}

function deleteSelectedPuzzleWithConfirm(): void {
  if (!libraryInitialized.value) return

  const selected = selectedPuzzle.value
  if (!selected) return

  const ok = window.confirm(
    `Delete puzzle "${selected.page}" from this library?\n\nThis action cannot be undone.`
  )
  if (!ok) return

  libraryEntries.value = libraryEntries.value.filter((entry) => entry.id !== selected.id)
  libraryDirty.value = true
  selectedPuzzleId.value = ''
  prepareBlankPuzzle()
  lastAction.value = 'puzzle deleted'
  libraryMessage.value = `Deleted "${selected.page}" (${libraryEntries.value.length} remaining).`
}

function onPuzzleListDeleteKey(): void {
  if (!selectedPuzzleId.value) return
  deleteSelectedPuzzleWithConfirm()
}

function newLibrary(): void {
  libraryInitialized.value = true
  libraryDirty.value = true
  libraryEntries.value = []
  libraryName.value = 'Sudoku Library'
  selectedPuzzleId.value = ''
  selectedPuzzleBaseline.value = ''
  loadedLibraryFileName.value = DEFAULT_LIBRARY_FILENAME
  libraryFileHandle.value = null
  prepareBlankPuzzle()
  libraryMessage.value = 'New library started. Draw puzzles and use New Puzzle to add them.'
  openFold.value = 'puzzles'
}

function unloadLibrary(): void {
  libraryInitialized.value = false
  libraryDirty.value = false
  libraryEntries.value = []
  libraryName.value = 'Sudoku Library'
  selectedPuzzleId.value = ''
  selectedPuzzleBaseline.value = ''
  loadedLibraryFileName.value = ''
  libraryFileHandle.value = null
  clearDraftFields()
  libraryMessage.value = 'Choose File or New Library to begin editing.'
  board.value = null
  buildUiFromBoard()
  history.value = []
  selectedPuzzleBaseline.value = ''
  lastAction.value = 'ready'
  openFold.value = 'library'
}

async function saveLibraryFile(): Promise<void> {
  if (!libraryInitialized.value) {
    libraryMessage.value = 'Create or load a library before saving.'
    return
  }

  const filename = normalizeLibraryFilename(loadedLibraryFileName.value)

  try {
    if (libraryFileHandle.value) {
      await writeLibraryToFileHandle(libraryFileHandle.value, filename)
      loadedLibraryFileName.value = filename
      libraryDirty.value = false
      updateSelectionBaselineToCurrent()
      libraryMessage.value = `Saved ${libraryEntries.value.length} puzzle(s) to ${filename}`
      return
    }

    await saveLibraryAsFile()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    libraryMessage.value = 'Could not save library file.'
  }
}

async function saveLibraryAsFile(): Promise<void> {
  if (!libraryInitialized.value) {
    libraryMessage.value = 'Create or load a library before saving.'
    return
  }

  const filename = normalizeLibraryFilename(loadedLibraryFileName.value)

  try {
    if (supportsFileSystemAccess()) {
      const fsWindow = window as FsAccessWindow
      const handle = await fsWindow.showSaveFilePicker!({
        excludeAcceptAllOption: true,
        suggestedName: filename,
        types: FILE_PICKER_TYPES
      })

      await writeLibraryToFileHandle(handle, normalizeLibraryFilename(handle.name || filename))
      libraryFileHandle.value = handle
      loadedLibraryFileName.value = normalizeLibraryFilename(handle.name || filename)
    } else {
      await saveLibraryByDownload(filename)
      loadedLibraryFileName.value = filename
    }

    libraryDirty.value = false
    updateSelectionBaselineToCurrent()
    libraryMessage.value = `Saved ${libraryEntries.value.length} puzzle(s) to ${loadedLibraryFileName.value}`
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    libraryMessage.value = 'Could not save library file.'
  }
}

watch(selectedPuzzleId, () => {
  syncSelectedPuzzleState()
})

watch(
  [ draftSource, draftComment, draftPage, draftCredits, draftEmail],
  () => {
    syncSelectedEntryFromForm()
  }
)

watch(libraryName, (next, prev) => {
  if (!libraryInitialized.value) return
  if (next === prev) return
  libraryDirty.value = true
})

onMounted(() => {
  window.addEventListener('keydown', onCreateViewKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onCreateViewKeydown)
})

function cellClass(cell: UiCell): Record<string, boolean> {
  const rowIndex = cell.row - 1
  const colIndex = cell.col - 1

  return {
    broken: brokenCellKeys.value.has(cell.key),
    'block-right': colIndex % 3 === 2 && colIndex !== 8,
    'block-bottom': rowIndex % 3 === 2 && rowIndex !== 8
  }
}

</script>

<template>
  <main
    class="create-view"
    tabindex="0"
    :data-library-state="libraryState"
    :data-puzzle-state="puzzleState"
    @keydown="onCreateViewKeydown"
  >

    <section class="card-shell editor-shell">
      <div class="board-wrap" role="grid" aria-label="Sudoku board" @contextmenu.prevent="onBoardContextMenu">
        <div
          v-for="cell in uiCells"
          :key="cell.key"
          class="board-cell"
          :class="cellClass(cell)"
          role="gridcell"
        >
          <button
            v-if="cell.value > 0"
            type="button"
            class="value value-button"
            tabindex="-1"
            @click.prevent.stop="onCellValueLeftClick(cell)"
          >
            {{ cell.value }}
          </button>
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

      <div class="muted bg-sudoku-primary p-2 rounded mt-1 text-white">
        <div class="row">
          <div class="col-9 no-wrap">
            {{ activePuzzlePage }}
          </div>
          <div class="col-3 no-wrap">{{ lastAction }}</div>
        </div>
      </div>
      <p v-if="boardIsBroken" class="warn">Broken board: conflicting values detected. Undo or Reset.</p>
    </section>

    <section class="card-shell control-shell">
      <h2>Create Sudoku</h2>

      <!-- Fold 1: Library — New / Load / Save + puzzle metadata -->
      <div class="fold" :class="{ 'fold-open': openFold === 'library' }">
        <button type="button" class="fold-header" @click="openFold = 'library'">
          <span>Library</span>
          <span class="fold-chevron" aria-hidden="true">{{ openFold === 'library' ? '▲' : '▼' }}</span>
        </button>
        <div v-show="openFold === 'library'" class="fold-body">

          <div class="field-row">
            <div class="inline-row">
              <button type="button" class="secondary-button" :disabled="libraryInitialized" @click="newLibrary">New</button>
              <button type="button" class="secondary-button" @click="chooseLibraryFile">Load</button>
              <button type="button" class="secondary-button" :disabled="!canSave" @click="saveLibraryFile">Save</button>
              <button type="button" class="secondary-button" :disabled="!libraryInitialized" @click="saveLibraryAsFile">Save As</button>
              <button type="button" class="secondary-button" :disabled="!libraryInitialized" @click="unloadLibrary">Unload</button>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept=".sudoku,.ini,.txt"
              class="hidden-file"
              @change="onLibraryFileChosen"
            />
            <p class="muted">{{ libraryMessage }}</p>
          </div>

          <div class="field-row">
            <label for="library-file-name">Library file name</label>
            <input
              id="library-file-name"
              v-model="loadedLibraryFileName"
              class="input"
              type="text"
              :disabled="!libraryInitialized"
              :placeholder="DEFAULT_LIBRARY_FILENAME"
            />
          </div>

          <div class="field-row">
            <label for="library-name">Library name</label>
            <input
              id="library-name"
              v-model="libraryName"
              class="input"
              type="text"
              :disabled="!libraryInitialized"
            />
          </div>

        </div>
      </div>

      <!-- Fold 2: Puzzles — board controls + puzzle list -->
      <div class="fold" :class="{ 'fold-open': openFold === 'puzzles' }">
        <button type="button" class="fold-header" @click="openFold = 'puzzles'">
          <span>Puzzles</span>
          <span class="fold-chevron" aria-hidden="true">{{ openFold === 'puzzles' ? '▲' : '▼' }}</span>
        </button>
        <div v-show="openFold === 'puzzles'" class="fold-body">
          <div class="puzzle-actions d-grid gap-2 mb-2">
            <button type="button" class="action-button" :disabled="!canNewPuzzle" @click="newPuzzleEntry">New</button>
            <button type="button" class="action-button" :disabled="!libraryInitialized || !canUndo" @click="undoLast">Undo</button>
            <button type="button" class="action-button" :disabled="!libraryInitialized || !canReset" @click="resetBoard">Reset</button>
          </div>

          <div class="field-row">
            <label for="library-puzzle">Puzzle in loaded library</label>
            <select
              id="library-puzzle"
              v-model="selectedPuzzleId"
              class="puzzle-list"
              size="5"
              :disabled="!libraryInitialized || libraryEntries.length === 0"
              @keydown.delete.prevent="onPuzzleListDeleteKey"
            >
              <option value="">-- New puzzle --</option>
              <option v-for="entry in libraryEntries" :key="entry.id" :value="entry.id">
                {{ entry.source }}{{ entry.page || '' }} ({{ entry.difficulty }})
              </option>
            </select>
          </div>

          <div class="field-grid">
            <div class="field-row">
              <label for="draft-source">Source</label>
              <input id="draft-source" v-model="draftSource" class="input" type="text" />
            </div>
            <div class="field-row">
              <label for="draft-comment">Comment</label>
              <input id="draft-comment" v-model="draftComment" class="input" type="text" />
            </div>
            <div class="field-row">
              <label for="draft-page">Page</label>
              <input id="draft-page" v-model="draftPage" class="input" type="text" />
            </div>
            <div class="field-row">
              <label for="draft-credits">Credits</label>
              <input id="draft-credits" v-model="draftCredits" class="input" type="text" />
            </div>
            <div class="field-row">
              <label for="draft-email">Email</label>
              <input id="draft-email" v-model="draftEmail" class="input" type="text" />
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.create-view {
  margin: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(300px, 1fr);
  align-items: start;
  gap: 1rem;
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

.inline-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.7rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.input,
.select {
  height: 2.2rem;
  border-radius: 8px;
  border: 1px solid #b8c9dc;
  background: #fff;
  padding: 0 0.6rem;
}

.puzzle-list {
  border-radius: 8px;
  border: 1px solid #b8c9dc;
  background: #fff;
  width: 100%;
  overflow-y: auto;
  padding: 0.15rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.puzzle-list option {
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  border-radius: 4px;
}

.puzzle-list option:checked {
  background: var(--sudoku-primary);
  color: #fff;
}

.puzzle-list:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.action-button,
.secondary-button,
.add-button {
  border: 1px solid var(--sudoku-primary-dark);
  background: var(--sudoku-primary);
  color: #fff;
  border-radius: 8px;
  height: 2.2rem;
  padding: 0 0.85rem;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
}

.action-button:hover,
.secondary-button:hover,
.add-button:hover {
  background: var(--sudoku-primary-light);
  box-shadow: 0 2px 8px rgba(21, 54, 91, 0.28);
}

.action-button:focus-visible,
.secondary-button:focus-visible,
.add-button:focus-visible {
  outline: 2px solid var(--sudoku-focus-outline);
  outline-offset: 2px;
}

.action-button:active,
.secondary-button:active,
.add-button:active {
  transform: translateY(1px);
}

.action-button:disabled,
.secondary-button:disabled,
.add-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  background: var(--sudoku-primary-disabled);
  border-color: var(--sudoku-primary-border-disabled);
  box-shadow: none;
}

.hidden-file {
  display: none;
}

.fold {
  margin-top: 0.75rem;
  border: 1px solid #d0dcea;
  border-radius: 8px;
  overflow: hidden;
}

.fold-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #eef4fb;
  border: 0;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--sudoku-primary-dark, #23436b);
  transition: background-color 0.15s ease, color 0.15s ease;
  text-align: left;
}

.fold-header:hover {
  background: #dce9f7;
}

.fold-open .fold-header {
  background: var(--sudoku-primary, #1e4f86);
  color: #fff;
}

.fold-chevron {
  font-size: 0.75rem;
  opacity: 0.7;
}

.fold-body {
  padding: 0.75rem;
  border-top: 1px solid #d0dcea;
}

.puzzle-actions {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.editor-shell {
  grid-column: 1;
  display: grid;
  gap: 0.6rem;
}

.control-shell {
  grid-column: 2;
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

.board-cell.broken {
  background: #e40a0a;
  color: #ffffff;
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

.value-button {
  border: 0;
  background: transparent;
  color: inherit;
  width: 100%;
  height: 100%;
  cursor: pointer;
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
  .create-view {
    grid-template-columns: 1fr;
  }

  .editor-shell,
  .control-shell {
    grid-column: auto;
    grid-row: auto;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
