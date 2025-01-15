import {
  PlayerModalHeading,
  PlayerModalSubHeading,
  PlayerOutput,
  Action,
} from "@enums"

import type { sessionState, action } from "@types"
import type { SetStoreFunction } from "solid-js/store"

export const singlePlayerReducer = (
  action: action,
  setState: SetStoreFunction<sessionState>
): void => {
  switch (action.type) {
    case Action.UPDATE: {
      setState({
        log: action.log,
        isOpponentTurn: action.isOpponentTurn,
        isPlayerTurn: action.isPlayerTurn,
        isDealFromDeck: action.isDealFromDeck,
        gameOver: false,
      })
      setState("player", "hand", [...action.player!.hand])
      setState("player", "pairs", [...action.player!.pairs])

      setState("opponent", "hand", [...action.opponent!.hand])
      setState("opponent", "pairs", [...action.opponent!.pairs])
      return
    }
    case Action.PLAYER_ACTION: {
      let playerModalHeading = PlayerModalHeading.Match
      let playerModalSubHeading
      switch (action.playerOutput) {
        case PlayerOutput.OpponentMatch: {
          playerModalSubHeading = PlayerModalSubHeading.Opponent
          break
        }
        case PlayerOutput.DeckMatch: {
          playerModalSubHeading = PlayerModalSubHeading.Deck
          break
        }
        case PlayerOutput.HandMatch: {
          playerModalSubHeading = PlayerModalSubHeading.Player
          break
        }
        case PlayerOutput.NoMatch: {
          playerModalHeading = PlayerModalHeading.NoMatch
          playerModalSubHeading = PlayerModalSubHeading.None
          break
        }
      }
      setState({
        showPlayerModal: true,
        playerOutput: action.playerOutput,
        playerModalHeading,
        playerModalSubHeading,
      })
      return
    }
    case Action.GAME_OVER: {
      if (action.gameOver)
        setState({
          outcome: action.outcome,
          gameOver: action.gameOver,
          log: "",
          deckCount: action.deckCount,
        })
      return
    }
    case Action.CLOSE_PLAYER_MODAL: {
      setState({
        showPlayerModal: false,
      })
      return
    }
  }
}
