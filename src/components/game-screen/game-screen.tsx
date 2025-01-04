import { createSignal, Switch, Match, type Component } from "solid-js"
import MainMenu from "@components/main-menu/main-menu"
import Session from "@components/session/session"
import Instructions from "@components/instructions/instructions"
import MultiplayerMenu from "@components/multiplayer-menu/multiplayer-menu"
import MultiplayerSession from "@components/multiplayer-session/multiplayer-session"
import JoinGame from "@components/join-game/join-game"
import "./game-screen.scss"

import type { Socket } from "socket.io-client"
import { PlayerID } from "@enums"

export const [sessionStarted, setSessionStarted] = createSignal(false)
export const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
export const [joinGameMenu, setJoinGameMenu] = createSignal(false)
export const [multiplayerSessionStarted, setMultiplayerSessionStarted] =
  createSignal(false)
export const [socket, setSocket] = createSignal<Socket | null>(null)
export const [sessionID, setSessionID] = createSignal("")
export const [playerID, setPlayerID] = createSignal<PlayerID | null>(null)

const GameScreen: Component = () => (
  <main class="game-screen">
    <Switch fallback={<MainMenu />}>
      <Match when={sessionStarted()}>
        <Session />
      </Match>
      <Match when={multiplayerMenu()}>
        <MultiplayerMenu />
      </Match>
      <Match when={joinGameMenu()}>
        <JoinGame />
      </Match>
      <Match when={multiplayerSessionStarted()}>
        <MultiplayerSession
          socket={socket()}
          sessionID={sessionID()}
          playerID={playerID()}
        />
      </Match>
    </Switch>
    <Instructions />
  </main>
)

export default GameScreen
