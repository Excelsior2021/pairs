import {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "@components/player-modal/player-modal"

import {
  PlayerMatchHeading,
  PlayerMatchSubHeading,
  PlayerOutput,
  GameAction,
} from "@enums"

import type { sessionState, gameAction } from "@types"

export const initialSessionState = {
  game: null,
  deck: null,
  player: null,
  opponent: null,
  isPlayerTurn: false,
  isOpponentTurn: false,
  isDealFromDeck: false,
  playerOutput: null,
  opponentRequest: null,
  log: "",
  outcome: "",
  gameOver: false,
  deckCount: null,
}

export const gameReducer = (
  state: sessionState,
  action: gameAction
): sessionState => {
  switch (action.type) {
    case GameAction.UPDATE: {
      return {
        ...state,
        deck: action.deck,
        player: action.player,
        opponent: action.opponent,
        isOpponentTurn: action.isOpponentTurn!,
        isPlayerTurn: action.isPlayerTurn!,
        isDealFromDeck: action.isDealFromDeck!,
        gameOver: false,
      }
    }
    case GameAction.PLAYER_ACTION: {
      if (action.playerOutput !== PlayerOutput.NoOpponentMatch)
        setShowPlayerModal(true)

      const updatePlayerOutputFactory = (
        playerMatchHeading: PlayerMatchHeading,
        playerMatchSubHeading: PlayerMatchSubHeading
      ) => {
        setMatchStatusHeading(playerMatchHeading)
        setMatchStatusSubHeading(playerMatchSubHeading)
        return {
          ...state,
          playerOutput: action.playerOutput!,
        }
      }

      switch (action.playerOutput) {
        case PlayerOutput.OpponentMatch: {
          return updatePlayerOutputFactory(
            PlayerMatchHeading.Match,
            PlayerMatchSubHeading.Opponent
          )
        }
        case PlayerOutput.DeckMatch: {
          return updatePlayerOutputFactory(
            PlayerMatchHeading.Match,
            PlayerMatchSubHeading.Deck
          )
        }
        case PlayerOutput.HandMatch: {
          return updatePlayerOutputFactory(
            PlayerMatchHeading.Match,
            PlayerMatchSubHeading.Player
          )
        }
        case PlayerOutput.NoMatch: {
          return updatePlayerOutputFactory(
            PlayerMatchHeading.NoMatch,
            PlayerMatchSubHeading.None
          )
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
      if (action.gameOver && state.deck)
        return {
          ...state,
          outcome: action.outcome!,
          gameOver: action.gameOver,
          log: "",
          deckCount: state.deck.deck.length,
        }
    }
    default:
      return state
  }
}
