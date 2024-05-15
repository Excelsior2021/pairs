import { For } from "solid-js"
import "./hand.scss"

import type { Component } from "solid-js"
import type { handProp } from "../../../types"

const Hand: Component<handProp> = props => {
  const handleCardClick = (e: MouseEvent) => {
    if (props.playerTurnHandler) props.playerTurnHandler(e)
  }
  return (
    <div class="hand">
      <p class="hand__heading">{props.heading}</p>
      <div class="hand__hand">
        <For each={props.hand}>
          {card => (
            <img
              class={props.playerTurnHandler! ? "card card--player" : "card"}
              id={props.player ? card.id : undefined}
              src={props.player ? card.img : `./cards/back.png`}
              alt={props.player ? card.id : "opponent card"}
              onclick={handleCardClick}
            />
          )}
        </For>
      </div>
    </div>
  )
}

export default Hand
