import type { Component } from "solid-js"
import GameScreen from "./components/GameScreen/GameScreen"

import "./App.scss"

const App: Component = () => (
  <div class="app">
    <a
      class="app__link"
      href="https://jonathankila.vercel.app"
      target="_blank"
      rel="noreferrer">
      <h1 class="app__title">Pairs</h1>
    </a>
    <GameScreen />
  </div>
)

export default App
