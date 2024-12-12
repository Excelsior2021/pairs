import {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "@components/player-modal/player-modal"

import {
  PlayerMatchHeading,
  PlayerMatchSubHeading,
  PlayerOutput,
  GameMode,
  GameAction,
} from "@enums"

import type { gameStateType, gameAction } from "@types"

export const initialGameState = {
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

export const gameReducer = (
  state: gameStateType,
  action: gameAction
): gameStateType => {
  switch (action.action) {
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
