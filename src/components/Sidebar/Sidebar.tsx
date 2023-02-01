import { Component, createSignal } from "solid-js"
import { setShowPairsModal } from "../PairsModal/PairsModal"
import { setShowInstructions } from "../Instructions/Instructions"
import {
  setMultiplayerSessionStarted,
  setSinglePlayerStarted,
} from "../GameScreen/GameScreen"
import { gameDeckUI } from "../../gameFunctions/deckFunctions"
import "./Sidebar.scss"

export const [gameDeck, setGameDeck] = createSignal(gameDeckUI())

type sidebarProps = {
  gameMode: string
}

const Sidebar: Component<sidebarProps> = props => (
  <div class="sidebar">
    <div class="sidebar__deck">
      <p class="sidebar__heading">deck</p>
      {gameDeck()}
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
        onclick={() => {
          setSinglePlayerStarted(false)
          setMultiplayerSessionStarted(false)
          if (props.gameMode === "multiplayer") props.socket.disconnect()
        }}>
        quit
      </button>
    </div>
  </div>
)

export default Sidebar
