import {
  PlayerModalHeading,
  PlayerModalSubHeading,
  PlayerOutput,
  Action,
} from "@enums"

import type { sessionState, action } from "@types"

export const singlePlayerReducer = (
  state: sessionState,
  action: action
): sessionState => {
  switch (action.type) {
    case Action.UPDATE: {
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
    case Action.PLAYER_ACTION: {
      if (action.playerOutput === PlayerOutput.NoOpponentMatch)
        return {
          ...state,
        }

      if (action.playerOutput !== undefined) {
        state.showPlayerModal = true
        state.playerOutput = action.playerOutput
        state.playerModalHeading = PlayerModalHeading.Match //matches 3 out of 4
        switch (action.playerOutput) {
          case PlayerOutput.OpponentMatch: {
            return {
              ...state,
              playerModalSubHeading: PlayerModalSubHeading.Opponent,
            }
          }
          case PlayerOutput.DeckMatch: {
            return {
              ...state,
              playerModalSubHeading: PlayerModalSubHeading.Deck,
            }
          }
          case PlayerOutput.HandMatch: {
            return {
              ...state,
              playerModalSubHeading: PlayerModalSubHeading.Player,
            }
          }
          case PlayerOutput.NoMatch: {
            return {
              ...state,
              playerModalHeading: PlayerModalHeading.NoMatch,
              playerModalSubHeading: PlayerModalSubHeading.None,
            }
          }
          default:
            return state
        }
      }
      return {
        ...state,
      }
    }
    case Action.GAME_LOG: {
      return {
        ...state,
        log: action.log!,
      }
    }
    case Action.GAME_OVER: {
      if (action.gameOver && state.deck)
        return {
          ...state,
          outcome: action.outcome!,
          gameOver: action.gameOver,
          log: "",
          deckCount: state.deck.deck.length,
        }
    }
    case Action.CLOSE_PLAYER_MODAL: {
      return {
        ...state,
        showPlayerModal: false,
      }
    }
    default:
      return state
  }
}
