import { Component, createSignal, Switch, Match } from "solid-js"
import { io } from "socket.io-client"
import MainMenu from "../MainMenu/MainMenu"
import Session from "../Session/Session"
import Instructions from "../Instructions/Instructions"
import MultiplayerMenu from "../MultiplayerMenu/MultiplayerMenu"
import MultiplayerSession from "../MultiplayerSession/MultiplayerSession.jsx"
import JoinGame from "../JoinGame/JoinGame"
import "./GameScreen.scss"

export const [singlePlayerStarted, setSinglePlayerStarted] = createSignal(false)
export const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
export const [joinGame, setJoinGame] = createSignal(false)
export const [multiplayerSessionStarted, setMultiplayerSessionStarted] =
  createSignal(false)
export const [sessionID, setSessionID] = createSignal("")
export const [socket, setSocket] = createSignal(io())

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
        <MultiplayerSession socket={socket()} />
      </Match>
    </Switch>
    <Instructions />
  </main>
)

export default GameScreen
