import { setShowPairsModal } from "@/components/pairs-modal/pairs-modal"
import { setShowInstructions } from "@/components/instructions/instructions"
import { dispatchGameAction as dispatchGameActionMultiplayer } from "@/components/multiplayer-session/multiplayer-session"
import { setShowQuitGameModal } from "@/components/quit-game-modal/quit-game-modal"
import { GameAction, GameMode } from "@/enums"
import "./sidebar.scss"

import type { Accessor, Component } from "solid-js"
import type { gameStateType, playerRequest } from "../../../types"

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

const Sidebar: Component<props> = props => (
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
      <button class="sidebar__button" onclick={() => setShowPairsModal(true)}>
        pairs
      </button>
      <button class="sidebar__button" onclick={() => setShowInstructions(true)}>
        instructions
      </button>
      <button
        class="sidebar__button sidebar__button--quit"
        onclick={() => setShowQuitGameModal(true)}>
        quit
      </button>
    </div>
  </div>
)

export default Sidebar
