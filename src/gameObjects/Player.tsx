import { For } from "solid-js"
import Card from "./Card"
import { playerHandEventType } from "../types/general"

export default class Player {
  hand: Card[]
  pairs: Card[]

  constructor() {
    this.hand = []
    this.pairs = []
  }

  createHandUI(
    eventHandler: (playerHandEvent: playerHandEventType) => void,
    clickable: boolean
  ) {
    return (
      <For each={this.hand}>
        {card => (
          <img
            class={clickable ? "card card--player" : "card"}
            id={card.id}
            src={card.img}
            alt={card.id}
            onclick={eventHandler}
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
