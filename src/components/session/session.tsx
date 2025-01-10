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
import { GameMode } from "@enums"
import "./session.scss"

import type { Component, Setter } from "solid-js"

type props = {
  showPairsModal: boolean
  showQuitGameModal: boolean
  setSessionStarted: Setter<boolean>
  setMultiplayerSessionStarted: Setter<boolean>
  setShowPairsModal: Setter<boolean>
  setShowInstructions: Setter<boolean>
  setShowQuitGameModal: Setter<boolean>
}

const Session: Component<props> = props => {
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
        gameMode={GameMode.SinglePlayer}
        playerDealsHandler={game.playerDealsHandler}
        setShowPairsModal={props.setShowPairsModal}
        setShowInstructions={props.setShowInstructions}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
      <PlayerModal
        player={sessionState().player!}
        playerOutput={sessionState().playerOutput!}
      />
      <PairsModal
        player={sessionState().player!}
        opponent={sessionState().opponent!}
        showPairsModal={props.showPairsModal}
        setShowPairsModal={props.setShowPairsModal}
      />
      <QuitGameModal
        showQuitGameModal={props.showQuitGameModal}
        setSessionStarted={props.setSessionStarted}
        setMultiplayerSessionStarted={props.setMultiplayerSessionStarted}
        setShowQuitGameModal={props.setShowQuitGameModal}
      />
    </div>
  )
}

export default Session
