import { createSignal, For, type Component } from "solid-js"
import { io } from "socket.io-client"
import {
  setMultiplayerMenu,
  setMultiplayerSessionStarted,
  setJoinGameMenu,
  setSocket,
  setCreateSessionID,
  socket,
} from "@components/game-screen/game-screen"
import { createGameHandler, terminateCreateSession } from "./component-lib"

import "./multiplayer-menu.scss"

const MultiplayerMenu: Component = () => {
  const [serverConnected, setServerConnected] = createSignal<false | null>(null)
  const [connecting, setConnecting] = createSignal(false)

  const actions = [
    {
      name: "create game",
      onclick: () =>
        createGameHandler(
          io,
          setSocket,
          setCreateSessionID,
          setMultiplayerMenu,
          setMultiplayerSessionStarted,
          setConnecting,
          setServerConnected
        ),
      disabled: () => connecting(),
    },
    {
      name: "join game",
      onclick: () => {
        terminateCreateSession(socket(), setMultiplayerMenu)
        setJoinGameMenu(true)
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
            <button
              class="multiplayer-menu__button"
              onclick={action.onclick}
              disabled={action.disabled && action.disabled()}>
              {action.name}
            </button>
          )}
        </For>
      </div>
      {connecting() && (
        <p class="multiplayer-menu__text">Creating session...</p>
      )}
      {serverConnected() === false && (
        <p class="multiplayer-menu__text">
          There seems to be an issue connecting to the server. Please try again.
        </p>
      )}
    </div>
  )
}

export default MultiplayerMenu
