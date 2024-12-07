import { For, type Accessor, type Component } from "solid-js"
import { setShowPairsModal } from "@components/pairs-modal/pairs-modal"
import { setShowInstructions } from "@components/instructions/instructions"
import { dispatchGameAction as dispatchGameActionMultiplayer } from "@components/multiplayer-session/multiplayer-session"
import { setShowQuitGameModal } from "@components/quit-game-modal/quit-game-modal"
import { GameAction, GameMode } from "@enums"
import "./sidebar.scss"

import type { gameStateType, playerRequest } from "@types"

type props = {
  gameState: Accessor<gameStateType>
}

export const gameDeckHandler = (
  deckClickable: boolean,
  gameMode: GameMode.SinglePlayer | GameMode.Multiplayer,
  deckHandlerFactory: () => void | null,
  playerRequest: playerRequest
) => {
  if (deckClickable) {
    if (gameMode === GameMode.SinglePlayer) deckHandlerFactory()
    if (gameMode === GameMode.Multiplayer)
      dispatchGameActionMultiplayer({
        type: GameAction.PLAYER_DEALT,
        playerRequest,
      })
  }
}

const Sidebar: Component<props> = props => {
  const actions = [
    {
      name: "pairs",
      onclick: () => setShowPairsModal(true),
    },
    {
      name: "instructions",
      onclick: () => setShowInstructions(true),
    },
    {
      name: "quit",
      onclick: () => setShowQuitGameModal(true),
      class: "sidebar__button--quit",
    },
  ]

  return (
    <div class="sidebar">
      <div class="sidebar__deck">
        <h3 class="sidebar__heading">deck</h3>
        <img
          class={
            props.gameState().deckClickable
              ? "card card--deck card--deck--active"
              : "card card--deck"
          }
          src="./cards/back.webp"
          alt="game deck"
          onclick={() =>
            gameDeckHandler(
              props.gameState().deckClickable,
              props.gameState().gameMode,
              props.gameState().deckHandlerFactory!,
              props.gameState().playerRequest!
            )
          }
        />
      </div>
      <div class="sidebar__actions">
        <h3 class="sidebar__heading">{props.gameState().gameMode}</h3>
        <For each={actions}>
          {action => (
            <button
              class={`sidebar__button ${action.class}`}
              onclick={action.onclick}>
              {action.name}
            </button>
          )}
        </For>
      </div>
    </div>
  )
}

export default Sidebar
