import { Component } from "solid-js"
import { setShowPairsModal } from "../pairs-modal/pairs-modal"
import { setShowInstructions } from "../instructions/instructions"
import { setShowQuitGameModal } from "../quit-game-modal/quit-game-modal"
import { dispatchGameAction as dispatchGameActionMultiplayer } from "../multiplayer-session/multiplayer-session"
import { GameAction, GameMode } from "../../enums"
import "./sidebar.scss"

import type { gameStateProp } from "../../../types"

const Sidebar: Component<gameStateProp> = props => {
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
        <p class="sidebar__heading">deck</p>
        <img
          class={
            props.gameState().deckClickable
              ? "card card--deck card--deck--active"
              : "card card--deck"
          }
          src="./cards/back.png"
          alt="game deck"
          onclick={gameDeckHandler}
        />
      </div>
      <div class="sidebar__actions">
        <p class="sidebar__heading">{props.gameState().gameMode}</p>
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
