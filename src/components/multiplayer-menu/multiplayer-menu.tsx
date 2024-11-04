import { createSignal, For, type Component } from "solid-js"
import { io } from "socket.io-client"
import {
  setMultiplayerMenu,
  setMultiplayerSessionStarted,
  setJoinGame,
  setSocket,
  setCreateSessionID,
  socket,
} from "@/components/game-screen/game-screen"
import { dispatchGameAction } from "@/components/multiplayer-session/multiplayer-session"
import { GameAction } from "@/enums"
import { connectToServer } from "@/utils"
import { createGameHandler, terminateCreateSession } from "./component-lib"

import "./multiplayer-menu.scss"

const MultiplayerMenu: Component = () => {
  const [serverConnected, setServerConnected] = createSignal<boolean | null>(
    null
  )
  const [serverTimeout, setServerTimeout] = createSignal(false)
  const [UITimer, setUITimer] = createSignal(60)

  const actions = [
    {
      name: "create game",
      onclick: () =>
        createGameHandler(
          io,
          connectToServer,
          setSocket,
          setCreateSessionID,
          setMultiplayerMenu,
          setMultiplayerSessionStarted,
          setServerTimeout,
          setServerConnected,
          UITimer,
          setUITimer,
          dispatchGameAction,
          GameAction
        ),
    },
    {
      name: "join game",
      onclick: () => {
        terminateCreateSession(socket(), setMultiplayerMenu)
        setJoinGame(true)
      },
    },
    {
      name: "←",
      onclick: () => terminateCreateSession(socket(), setMultiplayerMenu),
    },
  ]

  return (
    <div class="multiplayer-menu">
      <h2 class="multiplayer-menu__heading">multiplayer</h2>
      <div class="multiplayer-menu__actions">
        <For each={actions}>
          {action => (
            <button class="multiplayer-menu__button" onclick={action.onclick}>
              {action.name}
            </button>
          )}
        </For>
      </div>
      {serverConnected() === false && !serverTimeout() && (
        <p class="multiplayer-menu__text">
          Please wait a few moments, the server may be initializing. (
          {UITimer()})
        </p>
      )}
      {serverTimeout() && (
        <p class="multiplayer-menu__text">
          There seems to be an issue connecting to the server. Please try again
          later.
        </p>
      )}
    </div>
  )
}

export default MultiplayerMenu
