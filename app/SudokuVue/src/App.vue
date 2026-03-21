<script setup lang="ts">
import PuzzleTitle from './components/AppTitle.vue'
</script>

<template>
  <div id="app">
    <puzzle-title title="Sudoku Playground" tagline="A Programming Development Exercise" />

    <header>
      <div class="wrapper">
        <nav>
          <router-link to="/home">Home</router-link>
          <router-link to="/about/cell">Cell</router-link>
          <router-link to="/about/unit">Unit</router-link>
          <router-link to="/about/line">Line</router-link>
          <router-link to="/about/block">Block</router-link>
          <router-link to="/about/board">Board</router-link>
          <router-link to="/play">Play</router-link>
          <router-link to="/create">Create</router-link>
        </nav>
      </div>
    </header>

    <div class="content">
      <router-view />
    </div>

  </div>
</template>

<style scoped>

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 0.0rem;
}

nav a.router-link-exact-active {
  color: var(--sudoku-primary-dark, #23436b);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.4rem;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1.2rem;
  border-left: 1px solid var(--color-border);
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

nav a:hover {
  border-left-color: var(--sudoku-primary-dark, #23436b);
  background-color: rgba(30, 79, 134, 0.08);
}

nav a:hover + a {
  border-left-color: var(--sudoku-primary-dark, #23436b);
}

nav a:first-of-type {
  border: 0;
}

.content {
  min-width: 900px;
  max-width: 1200px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  background: #f8f8f8;
}

@media (min-width: 1824px) {

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    x-margin-left: -1rem;
    x-font-size: 1rem;

    x-padding: 1rem 0;
    x-margin-top: 1rem;
  }
}

</style>

// vim: expandtab tabstop=2 number
// END
