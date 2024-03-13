import { Component, createSignal } from "solid-js"
import { setShowPairsModal } from "../PairsModal/PairsModal"
import { setShowInstructions } from "../Instructions/Instructions"
import { setShowQuitGameModal } from "../QuitGameModal/QuitGameModal"
import { gameDeckHandler } from "../../gameFunctions/deckFunctions"
import "./Sidebar.scss"

// export const [gameDeck, setGameDeck] = createSignal(gameDeckUI())

type sidebarProps = {
  gameMode: string
}

const Sidebar: Component<sidebarProps> = props => (
  <div class="sidebar">
    <div class="sidebar__deck">
      <p class="sidebar__heading">deck</p>
      <img
        class="card card--deck"
        src="./cards/back.png"
        alt="game deck"
        onclick={e =>
          gameDeckHandler(
            e,
            props.gameState().game,
            props.gameState().deck,
            props.gameState().player,
            props.gameState().opponent
          )
        }
      />
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
