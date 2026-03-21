export type PuzzleLibraryEntry = {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  map: string
  page?: number
  credits?: string
  email?: string
  source?: string
}

type IniSection = {
  [key: string]: string
}

type IniObject = {
  [section: string]: IniSection
}

// Fallback when INI is unavailable.
export const PUZZLE_LIBRARY_FALLBACK: PuzzleLibraryEntry[] = [
  {
    id: 'easy-001',
    title: 'Daily Warmup #1',
    difficulty: 'easy',
    map: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    source: 'starter'
  },
  {
    id: 'medium-001',
    title: 'Midnight Grid #7',
    difficulty: 'medium',
    map: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
    source: 'starter'
  },
  {
    id: 'hard-001',
    title: 'Logic Forge #3',
    difficulty: 'hard',
    map: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
    source: 'starter'
  }
]

function parseIni(data: string): IniObject {
  const ini: IniObject = {}
  let section = ''

  data.split('\n').forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line || line.startsWith(';') || line.startsWith('#')) return

    if (line.startsWith('[') && line.endsWith(']')) {
      section = line.substring(1, line.length - 1)
      ini[section] = {}
      return
    }

    const parts = line.split('=')
    if (parts.length !== 2 || !ini[section]) return

    ini[section][parts[0].trim()] = parts[1].trim()
  })

  return ini
}

function decodeMapString(encodedMap: string): string {
  if (encodedMap.startsWith('MAP:NR:A:')) {
    const raw = encodedMap.substring(9)
    if (!/^\d{81}$/.test(raw)) throw new Error('InvalidMapDefinition')
    return raw
  }

  if (encodedMap.startsWith('MAP:RL:A:')) {
    let eMap = encodedMap.substring(9)
    let out = ''

    while (eMap.length > 0 && out.length <= 81) {
      if (/^[1-9]/.test(eMap)) {
        out += eMap[0]
        eMap = eMap.substring(1)
        continue
      }

      if (eMap.startsWith('0')) {
        out += '0'
        eMap = eMap.substring(1)
        continue
      }

      if (eMap.startsWith('R')) {
        const xIdx = eMap.indexOf('X')
        if (xIdx <= 1) throw new Error('InvalidMapDefinition')
        const runLen = Number.parseInt(eMap.substring(1, xIdx), 10)
        if (Number.isNaN(runLen) || runLen < 1) throw new Error('InvalidMapDefinition')
        out += '0'.repeat(runLen)
        eMap = eMap.substring(xIdx + 1)
        continue
      }

      throw new Error('InvalidMapDefinition')
    }

    if (out.length !== 81 || eMap.length !== 0) throw new Error('InvalidMapDefinition')
    return out
  }

  throw new Error('InvalidMapDefinition')
}

function inferDifficulty(givenCount: number): 'easy' | 'medium' | 'hard' {
  if (givenCount >= 36) return 'easy'
  if (givenCount >= 30) return 'medium'
  return 'hard'
}

export async function loadPuzzleLibraryFromIni(iniPath = '/puzzles/test-map-1.ini'): Promise<PuzzleLibraryEntry[]> {
  const response = await fetch(iniPath)
  if (!response.ok) throw new Error(`Unable to load puzzle INI (${response.status})`)

  const iniData = await response.text()
  const parsed = parseIni(iniData)

  const entries = Object.keys(parsed)
    .filter((section) => section !== 'global')
    .map((section) => {
      const p = parsed[section]
      const map = decodeMapString(p.map ?? '')
      const givens = map.split('').filter((ch) => ch !== '0').length

      return {
        id: p.uuid ?? section,
        title: `${p.source ?? 'Sudoku'} p.${p.page ?? '?'}`,
        difficulty: inferDifficulty(givens),
        map,
        source: p.source,
        page: Number.parseInt(p.page ?? '0', 10) || undefined,
        credits: p.credits,
        email: p.email
      } satisfies PuzzleLibraryEntry
    })
    .sort((a, b) => {
      const sourceCmp = (a.source ?? '').localeCompare(b.source ?? '')
      if (sourceCmp !== 0) return sourceCmp
      return (a.page ?? 0) - (b.page ?? 0)
    })

  return entries
}
