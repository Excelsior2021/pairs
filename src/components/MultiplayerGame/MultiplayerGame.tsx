import { Component } from "solid-js"
import "../Game/Game.scss"

const MultiplayerGame: Component = props => {
  console.log(props)
  return (
    <div class="game">
      <div class="game__opponent-hand">
        <p class="game__heading">Opponent's Hand</p>
        <div class="game__hand">{props.gameState().opponentHandUI()}</div>
      </div>
      <div class="game__console">
        {props.gameState().question}
        {props.gameState().log}
        {props.gameState().yesButton} {props.gameState().noButton}
      </div>
      <div class="game__player-hand">
        <p class="game__heading">Your Hand</p>
        <div class="game__hand">{props.gameState().playerHandUI()}</div>
      </div>
    </div>
  )
}

export default MultiplayerGame
