import { Component } from "solid-js"
import { gameStateProp } from "../../types/general"
import "./Game.scss"

const Game: Component<gameStateProp> = props => {
  return (
    <div class="game">
      <div class="game__opponent-hand">
        <p class="game__heading">Opponent's Hand</p>
        <div class="game__hand">{props.gameState().opponentHandUI}</div>
      </div>
      <div class="game__console">
        {props.gameState().question}
        {props.gameState().log}
        <div class="game__actions">
          {props.gameState().yesButton} {props.gameState().noButton}
        </div>
      </div>
      <div class="game__player-hand">
        <p class="game__heading">Your Hand</p>
        <div class="game__hand">{props.gameState().playerHandUI}</div>
      </div>
    </div>
  )
}

export default Game
