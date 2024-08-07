import { createReducer } from "@solid-primitives/memo"
import Game from "../game/game"
import Sidebar from "../sidebar/sidebar"
import PlayerModal, {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "../player-modal/player-modal"
import PairsModal from "../pairs-modal/pairs-modal"
import QuitGameModal from "../quit-game-modal/quit-game-modal"
import GameObject from "../../game-objects/game"
import {
  PlayerMatchHeading,
  PlayerMatchSubHeading,
  PlayerOutput,
  GameMode,
  GameAction,
} from "../../enums"
import "./session.scss"

import Deck from "../../game-objects/deck"
import Player from "../../game-objects/player"
import Opponent from "../../game-objects/opponent"
import Card from "../../game-objects/card"

import type { Component } from "solid-js"
import type { gameStateType, gameAction } from "../../../types"

const initialGameState = {
  gameMode: GameMode.SinglePlayer,
  game: null,
  deck: null,
  player: null,
  opponent: null,
  playerTurnHandlerFactory: null,
  playerHandClickable: false,
  playerResponseHandlerFactory: null,
  deckHandlerFactory: null,
  deckClickable: false,
  playerChosenCardEvent: null,
  playerOutput: null,
  opponentTurn: false,
  opponentRequest: null,
  log: "",
  outcome: "",
  gameOver: false,
}

const gameReducer = (
  state: gameStateType,
  action: gameAction
): gameStateType => {
  switch (action.type) {
    case GameAction.UPDATE: {
      if (action.playerHandClickable)
        state.playerTurnHandlerFactory = action.playerTurnHandlerFactory
      else state.playerTurnHandlerFactory = null

      if (action.deckClickable)
        state.deckHandlerFactory = action.deckHandlerFactory
      else state.deckHandlerFactory = null

      return {
        ...state,
        deck: action.deck!,
        player: action.player!,
        opponent: action.opponent!,
        opponentTurn: action.opponentTurn!,
        deckClickable: action.deckClickable!,
        playerResponseHandlerFactory: action.playerResponseHandlerFactory,
        gameOver: false,
      }
    }
    case GameAction.PLAYER_ACTION: {
      if (action.playerOutput !== PlayerOutput.NoOpponentMatch)
        setShowPlayerModal(true)

      switch (action.playerOutput) {
        case PlayerOutput.OpponentMatch: {
          setMatchStatusHeading(PlayerMatchHeading.Match)
          setMatchStatusSubHeading(PlayerMatchSubHeading.Opponent)
          return {
            ...state,
            playerOutput: action.playerOutput,
          }
        }
        case PlayerOutput.DeckMatch: {
          setMatchStatusHeading(PlayerMatchHeading.Match)
          setMatchStatusSubHeading(PlayerMatchSubHeading.Deck)
          return {
            ...state,
            playerOutput: action.playerOutput,
          }
        }
        case PlayerOutput.HandMatch: {
          setMatchStatusHeading(PlayerMatchHeading.Match)
          setMatchStatusSubHeading(PlayerMatchSubHeading.Player)
          return {
            ...state,
            playerOutput: action.playerOutput,
          }
        }
        case PlayerOutput.NoMatch: {
          setMatchStatusHeading(PlayerMatchHeading.NoMatch)
          setMatchStatusSubHeading(PlayerMatchSubHeading.None)
          return {
            ...state,
            playerOutput: action.playerOutput,
          }
        }
        default:
          return state
      }
    }
    case GameAction.GAME_LOG: {
      return {
        ...state,
        log: action.log!,
      }
    }
    case GameAction.GAME_OVER: {
      if (action.gameOver)
        return {
          ...state,
          outcome: action.outcome!,
          gameOver: action.gameOver!,
          log: "",
        }
    }
    default:
      return state
  }
}

const Session: Component = () => {
  const [gameState, dispatchGameAction] = createReducer(
    gameReducer,
    initialGameState
  )

  const deck = new Deck(Card, dispatchGameAction)
  const player = new Player(dispatchGameAction)
  const opponent = new Opponent(dispatchGameAction)
  const game = new GameObject(deck, player, opponent, dispatchGameAction)

  game.start()

  return (
    <div class="session">
      <Game gameState={gameState} />
      <Sidebar gameState={gameState} />
      <PlayerModal gameState={gameState} />
      <PairsModal gameState={gameState} />
      <QuitGameModal multiplayer={false} socket={null} />
    </div>
  )
}

export default Session
