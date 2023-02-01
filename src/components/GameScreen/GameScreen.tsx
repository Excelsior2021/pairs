import { Component, createSignal, Switch, Match } from "solid-js"
import MainMenu from "../MainMenu/MainMenu"
import Session from "../Session/Session"
import Instructions from "../Instructions/Instructions"
import "./GameScreen.scss"
import MultiplayerMenu from "../MultiplayerMenu/MultiplayerMenu"
import MultiplayerSession from "../MultiplayerSession/MultiplayerSession.jsx"
import JoinGame from "../JoinGame/JoinGame"

export const [singlePlayerStarted, setSinglePlayerStarted] = createSignal(false)
export const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
export const [joinGame, setJoinGame] = createSignal(false)
export const [multiplayerSessionStarted, setMultiplayerSessionStarted] =
  createSignal(false)
export const [sessionID, setSessionID] = createSignal(null)
export const [socket, setSocket] = createSignal(null)

const GameScreen: Component = () => (
  <main class="game-screen">
    <Switch fallback={<MainMenu />}>
      <Match when={singlePlayerStarted()}>
        <Session />
      </Match>
      <Match when={multiplayerMenu()}>
        <MultiplayerMenu />
      </Match>
      <Match when={joinGame()}>
        <JoinGame />
      </Match>
      <Match when={multiplayerSessionStarted()}>
        <MultiplayerSession socket={socket()} sessionID={sessionID} />
      </Match>
    </Switch>
    <Instructions />
  </main>
)

export default GameScreen
