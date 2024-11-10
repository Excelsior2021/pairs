import type { Component } from "solid-js"
import type { Card as CardType } from "@/game-objects"
import "./card.scss"

type props = {
  card: CardType
  show?: true
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
  handleClick?: (e: MouseEvent) => void
}

const Card: Component<props> = props => (
  <img
    class={props.playerTurnHandler! ? "card card--player" : "card"}
    id={props.show ? props.card.id : undefined}
    src={props.show ? props.card.img : "./cards/back.webp"}
    alt={props.show ? props.card.id : "card"}
    onclick={props.handleClick}
  />
)

export default Card
