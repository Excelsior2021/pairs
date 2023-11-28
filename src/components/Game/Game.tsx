import { Component } from "solid-js"
import Hand from "../Hand/Hand"
import { gameStateMultiplayerProp, gameStateProp } from "../../types/general"
import "./Game.scss"

const Game: Component<gameStateProp | gameStateMultiplayerProp> = props => (
  <div class="game">
    <Hand heading="Opponent Hand" hand={props.gameState().opponentHandUI} />
    <div class="game__console">
      {props.gameState().question}
      {props.gameState().log}
      <div class="game__actions">
        {props.gameState().yesButton} {props.gameState().noButton}
      </div>
    </div>
    <Hand heading="Your Hand" hand={props.gameState().playerHandUI} />
  </div>
)

export default Game
