import {
  PlayerModalHeading,
  PlayerModalSubHeading,
  PlayerOutput,
  Action,
} from "@enums"

import type { action, sessionState } from "@types"
import type { SetStoreFunction } from "solid-js/store"

export const singlePlayerReducer = (
  action: action,
  setState: SetStoreFunction<sessionState>,
  reconcile
) => {
  switch (action.type) {
    case Action.UPDATE: {
      setState({
        log: action.log,
        isOpponentTurn: action.isOpponentTurn,
        isPlayerTurn: action.isPlayerTurn,
        isDealFromDeck: action.isDealFromDeck,
        deckCount: action.deckCount,
      })
      setState("player", "hand", reconcile([...action.player!.hand]))
      setState("player", "pairs", reconcile([...action.player!.pairs]))

      setState("opponent", "hand", reconcile([...action.opponent!.hand]))
      setState("opponent", "pairs", reconcile([...action.opponent!.pairs]))
      break
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
      break
    }
    case Action.GAME_OVER: {
      setState({
        gameOver: true,
        log: "",
        outcome: action.outcome,
        deckCount: action.deckCount,
      })
      break
    }
  }
}
