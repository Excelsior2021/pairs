import { For, type Component } from "solid-js"
import { setShowPairsModal } from "@components/pairs-modal/pairs-modal"
import { setShowInstructions } from "@components/instructions/instructions"
import { setShowQuitGameModal } from "@components/quit-game-modal/quit-game-modal"
import "./sidebar.scss"

import type { GameMode } from "@enums"

type props = {
  isDealFromDeck: boolean
  gameMode: GameMode
  playerDealsHandler: (() => void) | null
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
            props.isDealFromDeck
              ? "card card--deck card--deck--active"
              : "card card--deck"
          }
          src="./cards/back.webp"
          alt="game deck"
          onclick={() => {
            if (props.isDealFromDeck && props.playerDealsHandler)
              props.playerDealsHandler()
          }}
        />
      </div>
      <div class="sidebar__actions">
        <h3 class="sidebar__heading">{props.gameMode}</h3>
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
