import { type Component } from "solid-js"
import type { Card as CardType } from "@/game-objects"
import "./card.scss"

type props = {
  card: CardType
  show?: boolean
  playerTurnHandler?: (playerHandEvent: MouseEvent) => void
  handleClick?: any
}

const Card: Component<props> = props => {
  return (
    <img
      class={props.playerTurnHandler! ? "card card--player" : "card"}
      id={props.show ? props.card.id : undefined}
      src={props.show ? props.card.img : `./cards/back.webp`}
      alt={props.show ? props.card.id : "card"}
      onclick={props.handleClick}
    />
  )
}

export default Card
