import { Component, createSignal } from "solid-js"
import { setShowPairsModal } from "../PairsModal/PairsModal"
import { setShowInstructions } from "../Instructions/Instructions"
import { setShowQuitGameModal } from "../QuitGameModal/QuitGameModal"
import { gameDeckUI } from "../../gameFunctions/deckFunctions"
import { gameStateType } from "../../types/general"
import "./Sidebar.scss"

export const [gameDeck, setGameDeck] = createSignal(gameDeckUI())

type sidebarProps = {
  gameState: gameStateType
  gameMode: string
}

const Sidebar: Component<sidebarProps> = props => (
  <div class="sidebar">
    <div class="sidebar__deck">
      <p class="sidebar__heading">deck</p>
      {props.gameState().deckUI}
    </div>
    <div class="sidebar__actions">
      <p class="sidebar__heading">{props.gameMode}</p>
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
