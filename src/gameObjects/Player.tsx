import { For, JSX } from "solid-js"
import Card from "./Card"
import { playerHandEventType } from "../types/general"

export default class Player {
  hand: Card[]
  pairs: Card[]
  lastCardHand: JSX.Element
  lastTwoCardsPairs: JSX.Element
  secondLastCardPairs: JSX.Element

  constructor() {
    this.hand = []
    this.pairs = []
    this.lastCardHand = () =>
      this.createHandUI(undefined, undefined, [this.hand[this.hand.length - 1]])
    this.lastTwoCardsPairs = () =>
      this.createHandUI(undefined, undefined, [
        this.pairs[this.pairs.length - 1],
        this.pairs[this.pairs.length - 2],
      ])
  }

  createHandUI(
    eventHandler:
      | ((playerHandEvent: playerHandEventType) => void)
      | null = null,
    clickable: boolean = false,
    hand: Card[] = this.hand
  ) {
    return (
      <For each={hand}>
        {card => (
          <img
            class={clickable ? "card card--player" : "card"}
            id={card.id}
            src={card.img}
            alt={card.id}
            onclick={eventHandler!}
          />
        )}
      </For>
    )
  }

  createPairsUI() {
    return (
      <For each={this.pairs}>
        {card => <img id={card.id} class="card" src={card.img} alt={card.id} />}
      </For>
    )
  }
}
