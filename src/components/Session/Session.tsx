import { Component, JSX } from "solid-js"
import { createReducer } from "@solid-primitives/memo"
import Game from "../Game/Game"
import Sidebar from "../Sidebar/Sidebar"
import PlayerModal, {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "../PlayerModal/PlayerModal"
import PairsModal from "../PairsModal/PairsModal"
import QuitGameModal from "../QuitGameModal/QuitGameModal"
import deck from "../../gameFunctions/deckFunctions"
import pairs from "../../gameFunctions/pairsFunctions"
import { gameStateType, gameAction, PlayerOutput } from "../../types/general"
import "./Session.scss"

const initialGameState = {
  playerHandUI: () => [],
  playerPairsUI: () => [],
  opponentHandUI: () => [],
  opponentPairsUI: () => [],
  playerHandUnclickable: null,
  playerTurnEventHandler: null,
  playerAnswerHandler: null,
  playerOutput: null,
  question: null,
  yesButton: null,
  noButton: null,
  log: null,
  playerHandLast: () => [],
  playerPairsLast: () => [],
  playerPairsSecondLast: () => [],
}

const gameReducer = (
  state: gameStateType,
  action: gameAction
): gameStateType => {
  switch (action.type) {
    case "UPDATE": {
      if (
        action.playerHand &&
        action.playerPairs &&
        action.opponentHand &&
        action.opponentPairs &&
        action.playerTurnEventHandler
      ) {
        let playerHandUI = deck.createPlayerHandUI(
          action.playerHand,
          action.playerTurnEventHandler
        )
        const playerPairsUI = pairs.createPairsUI(action.playerPairs)

        const opponentHandUI = deck.createHandUIback(action.opponentHand)
        const opponentPairsUI = pairs.createPairsUI(action.opponentPairs)

        if (action.playerHandUnclickable) {
          playerHandUI = deck.createHandUI(action.playerHand)
        }

        return {
          ...state,
          playerHandUI,
          playerPairsUI,
          opponentHandUI,
          opponentPairsUI,
        }
      }
    }
    case "PLAYER_ACTION": {
      if (action.playerOutput !== false) setShowPlayerModal(true)

      let playerPairsLast: JSX.Element
      let playerPairsSecondLast: JSX.Element
      let playerHandLast: JSX.Element

      if (action.playerPairs!.length > 0) {
        playerPairsLast = pairs.createPairsUI([
          action.playerPairs![action.playerPairs!.length - 1],
        ])

        playerPairsSecondLast = pairs.createPairsUI([
          action.playerPairs![action.playerPairs!.length - 2],
        ])
      }

      if (action.playerHand!.length > 0) {
        playerHandLast = deck.createHandUI([
          action.playerHand![action.playerHand!.length - 1],
        ])
      }

      switch (action.playerOutput) {
        case PlayerOutput.OpponentMatch: {
          setMatchStatusHeading("match")
          setMatchStatusSubHeading("opponent hand")
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerPairsLast,
            playerPairsSecondLast,
          }
        }
        case PlayerOutput.DeckMatch: {
          setMatchStatusHeading("match")
          setMatchStatusSubHeading("dealt card")
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerPairsLast,
            playerPairsSecondLast,
          }
        }
        case PlayerOutput.HandMatch: {
          setMatchStatusHeading("match")
          setMatchStatusSubHeading("your hand")
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerPairsLast,
            playerPairsSecondLast,
          }
        }
        case PlayerOutput.NoMatch: {
          setMatchStatusHeading("no match")
          setMatchStatusSubHeading("")
          return { ...state, playerOutput: action.playerOutput, playerHandLast }
        }
        default:
          return state
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
      return state
  }
}

export const [gameState, dispatchGameAction] = createReducer(
  gameReducer,
  initialGameState
)

const Session: Component = () => {
  pairs.startGame()
  return (
    <div class="session">
      <Game gameState={gameState} />
      <Sidebar gameMode="single player" />
      <PlayerModal gameState={gameState} />
      <PairsModal gameState={gameState} />
      <QuitGameModal multiplayer={false} socket={null} />
    </div>
  )
}

export default Session
