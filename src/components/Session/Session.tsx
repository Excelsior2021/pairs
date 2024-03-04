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
import deckFunctions from "../../gameFunctions/deckFunctions"
import pairs from "../../gameFunctions/pairsFunctions"
import { gameStateType, gameAction } from "../../types/general"
import { PlayerOutput } from "../../types/enums"
import "./Session.scss"

const initialGameState = {
  playerHandUI: () => [],
  playerPairsUI: () => [],
  opponentHandUI: () => [],
  opponentPairsUI: () => [],
  playerHandClickable: null,
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
      console.log(action.playerHandClickable)
      if (action.player && action.opponent && action.playerTurnEventHandler) {
        let playerHandUI = action.player.createHandUI(
          action.playerTurnEventHandler,
          action.playerHandClickable!
        )

        const opponentHandUI = deckFunctions.createHandUIback(
          action.opponent.hand
        )
        const opponentPairsUI = pairs.createPairsUI(action.opponent.pairs)

        if (!action.playerHandClickable)
          playerHandUI = action.player.createHandUI(
            null,
            action.playerHandClickable
          )

        return {
          ...state,
          deckUI: action.deck?.deckUI,
          playerHandUI,
          playerPairsUI: action.player.createPairsUI(),
          opponentHandUI,
          opponentPairsUI,
        }
      }
    }
    case "PLAYER_ACTION": {
      if (action.playerOutput !== PlayerOutput.NoOpponentMatch)
        setShowPlayerModal(true)

      let playerPairsLast: JSX.Element
      let playerPairsSecondLast: JSX.Element
      let playerHandLast: JSX.Element

      if (action.player!.pairs.length > 0) {
        playerPairsLast = pairs.createPairsUI([
          action.player!.pairs[action.player!.pairs.length - 1],
        ])

        playerPairsSecondLast = pairs.createPairsUI([
          action.player!.pairs[action.player!.pairs.length - 2],
        ])
      }

      if (action.player!.hand.length > 0) {
        playerHandLast = deckFunctions.createHandUI([
          action.player!.hand[action.player!.hand.length - 1],
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
      <Sidebar gameState={gameState} gameMode="single player" />
      <PlayerModal gameState={gameState} />
      <PairsModal gameState={gameState} />
      <QuitGameModal multiplayer={false} socket={null} />
    </div>
  )
}

export default Session
