import { Component } from "solid-js"
import Hand from "../Hand/Hand"
import { gameStateMultiplayerProp, gameStateProp } from "../../types/general"
import "./Game.scss"
import { gameState } from "../Session/Session"

const Game: Component<gameStateProp | gameStateMultiplayerProp> = props => (
  <div class="game">
    <Hand heading="Opponent Hand" hand={props.gameState().opponent.hand} />
    <div class="game__console">
      {props.gameState().opponentRequest}
      {props.gameState().log}
      {false && (
        <p class="game__log">Do you have a {gameState().opponentRequest}?</p>
      )}
      <div class="game__actions">
        {props.gameState().yesButton} {props.gameState().noButton}
        {false && (
          <>
            <button
              class="game__button"
              onClick={() => playerResponseHandlerWrapper(true)}>
              Yes
            </button>
            <button
              class="game__button"
              onClick={() => playerResponseHandlerWrapper(false)}>
              No
            </button>
          </>
        )}
      </div>
    </div>
    <Hand
      heading="Your Hand"
      hand={props.gameState().player.hand}
      player={true}
      eventHandler={props.gameState().playerTurnHandler}
    />
  </div>
)

export default Game
