import { For, type Component } from "solid-js"
import Card from "@/components/card/card"
import "./hand.scss"

import type { Card as CardType } from "@/game-objects"

type props = {
  heading: string
  hand: CardType[]
  player?: true
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
}

export const handleCardClick = (
  e: MouseEvent,
  playerTurnHandler: (playerHandEvent: MouseEvent) => void
) => {
  if (playerTurnHandler) playerTurnHandler(e)
}

const Hand: Component<props> = props => (
  <div class="hand">
    <h3 class="hand__heading">{props.heading}</h3>
    <div class="hand__hand">
      <For each={props.hand}>
        {card => (
          <Card
            card={card}
            show={props.player}
            playerTurnHandler={props.playerTurnHandler}
            handleClick={(e: MouseEvent) =>
              handleCardClick(e, props.playerTurnHandler!)
            }
          />
        )}
      </For>
    </div>
  </div>
)

export default Hand
