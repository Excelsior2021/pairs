import { For, type Component } from "solid-js"
import "./hand.scss"

import type Card from "@/game-objects/card"

type prop = {
  heading: string
  hand: Card[]
  player?: boolean
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
}

export const handleCardClick = (
  e: MouseEvent,
  playerTurnHandler: (playerHandEvent: MouseEvent) => void
) => {
  if (playerTurnHandler) playerTurnHandler(e)
}

const Hand: Component<prop> = props => (
  <div class="hand">
    <h3 class="hand__heading">{props.heading}</h3>
    <div class="hand__hand">
      <For each={props.hand}>
        {card => (
          <img
            class={props.playerTurnHandler! ? "card card--player" : "card"}
            id={props.player ? card.id : undefined}
            src={props.player ? card.img : `./cards/back.webp`}
            alt={props.player ? card.id : "opponent card"}
            onclick={e => handleCardClick(e, props.playerTurnHandler!)}
          />
        )}
      </For>
    </div>
  </div>
)

export default Hand
