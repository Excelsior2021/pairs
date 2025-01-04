import { For, type Component } from "solid-js"
import Card from "@components/card/card"
import "./hand.scss"

import type { card } from "@types"

type props = {
  heading: string
  hand: card[]
  isPlayer?: true
  isPlayerTurn?: boolean
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
}

const Hand: Component<props> = props => (
  <div class="hand">
    <h3 class="hand__heading">{props.heading}</h3>
    <div class="hand__hand">
      <For each={props.hand}>
        {card => (
          <Card
            card={card}
            show={props.isPlayer}
            isPlayer={props.isPlayer}
            isPlayerTurn={props.isPlayerTurn}
            playerTurnHandler={
              props.isPlayer ? props.playerTurnHandler : undefined
            }
          />
        )}
      </For>
    </div>
  </div>
)

export default Hand
