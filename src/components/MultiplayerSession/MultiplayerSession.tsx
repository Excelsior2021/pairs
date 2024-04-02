import { Component, createSignal, Show } from "solid-js"
import { createReducer } from "@solid-primitives/memo"
import Game from "../Game/Game"
import Sidebar from "../Sidebar/Sidebar"
import CreateGame from "../CreateGame/CreateGame"
import PairsModal from "../PairsModal/PairsModal"
import QuitGameModal from "../QuitGameModal/QuitGameModal"
import PlayerModal, {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "../PlayerModal/PlayerModal"
import { io } from "socket.io-client"
import Player from "../../gameObjects/Player"
import {
  playerTurnHandler,
  playerResponseHandler,
} from "../../gameFunctions/multiplayerEventFunctions"
import {
  clientStateMutiplayer,
  gameActionMultiplayer,
  gameStateType,
  multiplayerSessionProps,
} from "../../types/general"
import { PlayerOutput, GameMode, Outcome, GameAction } from "../../types/enums"
import "../Session/Session.scss"

const initialGameState = {
  gameMode: GameMode.Multiplayer,
  player: null,
  opponent: null,
  shuffledDeck: null,
  playerTurnHandlerFactory: null,
  playerOutput: null,
  log: "",
  outcome: "",
  socket: io(),
  clientPlayer: 0,
  sessionID: "",
  gameState: null,
  opponentTurn: false,
  playerTurn: null,
  gameOver: false,
  deckClickable: false,
}

const multiplayerReducer = (
  state: gameStateType,
  action: gameActionMultiplayer
): gameStateType => {
  switch (action.type) {
    case GameAction.START_SESSION: {
      return {
        ...state,
        socket: action.socket!,
      }
    }
    case GameAction.CREATE_SESSION: {
      if (state.socket) state.socket.emit("create_session", action.sessionID)
      return {
        ...state,
        sessionID: action.sessionID,
      }
    }
    case GameAction.JOIN_SESSION: {
      return {
        ...state,
        sessionID: action.sessionID,
      }
    }
    case GameAction.UPDATE: {
      if (state.opponentTurn) state.opponentTurn = false
      const { player1, player2, shuffledDeck } = action.serverState!

      let player: Player | null = null
      let opponent: Player | null = null
      let log: string = ""
      let gameState: clientStateMutiplayer | null = null
      let clientPlayer: number
      let playerTurnHandlerFactory:
        | ((playerHandEvent: MouseEvent) => void)
        | null = null

      switch (action.clientPlayer) {
        case 1: {
          player = player1
          opponent = player2

          gameState = {
            player,
            opponent,
            shuffledDeck,
          }

          log = action.player1Log || state.log
          clientPlayer = action.clientPlayer
          break
        }
        case 2: {
          player = player2
          opponent = player1

          gameState = {
            player,
            opponent,
            shuffledDeck,
          }

          log = action.player2Log || state.log
          clientPlayer = action.clientPlayer
          break
        }
      }

      if (action.clientPlayer === action.playerTurn)
        playerTurnHandlerFactory = (playerHandEvent: MouseEvent) =>
          playerTurnHandler(playerHandEvent, player, clientPlayer)

      return {
        ...state,
        player,
        opponent,
        shuffledDeck,
        log,
        gameState,
        clientPlayer: action.clientPlayer!,
        playerTurnHandlerFactory,
      }
    }
    case GameAction.PLAYER_REQUEST: {
      if (state.socket)
        state.socket.emit(
          "player_request",
          state.clientPlayer,
          action.playerRequest!.card,
          state.sessionID
        )
      const log = "Waiting for you opponent to respond..."

      return {
        ...state,
        log,
        playerTurnHandlerFactory: null,
      }
    }
    case GameAction.PLAYER_RESPONSE: {
      const { card } = action.opponentRequestMultiplayer! //opponentRequest
      let opponentTurn = false

      if (state.clientPlayer === 1) opponentTurn = true
      if (state.clientPlayer === 2) opponentTurn = true

      const log = `Do you have a ${card.value}?`

      const playerResponseHandlerFactory = (hasCard: boolean) =>
        playerResponseHandler(
          hasCard,
          action.opponentRequestMultiplayer!,
          state.player!,
          state.clientPlayer!
        )

      return {
        ...state,
        log,
        playerResponseHandlerFactory,
        opponentRequestMultiplayer: action.opponentRequestMultiplayer,
        opponentTurn,
      }
    }
    case GameAction.PLAYER_MATCH: {
      if (action.playerCard && action.opponentRequestMultiplayer) {
        const playerOutput = 0
        if (state.socket)
          state.socket.emit(
            "player_match",
            action.opponentRequestMultiplayer,
            action.playerCard,
            state.gameState,
            playerOutput,
            state.sessionID
          )
        return {
          ...state,
          log: action.log!,
        }
      }
      return {
        ...state,
        log: action.log!,
      }
    }
    case GameAction.NO_PLAYER_MATCH: {
      if (state.socket)
        state.socket.emit(
          "no_player_match",
          action.opponentRequestMultiplayer,
          state.sessionID
        )
      return {
        ...state,
        log: action.log!,
        opponentTurn: false,
      }
    }
    case GameAction.PLAYER_DEALS: {
      const log =
        "There were no matches with your opponent. You must now deal a card from the deck."
      return {
        ...state,
        log,
        playerRequest: action.playerRequest,
        deckClickable: true,
      }
    }
    case GameAction.PLAYER_DEALT: {
      if (state.socket)
        state.socket.emit(
          "player_dealt",
          action.playerRequest,
          state.gameState,
          state.sessionID
        )
      return { ...state, deckClickable: false }
    }
    case GameAction.PLAYER_RESULT: {
      if (action.requestPlayer === state.clientPlayer) {
        setShowPlayerModal(true)

        switch (action.playerOutput) {
          case PlayerOutput.OpponentMatch: {
            setMatchStatusHeading("match")
            setMatchStatusSubHeading("opponent hand")
            const log = "It's your turn again."
            return {
              ...state,
              log,
              playerOutput: action.playerOutput,
            }
          }
          case PlayerOutput.DeckMatch: {
            if (state.socket) {
              setMatchStatusHeading("match")
              setMatchStatusSubHeading("dealt card")
              const log = "It's your turn again."
              state.socket.emit(
                "player_response_message",
                action.playerOutput,
                state.sessionID
              )
              const playerTurn = state.clientPlayer
              return {
                ...state,
                log,
                playerOutput: action.playerOutput,
                playerTurn,
              }
            }
          }
          case PlayerOutput.HandMatch: {
            if (state.socket) {
              setMatchStatusHeading("match")
              setMatchStatusSubHeading("your hand")
              const log = "It's your opponent's turn."
              state.socket.emit(
                "player_response_message",
                action.playerOutput,
                state.sessionID
              )
              state.socket.emit("player_turn_switch", state.sessionID)
              const playerTurn = state.clientPlayer === 1 ? 2 : 1
              return {
                ...state,
                log,
                playerOutput: action.playerOutput,
                playerTurn,
              }
            }
          }
          case PlayerOutput.NoMatch: {
            if (state.socket) {
              setMatchStatusHeading("no match")
              setMatchStatusSubHeading("")
              const log = "It's your opponent's turn."
              state.socket.emit(
                "player_response_message",
                action.playerOutput,
                state.sessionID
              )
              state.socket.emit("player_turn_switch", state.sessionID)
              const playerTurn = state.clientPlayer === 1 ? 2 : 1
              return {
                ...state,
                log,
                playerOutput: action.playerOutput,
                playerTurn,
              }
            }
          }
          default:
            return state
        }
      }
      return state
    }
    case GameAction.PLAYER_RESPONSE_MESSAGE: {
      let log: string
      switch (action.playerOutput) {
        case 1: {
          log =
            "Your opponent matched with the dealt card. It's their turn again."
          return { ...state, log }
        }
        case 2: {
          log =
            "Your opponent didn't match with the dealt card. But another card in their hand did. It's your turn."
          return { ...state, log }
        }
        case 3: {
          log =
            "Your opponent had no matches. The dealt card has been added to their hand. It's your turn."
          return { ...state, log }
        }
        default:
          return state
      }
    }
    case GameAction.PLAYER_TURN_SWITCH: {
      const playerTurnHandlerFactory = (playerHandEvent: MouseEvent) =>
        playerTurnHandler(playerHandEvent, state.player!, state.clientPlayer!)
      return {
        ...state,
        playerTurnHandlerFactory,
      }
    }
    case GameAction.PLAYER_DISCONNECTED: {
      const log = "Your opponent has disconnected. The game has ended."

      return {
        ...state,
        log,
        gameOver: false,
      }
    }
    case GameAction.GAME_OVER: {
      if (state.player && state.opponent && state.shuffledDeck)
        if (
          state.player.hand.length === 0 ||
          state.opponent.hand.length === 0 ||
          state.shuffledDeck.length === 0
        ) {
          let outcome
          if (state.player.pairs.length > state.opponent.pairs.length) {
            outcome = Outcome.Player
          } else if (
            state.player.pairs.length === state.opponent.pairs.length
          ) {
            outcome = Outcome.Draw
          } else {
            outcome = Outcome.Opponent
          }
          return {
            ...state,
            log: "",
            outcome,
            gameOver: true,
          }
        }
      return state
    }
    default:
      return state
  }
}

export const [gameState, dispatchGameAction] = createReducer(
  multiplayerReducer,
  initialGameState
)

const MultiplayerSession: Component<multiplayerSessionProps> = props => {
  const [player, setPlayer] = createSignal(0)
  const [startGame, setStartGame] = createSignal(false)

  dispatchGameAction({ type: GameAction.START_SESSION, socket: props.socket })

  props.socket.on("setPlayer", player => setPlayer(player))

  props.socket.on("start", (serverState, playerTurn, sessionID) => {
    const startPlayerLog =
      "The cards have been dealt. Any initial pairs of cards have been added to your Pairs.\
You get to go first! Please select a card from your hand to request a match with your opponent."

    const nonStartPlayerLog = "Waiting for your opponent to request a value..."

    const player1Log = playerTurn === 1 ? startPlayerLog : nonStartPlayerLog

    const player2Log = playerTurn === 2 ? startPlayerLog : nonStartPlayerLog

    dispatchGameAction({
      type: GameAction.UPDATE,
      serverState,
      clientPlayer: player(),
      player1Log,
      player2Log,
      playerTurn,
      sessionID,
    })
    setStartGame(true)
    dispatchGameAction({ type: GameAction.GAME_OVER })
  })

  props.socket.on("player_requested", opponentRequestMultiplayer => {
    dispatchGameAction({
      type: GameAction.PLAYER_RESPONSE,
      opponentRequestMultiplayer,
    })
    dispatchGameAction({ type: GameAction.GAME_OVER })
  })

  props.socket.on(
    "player_match",
    (serverState, playerOutput, requestPlayer) => {
      dispatchGameAction({
        type: GameAction.UPDATE,
        serverState,
        clientPlayer: player(),
        playerTurn: requestPlayer,
      })
      dispatchGameAction({
        type: GameAction.PLAYER_RESULT,
        playerOutput,
        requestPlayer,
        serverState,
      })
      dispatchGameAction({ type: GameAction.GAME_OVER })
    }
  )

  props.socket.on("player_to_deal", playerRequest => {
    dispatchGameAction({
      type: GameAction.PLAYER_DEALS,
      playerRequest,
    })
    dispatchGameAction({ type: GameAction.GAME_OVER })
  })

  props.socket.on(
    "player_dealt",
    (serverState, playerOutput, requestPlayer) => {
      let playerTurn: number
      if (playerOutput === 1) playerTurn = requestPlayer
      else playerTurn = requestPlayer === 1 ? 2 : 1
      dispatchGameAction({
        type: GameAction.UPDATE,
        serverState,
        clientPlayer: player(),
        playerTurn,
      })
      dispatchGameAction({
        type: GameAction.PLAYER_RESULT,
        playerOutput,
        requestPlayer,
        serverState,
      })
      dispatchGameAction({ type: GameAction.GAME_OVER })
    }
  )

  props.socket.on("player_response_message", playerOutput => {
    dispatchGameAction({
      type: GameAction.PLAYER_RESPONSE_MESSAGE,
      playerOutput,
    })
    dispatchGameAction({ type: GameAction.GAME_OVER })
  })

  props.socket.on("player_turn_switch", playerTurn => {
    dispatchGameAction({
      type: GameAction.PLAYER_TURN_SWITCH,
      playerTurn,
    })
    dispatchGameAction({ type: GameAction.GAME_OVER })
  })

  props.socket.on("player_disconnected", () =>
    dispatchGameAction({ type: GameAction.PLAYER_DISCONNECTED })
  )

  return (
    <div class="session">
      <Show when={startGame()} fallback={<CreateGame />}>
        <Game gameState={gameState} />
        <PlayerModal gameState={gameState} />
        <PairsModal gameState={gameState} />
      </Show>
      <QuitGameModal multiplayer={true} socket={props.socket} />
      <Sidebar gameState={gameState} />
    </div>
  )
}

export default MultiplayerSession
