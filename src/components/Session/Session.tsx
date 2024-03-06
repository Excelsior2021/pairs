import { Component } from "solid-js"
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
import GameObject from "../../gameObjects/Game"
import { gameStateType, gameAction } from "../../types/general"
import {
  PlayerMatchHeading,
  PlayerMatchSubHeading,
  PlayerOutput,
} from "../../types/enums"
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
  playerPairsLastTwo: () => [],
  playerPairsSecondLast: () => [],
}

const gameReducer = (
  state: gameStateType,
  action: gameAction
): gameStateType => {
  switch (action.type) {
    case "UPDATE": {
      if (action.player && action.opponent) {
        let playerHandUI
        if (action.playerHandClickable)
          playerHandUI = action.player.createHandUI(
            action.playerTurnEventHandler,
            action.playerHandClickable
          )
        else {
          playerHandUI = action.player.createHandUI(
            undefined,
            action.playerHandClickable
          )
        }

        return {
          ...state,
          playerHandUI,
          playerPairsUI: action.player.createPairsUI(),
          opponentHandUI: action.opponent.createHandUI(),
          opponentPairsUI: action.opponent.createPairsUI(),
        }
      }
    }
    case "PLAYER_ACTION": {
      if (action.playerOutput !== PlayerOutput.NoOpponentMatch)
        setShowPlayerModal(true)

      switch (action.playerOutput) {
        case PlayerOutput.OpponentMatch: {
          setMatchStatusHeading(PlayerMatchHeading.Match)
          setMatchStatusSubHeading(PlayerMatchSubHeading.Opponent)
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerPairsLastTwo: action.player!.lastTwoCardsPairs,
          }
        }
        case PlayerOutput.DeckMatch: {
          setMatchStatusHeading(PlayerMatchHeading.Match)
          setMatchStatusSubHeading(PlayerMatchSubHeading.Deck)
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerPairsLastTwo: action.player!.lastTwoCardsPairs,
          }
        }
        case PlayerOutput.HandMatch: {
          setMatchStatusHeading(PlayerMatchHeading.Match)
          setMatchStatusSubHeading(PlayerMatchSubHeading.Player)
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerPairsLastTwo: action.player!.lastTwoCardsPairs,
          }
        }
        case PlayerOutput.NoMatch: {
          setMatchStatusHeading(PlayerMatchHeading.NoMatch)
          setMatchStatusSubHeading(PlayerMatchSubHeading.None)
          return {
            ...state,
            playerOutput: action.playerOutput,
            playerHandLast: action.player!.lastCardHand,
          }
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
  new GameObject().start(dispatchGameAction)
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
