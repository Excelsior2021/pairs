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
import { playerTurnHandler } from "../../gameFunctions/playerFunctions"
import { GameMode } from "../../types/enums"
import "./Session.scss"

const initialGameState = {
  gameMode: GameMode.SinglePlayer,
  game: null,
  deck: null,
  player: null,
  opponent: null,
  playerHandClickable: false,
  playerTurnHandler: null,
  playerChosenCardEvent: null,
  playerOutput: null,
  opponentTurn: false,
  opponentRequest: null,
  log: "",
  outcome: "",
  gameOver: false,
  deckClickable: false,
}

const gameReducer = (
  state: gameStateType,
  action: gameAction
): gameStateType => {
  switch (action.type) {
    case "UPDATE": {
      let playerTurnHandler
      if (action.playerHandClickable)
        playerTurnHandler = action.playerTurnHandlerWrapper!
      else playerTurnHandler = null

      return {
        ...state,
        game: action.game!,
        deck: action.deck!,
        player: action.player!,
        opponent: action.opponent!,
        playerTurnHandler,
        playerChosenCardEvent: action.playerChosenCardEvent!,
        opponentTurn: action.opponentTurn!,
        opponentRequest: action.opponentRequest!,
        deckClickable: action.deckClickable!,
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
    case "GAME_LOG": {
      return {
        ...state,
        log: action.log!,
      }
    }
    case "GAME_OVER": {
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

export const [gameState, dispatchGameAction] = createReducer(
  gameReducer,
  initialGameState
)

const Session: Component = () => {
  new GameObject().start(playerTurnHandler, dispatchGameAction)
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
