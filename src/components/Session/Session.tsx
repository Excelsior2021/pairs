import { Component } from "solid-js"
import { createReducer } from "@solid-primitives/memo"
import Game from "../Game/Game"
import Sidebar from "../Sidebar/Sidebar"
import PlayerModal from "../PlayerModal/PlayerModal"
import PairsModal from "../PairsModal/PairsModal"
import deck from "../../gameFunctions/deckFunctions"
import pairs from "../../gameFunctions/pairsFunctions"
import { setShowPlayerModal } from "../PlayerModal/PlayerModal"
import { setMatch } from "../PlayerModal/PlayerModal"
import { card, gameStateType, gameAction } from "../../types/general"
import "./Session.scss"

const intialGameState = {
  playerHandState: null,
  playerHandState2: null,
  playerPairsState: null,
  opponentHandState: null,
  opponentPairsState: null,
}

const newDeck: card[] = deck.createDeck()
const shuffledDeck: card[] = deck.shuffleDeck(newDeck)

const gameReducer = (state: gameStateType, action: gameAction) => {
  switch (action.type) {
    case "UPDATE": {
      if (
        action.playerHand &&
        action.playerPairs &&
        action.opponentHand &&
        action.opponentPairs &&
        action.playerTurnHandler
      ) {
        let playerHandUI = deck.createPlayerHandUI(
          action.playerHand,
          action.playerTurnHandler
        )
        let playerHandUI2 = deck.createPlayerHandUI(
          action.playerHand,
          action.playerTurnHandler
        )
        const playerPairsUI = pairs.createPairsUI(action.playerPairs)

        const opponentHandUI = deck.createHandUIback(action.opponentHand)
        const opponentPairsUI = pairs.createPairsUI(action.opponentPairs)

        if (action.playerHandUnclickable) {
          playerHandUI = deck.createHandUI(action.playerHand)
          playerHandUI2 = deck.createHandUI(action.playerHand)
        }

        return {
          ...state,
          playerHandState: { data: action.playerHand, UI: playerHandUI },
          playerHandState2: { data: action.playerHand, UI: playerHandUI2 },
          playerPairsState: { data: action.playerPairs, UI: playerPairsUI },
          opponentHandState: { data: action.opponentHand, UI: opponentHandUI },
          opponentPairsState: {
            data: action.opponentPairs,
            UI: opponentPairsUI,
          },
        }
      }
    }
    case "PLAYER_ACTION": {
      if (action.playerOutput !== false) setShowPlayerModal(true)

      switch (action.playerOutput) {
        case 0: {
          setMatch("Match (Opponent's Hand)")
          return { ...state, playerOutput: action.playerOutput }
        }
        case 1: {
          setMatch("Match (Dealt Card)")
          return { ...state, playerOutput: action.playerOutput }
        }
        case 2: {
          setMatch("Match (Your Hand)")
          return { ...state, playerOutput: action.playerOutput }
        }
        case 3: {
          setMatch("No Match")
          return { ...state, playerOutput: action.playerOutput }
        }
        default:
          return { ...state, playerOutput: action.playerOutput }
      }
    }
    case "PLAYER_ANSWER": {
      if (action.playerHand && action.playerAnswerHandler) {
        const playerHandUI = deck.createPlayerHandUI(
          action.playerHand,
          action.playerAnswerHandler
        )
        return {
          ...state,
          playerHandState: { ...state.playerHandState, UI: playerHandUI },
        }
      }
    }
    case "GAME_LOG": {
      const question = action.question
      const yesButton = action.yesButton
      const noButton = action.noButton
      const log = action.log
      return { ...state, question, yesButton, noButton, log }
    }
    case "GAME_OVER": {
      return state
    }
    default:
      return intialGameState
  }
}

export const [gameState, dispatchGameAction] = createReducer(
  gameReducer as () => gameStateType,
  intialGameState as gameStateType
)

const Session: Component = () => {
  pairs.startGame(shuffledDeck)
  return (
    <div class="session">
      <Game gameState={gameState} />
      <Sidebar />
      <PlayerModal gameState={gameState} />
      <PairsModal gameState={gameState} />
    </div>
  )
}

export default Session
