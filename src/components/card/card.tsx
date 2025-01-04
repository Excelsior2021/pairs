import type { Component } from "solid-js"
import type { card } from "@types"
import "./card.scss"

type props = {
  card: card
  show?: true
  isPlayer?: true
  isPlayerTurn?: boolean
  playerTurnHandler?: (e: MouseEvent) => void
}

const Card: Component<props> = props => (
  <img
    class={props.isPlayerTurn ? "card card--player" : "card"}
    id={props.show ? props.card.id : undefined}
    src={props.show ? props.card.img : "./cards/back.webp"}
    alt={props.show ? props.card.id : "card"}
    onclick={
      props.isPlayer
        ? chosenCard => {
            if (props.isPlayerTurn && props.playerTurnHandler)
              props.playerTurnHandler(chosenCard)
          }
        : undefined
    }
  />
)

export default Card
