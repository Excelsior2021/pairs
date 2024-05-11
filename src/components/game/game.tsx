import { Component, createEffect, createSignal } from "solid-js"
import Hand from "../hand/hand"
import { GameMode } from "../../enums"
import Card from "../../game-objects/card"
import "./game.scss"

import type { gameStateProp } from "../../../types"

const Game: Component<gameStateProp> = props => {
  const [deck, setDeck] = createSignal([] as Card[])

  createEffect(() => {
    if (props.gameState().gameMode === GameMode.SinglePlayer)
      setDeck(props.gameState().deck!.deck)
    if (props.gameState().gameMode === GameMode.Multiplayer)
      setDeck(props.gameState().shuffledDeck!)
  })

  const playerResponseHandler = (hasCard: boolean) =>
    props.gameState().playerResponseHandlerFactory!(hasCard)

  return (
    <div class="game">
      <Hand heading="Opponent Hand" hand={props.gameState().opponent!.hand} />
      <div class="game__console">
        {props.gameState().log}
        {props.gameState().gameOver && (
          <div class="game__game-over">
            <div class="game__outcome">
              <h2 class="game__game-over-heading">GAME OVER</h2>
              <p class="game__game-over-text">{props.gameState().outcome}</p>
            </div>
            <div class="game__stats">
              <h2 class="game__game-over-heading">STATS</h2>
              <p class="game__game-over-text">
                Your Pairs: {props.gameState().player!.pairs.length}
              </p>
              <p class="game__game-over-text">
                Opponent Pairs: {props.gameState().opponent!.pairs.length}
              </p>
              <p class="game__game-over-text">
                Remaining cards in deck: {deck()!.length}
              </p>
            </div>
          </div>
        )}
        {props.gameState().opponentTurn && (
          <div class="game__actions">
            <button
              class="game__button"
              onClick={() => playerResponseHandler(true)}>
              Yes
            </button>
            <button
              class="game__button"
              onClick={() => playerResponseHandler(false)}>
              No
            </button>
          </div>
        )}
      </div>
      <Hand
        heading="Your Hand"
        hand={props.gameState().player!.hand}
        player={true}
        playerTurnHandler={props.gameState().playerTurnHandlerFactory!}
        gameMode={props.gameState().gameMode}
      />
    </div>
  )
}

export default Game
