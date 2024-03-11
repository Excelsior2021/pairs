import type { Component } from "solid-js"
import { For } from "solid-js"
import { handProp } from "../../types/general"
import "./Hand.scss"

const Hand: Component<handProp> = props => (
  <div class="hand">
    <p class="hand__heading">{props.heading}</p>
    <div class="hand__hand">
      <For each={props.hand}>
        {card => (
          <img
            class={props.eventHandler ? "card card--player" : "card"}
            id={props.player ? card.id : null}
            src={props.player ? card.img : `./cards/back.png`}
            alt={props.player ? card.id : "opponent card"}
            onclick={props.player ? props.eventHandler : null}
          />
        )}
      </For>
    </div>
  </div>
)

export default Hand
