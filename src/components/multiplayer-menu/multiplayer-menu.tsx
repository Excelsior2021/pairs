import { createSignal, For, type Setter, type Component } from "solid-js"
import { io } from "socket.io-client"
import { createSessionHandler, terminateCreateSession } from "./component-lib"
import { GameMode, PlayerID } from "@enums"
import "./multiplayer-menu.scss"

import type { multiplayerConfig } from "@types"

type props = {
  multiplayerConfig: multiplayerConfig
  setGameMode: Setter<GameMode>
  setJoinGameMenu: Setter<boolean>
  setMultiplayerMenu: Setter<boolean>
}

const MultiplayerMenu: Component<props> = props => {
  const [serverConnected, setServerConnected] = createSignal<false | null>(null)
  const [connecting, setConnecting] = createSignal(false)

  const actions = [
    {
      name: "create session",
      onclick: () =>
        createSessionHandler(
          io,
          props.multiplayerConfig,
          props.setGameMode,
          props.setMultiplayerMenu,
          setConnecting,
          setServerConnected,
          GameMode,
          PlayerID
        ),
      disabled: () => connecting(),
    },
    {
      name: "join session",
      onclick: () => {
        terminateCreateSession(
          props.multiplayerConfig.socket,
          props.setMultiplayerMenu
        )
        props.setJoinGameMenu(true)
      },
    },
    {
      name: "←",
      onclick: () =>
        terminateCreateSession(
          props.multiplayerConfig.socket,
          props.setMultiplayerMenu
        ),
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
