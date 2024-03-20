import { Component, createEffect, createSignal } from "solid-js"
import Hand from "../Hand/Hand"
import { gameStateProp } from "../../types/general"
import { playerResponseHandler } from "../../gameFunctions/playerFunctions"
import { playerResponseHandler as playerResponseHandlerMultiplayer } from "../../gameFunctions/multiplayerPlayerFunctions"
import { GameMode } from "../../types/enums"
import "./Game.scss"

const Game: Component<gameStateProp> = props => {
  const [deck, setDeck] = createSignal(null)

  createEffect(() => {
    if (props.gameState().deck) setDeck(props.gameState().deck.deck)
    else if (props.gameState().shuffledDeck)
      setDeck(props.gameState().shuffledDeck)
  })

  const handlePlayerResponse = (hasCard: boolean) => {
    if (props.gameState().gameMode === GameMode.SinglePlayer)
      playerResponseHandler(
        hasCard,
        props.gameState().game,
        props.gameState().deck,
        props.gameState().player,
        props.gameState().opponent,
        props.gameState().opponentRequest
      )
    if (props.gameState().gameMode === GameMode.Multiplayer) {
      playerResponseHandlerMultiplayer(
        hasCard,
        props.gameState().opponentRequest,
        props.gameState().player,
        props.gameState().clientPlayer
      )
    }
  }

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
              onClick={() => handlePlayerResponse(true)}>
              Yes
            </button>
            <button
              class="game__button"
              onClick={() => handlePlayerResponse(false)}>
              No
            </button>
          </div>
        )}
      </div>
      <Hand
        heading="Your Hand"
        hand={props.gameState().player!.hand}
        player={true}
        playerTurnHandler={props.gameState().playerTurnHandler}
        gameMode={props.gameState().gameMode}
      />
    </div>
  )
}

export default Game
