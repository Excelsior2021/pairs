import type { Component } from "solid-js"
import GameScreen from "./components/GameScreen/GameScreen"

import "./App.scss"

console.log(import.meta.env.VITE_SERVER_URL)

const App: Component = () => (
  <div class="app">
    <a
      class="app__link"
      href="https://jonathankila.vercel.app"
      target="_blank"
      rel="noreferrer">
      <h1 class="app__title">Pairs</h1>
    </a>

    <a class="counter" href="https://www.free-website-hit-counter.com">
      <img
        src="https://www.free-website-hit-counter.com/c.php?d=9&id=143227&s=5"
        alt="Free Website Hit Counter"
      />
    </a>

    <GameScreen />
  </div>
)

export default App
