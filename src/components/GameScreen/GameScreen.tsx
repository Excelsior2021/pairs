import { Component, createSignal, Show, Switch, Match } from "solid-js"
import MainMenu from "../MainMenu/MainMenu"
import Session from "../Session/Session"
import Instructions from "../Instructions/Instructions"
import "./GameScreen.scss"
import MultiplayerMenu from "../MultiplayerMenu/MultiplayerMenu"
import MultiplayerSession from "../MultiplayerSession/MultiplayerSession.jsx"

export const [singlePlayerStarted, setSinglePlayerStarted] = createSignal(false)
export const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
export const [multiplayerStarted, setMultiplayerStarted] = createSignal(false)

const GameScreen: Component = () => (
  <main class="game-screen">
    <Switch fallback={<MainMenu />}>
      <Match when={singlePlayerStarted()}>
        <Session />
      </Match>
      <Match when={multiplayerMenu()}>
        <MultiplayerMenu />
      </Match>
      <Match when={multiplayerStarted()}>
        <MultiplayerSession />
      </Match>
    </Switch>
    <Instructions />
  </main>
)

export default GameScreen
