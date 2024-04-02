import { Component } from "solid-js"
import { setShowPairsModal } from "../PairsModal/PairsModal"
import { setShowInstructions } from "../Instructions/Instructions"
import { setShowQuitGameModal } from "../QuitGameModal/QuitGameModal"
import { dispatchGameAction as dispatchGameActionMultiplayer } from "../MultiplayerSession/MultiplayerSession"
import { gameStateProp } from "../../types/general"
import { GameAction, GameMode } from "../../types/enums"
import "./Sidebar.scss"

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
