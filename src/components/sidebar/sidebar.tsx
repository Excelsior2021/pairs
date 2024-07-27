import { setShowPairsModal } from "../pairs-modal/pairs-modal"
import { setShowInstructions } from "../instructions/instructions"
import { dispatchGameAction as dispatchGameActionMultiplayer } from "../multiplayer-session/multiplayer-session"
import { setShowQuitGameModal } from "../quit-game-modal/quit-game-modal"
import { GameAction, GameMode } from "../../enums"
import "./sidebar.scss"

import type { Accessor, Component } from "solid-js"
import type { gameStateType } from "../../../types"

type props = {
  gameState: Accessor<gameStateType>
}

const Sidebar: Component<props> = props => {
  const gameDeckHandler = () => {
    if (props.gameState().deckClickable) {
      if (props.gameState().gameMode === GameMode.SinglePlayer)
        props.gameState().deckHandlerFactory!()
      if (props.gameState().gameMode === GameMode.Multiplayer)
        dispatchGameActionMultiplayer({
          type: GameAction.PLAYER_DEALT,
          playerRequest: props.gameState().playerRequest,
        })
    }
  }
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
          onclick={gameDeckHandler}
        />
      </div>
      <div class="sidebar__actions">
        <h3 class="sidebar__heading">{props.gameState().gameMode}</h3>
        <button class="sidebar__button" onclick={() => setShowPairsModal(true)}>
          pairs
        </button>
        <button
          class="sidebar__button"
          onclick={() => setShowInstructions(true)}>
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
}

export default Sidebar
