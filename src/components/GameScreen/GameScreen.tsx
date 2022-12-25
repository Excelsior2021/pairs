import { Component, createSignal, Show } from "solid-js"
import MainMenu from "../MainMenu/MainMenu"
import Session from "../Session/Session"
import Instructions from "../Instructions/Instructions"
import "./GameScreen.scss"

export const [gameStarted, setGameStarted] = createSignal(false)

const GameScreen: Component = () => (
  <main class="game-screen">
    <Show
      when={gameStarted()}
      fallback={<MainMenu setGameStarted={setGameStarted} />}>
      <Session />
    </Show>
    <Instructions />
  </main>
)

export default GameScreen
