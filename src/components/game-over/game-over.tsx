import type { Component } from "solid-js"

type props = {
  outcome: string
  playerPairsCount: number
  opponentPairsCount: number
  deckCount: number | null
}

const GameOver: Component<props> = props => (
  <div class="game__game-over">
    <div class="game__outcome">
      <h2 class="game__game-over-heading">GAME OVER</h2>
      <p class="game__game-over-text">{props.outcome}</p>
    </div>
    <div class="game__stats">
      <h2 class="game__game-over-heading">STATS</h2>
      <p class="game__game-over-text">Your Pairs: {props.playerPairsCount}</p>
      <p class="game__game-over-text">
        Opponent Pairs: {props.opponentPairsCount}
      </p>
      <p class="game__game-over-text">
        Remaining cards in deck: {props.deckCount}
      </p>
    </div>
  </div>
)

export default GameOver
