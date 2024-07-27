import { createEffect, createSignal } from "solid-js"
import Hand from "../hand/hand"
import GameActions from "../game-actions/game-actions"
import GameOver from "../game-over/game-over"
import { GameMode } from "../../enums"
import "./game.scss"

import type { Component } from "solid-js"
import type { gameStateProp } from "../../../types"

const Game: Component<gameStateProp> = props => {
  const [deckCount, setDeckCount] = createSignal<null | number>(null)

  createEffect(() => {
    if (props.gameState().gameOver) {
      if (props.gameState().gameMode === GameMode.SinglePlayer)
        setDeckCount(props.gameState().deck!.deck.length)
      if (props.gameState().gameMode === GameMode.Multiplayer)
        setDeckCount(props.gameState().shuffledDeck!.length)
    }
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
            deckAmount={deckCount()!}
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
      />
    </div>
  )
}

export default Game
