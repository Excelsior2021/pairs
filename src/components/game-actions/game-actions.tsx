import type { Component } from "solid-js"

type props = {
  playerResponseHandler: (hasCard: boolean) => void
}

const GameActions: Component<props> = props => (
  <div class="game__actions">
    <button
      class="game__button"
      onClick={() => props.playerResponseHandler(true)}>
      Yes
    </button>
    <button
      class="game__button"
      onClick={() => props.playerResponseHandler(false)}>
      No
    </button>
  </div>
)

export default GameActions
