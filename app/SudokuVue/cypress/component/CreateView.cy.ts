import CreateView from '@/views/CreateView.vue'

describe('CreateView', () => {
  const sampleLibraryText = `# sample.sudoku
# version 0.1
# 2026-03-27T00:00:00.000Z

[global]
name=Loaded Library

[abc-123]
uuid=abc-123
title=Loaded Puzzle
comment=from file
source=Book
page=A-12
credits=Tester
email=test@example.com
map=MAP:NR:A:100000000000000000000000000000000000000000000000000000000000000000000000000000000

## END
`

  function clickLibraryNew(): void {
    cy.contains('.inline-row .secondary-button', /^New$/).click({ force: true })
    cy.contains('.inline-row .secondary-button', /^Unload$/).should('not.be.disabled')
  }

  function clickPuzzleNew(): void {
    cy.contains('.puzzle-actions .action-button', /^New$/).click({ force: true })
  }

  beforeEach(() => {
    cy.mount(CreateView)
  })

  it('tracks explicit state markers', () => {
    cy.get('.create-view').should('have.attr', 'data-library-state', 'no-library')
    cy.get('.create-view').should('have.attr', 'data-puzzle-state', 'no-selection')

    clickLibraryNew()
    cy.get('.create-view').should('have.attr', 'data-library-state', 'library-dirty')
    cy.get('.create-view').should('have.attr', 'data-puzzle-state', 'no-selection')
  })

  it('supports M1 set then clear toggle on a cell', () => {
    clickLibraryNew()

    cy.get('.board-cell').first().within(() => {
      cy.get('.candidate-live').first().click()
    })

    cy.get('.board-cell').first().find('.value-button').should('exist').click()
    cy.get('.board-cell').first().find('.candidate-live').should('exist')
  })

  it('deletes selected puzzle via Delete key with confirm', () => {
    clickLibraryNew()

    cy.get('#draft-title').clear().type('Delete Me')
    cy.get('.board-cell').first().within(() => {
      cy.get('.candidate-live').first().click()
    })
    clickPuzzleNew()

    cy.get('#library-puzzle').select(1)
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true)
    })

    cy.get('#library-puzzle').focus().trigger('keydown', { key: 'Delete' })
    cy.get('#library-puzzle option').should('not.contain.text', 'Delete Me')
  })

  it('handles Ctrl+S and Ctrl+Shift+S shortcuts', () => {
    clickLibraryNew()

    cy.window().then((win) => {
      const writable = {
        write: cy.stub().resolves(),
        close: cy.stub().resolves()
      }

      cy.stub(win as Window & { showOpenFilePicker?: () => Promise<unknown[]> }, 'showOpenFilePicker')
        .resolves([])

      cy.stub(
        win as Window & {
          showSaveFilePicker?: () => Promise<{ name: string, createWritable: () => Promise<typeof writable> }>
        },
        'showSaveFilePicker'
      ).resolves({
        name: 'shortcut-save.sudoku',
        createWritable: () => Promise.resolve(writable)
      })
    })

    cy.get('.create-view').trigger('keydown', { key: 's', ctrlKey: true, force: true })
    cy.get('.create-view').should('have.attr', 'data-library-state', 'library-clean')
    cy.contains('Saved 0 puzzle(s)', { matchCase: false }).should('exist')

    cy.get('.create-view').trigger('keydown', { key: 'S', ctrlKey: true, shiftKey: true, force: true })
    cy.contains('Saved 0 puzzle(s)', { matchCase: false }).should('exist')
  })

  it('handles Ctrl+L shortcut', () => {
    cy.window().then((win) => {
      cy.stub(win as Window & { showOpenFilePicker?: () => Promise<unknown[]> }, 'showOpenFilePicker')
        .resolves([])
        .as('openPicker')
    })

    cy.get('.create-view').click().trigger('keydown', { key: 'l', ctrlKey: true })
    cy.get('@openPicker').should('have.been.called')
  })

  it('moves selected puzzle between unchanged and changed states', () => {
    clickLibraryNew()
    cy.get('#draft-title').clear().type('State Probe')
    cy.get('.board-cell').first().within(() => {
      cy.get('.candidate-live').first().click()
    })
    clickPuzzleNew()

    cy.get('#library-puzzle').select(1)
    cy.get('.create-view').should('have.attr', 'data-puzzle-state', 'selected-unchanged')

    cy.get('#draft-comment').clear().type('edited')
    cy.get('.create-view').should('have.attr', 'data-puzzle-state', 'selected-changed')
    cy.get('.create-view').should('have.attr', 'data-library-state', 'library-dirty')
  })

  it('marks selected puzzle unchanged after save', () => {
    clickLibraryNew()
    cy.get('#draft-title').clear().type('Save Probe')
    cy.get('.board-cell').first().within(() => {
      cy.get('.candidate-live').first().click()
    })
    clickPuzzleNew()
    cy.get('#library-puzzle').select(1)
    cy.get('#draft-comment').clear().type('needs save')

    cy.window().then((win) => {
      const writable = {
        write: cy.stub().resolves(),
        close: cy.stub().resolves()
      }

      cy.stub(
        win as Window & {
          showSaveFilePicker?: () => Promise<{ name: string, createWritable: () => Promise<typeof writable> }>
        },
        'showSaveFilePicker'
      ).resolves({
        name: 'state-save.sudoku',
        createWritable: () => Promise.resolve(writable)
      })
    })

    cy.get('.create-view').trigger('keydown', { key: 's', ctrlKey: true, force: true })
    cy.get('.create-view').should('have.attr', 'data-library-state', 'library-clean')
    cy.get('.create-view').should('have.attr', 'data-puzzle-state', 'selected-unchanged')
  })

  it('loads a library and flushes dirty in-memory library after confirmation', () => {
    clickLibraryNew()
    cy.get('#draft-title').clear().type('Old Puzzle')
    cy.get('.board-cell').first().within(() => {
      cy.get('.candidate-live').first().click()
    })
    clickPuzzleNew()
    cy.get('#library-puzzle option').should('contain.text', 'Old Puzzle')

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true)
    })

    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from(sampleLibraryText),
        fileName: 'loaded.sudoku',
        mimeType: 'text/plain'
      },
      { force: true }
    )

    cy.get('#library-puzzle option').should('contain.text', 'Loaded Puzzle')
    cy.get('#library-puzzle option').should('not.contain.text', 'Old Puzzle')
    cy.get('.create-view').should('have.attr', 'data-library-state', 'library-clean')
    cy.get('.create-view').should('have.attr', 'data-puzzle-state', 'selected-unchanged')
  })
})
