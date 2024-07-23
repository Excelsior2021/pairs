import { createSignal, Switch, Match } from "solid-js"
import MainMenu from "../main-menu/main-menu"
import Session from "../session/session"
import Instructions from "../instructions/instructions"
import MultiplayerMenu from "../multiplayer-menu/multiplayer-menu"
import MultiplayerSession from "../multiplayer-session/multiplayer-session.jsx"
import JoinGame from "../join-game/join-game"
import "./game-screen.scss"

import type { Component } from "solid-js"
import type { Socket } from "socket.io-client"

export const [singlePlayerStarted, setSinglePlayerStarted] = createSignal(false)
export const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
export const [joinGame, setJoinGame] = createSignal(false)
export const [multiplayerSessionStarted, setMultiplayerSessionStarted] =
  createSignal(false)
export const [socket, setSocket] = createSignal<Socket | null>(null)
export const [createSessionID, setCreateSessionID] = createSignal("")

const GameScreen: Component = () => {
  return (
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
}

export default GameScreen
