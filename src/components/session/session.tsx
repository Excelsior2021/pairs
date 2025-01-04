import { createReducer } from "@utils"
import Game from "@components/game/game"
import Sidebar from "@components/sidebar/sidebar"
import PlayerModal from "@components/player-modal/player-modal"
import PairsModal from "@components/pairs-modal/pairs-modal"
import QuitGameModal from "@components/quit-game-modal/quit-game-modal"
import {
  deckObj,
  Deck,
  Game as GameObject,
  Player,
  Opponent,
} from "@game-objects"
import { gameReducer, initialSessionState } from "./component-lib"
import "./session.scss"

import type { Component } from "solid-js"

const Session: Component = () => {
  const [sessionState, dispatchAction] = createReducer(
    gameReducer,
    initialSessionState
  )

  const deck = new Deck(deckObj, dispatchAction)
  const player = new Player(dispatchAction)
  const opponent = new Opponent(dispatchAction)
  const game = new GameObject(deck, player, opponent, dispatchAction)

  game.start()

  return (
    <div class="session">
      <Game
        player={sessionState().player!}
        opponent={sessionState().opponent!}
        isPlayerTurn={sessionState().isPlayerTurn!}
        isOpponentTurn={sessionState().isOpponentTurn}
        log={sessionState().log}
        gameOver={sessionState().gameOver}
        outcome={sessionState().outcome}
        deckCount={sessionState().deckCount}
        playerTurnHandler={game.playerTurnHandler}
        playerResponseHandler={game.playerResponseHandler}
      />
      <Sidebar
        isDealFromDeck={sessionState().isDealFromDeck}
        gameMode={sessionState().gameMode}
        playerDealsHandler={game.playerDealsHandler}
      />
      <PlayerModal
        player={sessionState().player!}
        playerOutput={sessionState().playerOutput!}
      />
      <PairsModal
        player={sessionState().player!}
        opponent={sessionState().opponent!}
      />
      <QuitGameModal />
    </div>
  )
}

export default Session
