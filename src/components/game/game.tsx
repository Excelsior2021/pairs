import { createEffect, createSignal } from "solid-js"
import Hand from "../hand/hand"
import GameActions from "../game-actions/game-actions"
import GameOver from "../game-over/game-over"
import { GameMode } from "../../enums"
import "./game.scss"

import type { Component } from "solid-js"
import type Card from "../../game-objects/card"
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
          <GameOver
            outcome={props.gameState().outcome}
            playerPairsAmount={props.gameState().player!.pairs.length}
            opponentPairsAmount={props.gameState().opponent!.pairs.length}
            deckAmount={deck()!.length}
          />
        )}
        {props.gameState().opponentTurn && (
          <GameActions playerResponseHandler={playerResponseHandler} />
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
