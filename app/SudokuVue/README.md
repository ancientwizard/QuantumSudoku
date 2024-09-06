# Sudoku Solver

## An example Sudoku "SOLVER" using Vue 3 in Vite.

I'm Exploring SUDOKU as a problem to solve not necessarily as a game
to play but as tool to explore the techbologies below. This code is based
on a Java solution I have tinkered with, though the Java is far more indepth.
    
- includes unused code ( a work in progress )
- unfinished code
- VueJS to simply UI modeling within a browser
- Using typescript for the first time so excuse the mistakes
  (I used knowledge of other languages and docs to make
   educated guesses about syntax)
- Lint is enabled (see README.md)
- Cypress is included (see README.md)
  ( not configured to do anything yet useful yet! )
- Jest is included for unit testing (all typescript)
- Hints on how to run/build (See below)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Start Cypress

```sh
npx cypress open
```

### Run Tests (Jest)

```sh
npm test
```

