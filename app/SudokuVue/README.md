# Sudoku Playground

## An Explorization Sudoku "SOLVER" using Vue 3 in Vite.

Vue 3 + TypeScript + Vite app for exploring Sudoku board models and developing
strategies for solving Sukoku in a CLI and browser format.

## What is here

- Interactive play screen with puzzle selection and solve-assist mode
- Reference views for core Sudoku concepts: cell, unit, line, block, and board
- Puzzle library loaded from `public/puzzles/test-map-1.ini`
- Jest unit tests for the Sudoku model and strategy code
- Cypress component test setup for UI work (unused)

## Quick start

```sh
npm install
npm run dev
```

Open the local Vite URL, then use the `Play` route to load a puzzle and interact with the board.

## Commands

```sh
npm run dev
```

Starts the Vite dev server.

```sh
npm run build
```

Runs `vue-tsc --noEmit` and then builds the production bundle into `dist/`.

```sh
npm run preview
```

Serves the production build locally on port `4173`.

```sh
npm test
```

Runs the Jest suite and writes coverage output to `coverage/`.

```sh
npm run lint
```

Runs ESLint with `--fix`, so it may modify files.

```sh
npx cypress open
```

Opens Cypress for component testing. The project currently includes the Cypress setup and a starter component spec.

## Recommended editor setup

Use VS Code with Volar. If Vetur is installed, disable it for this workspace.
