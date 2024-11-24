import { dispatchGameAction } from "./multiplayer-session"
import {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "@/components/player-modal/player-modal"
import {
  playerTurnHandler,
  playerResponseHandler,
} from "@/multiplayer-event-functions"
import { PlayerOutput, Outcome, GameAction, GameMode, Player } from "@/enums"

import type { Player as PlayerType } from "@/game-objects"
import type {
  clientStateMutiplayer,
  gameActionMultiplayer,
  gameStateMultiplayer,
  playerRequest,
  serverStateMultiplayer,
} from "@/types"
import type { Socket } from "socket.io-client"
import type { Accessor, Setter } from "solid-js"

export const initialGameState = {
  gameMode: GameMode.Multiplayer,
  player: null,
  opponent: null,
  shuffledDeck: null,
  playerTurnHandlerFactory: null,
  playerOutput: null,
  log: "",
  outcome: "",
  socket: null,
  clientPlayer: 0,
  sessionID: "",
  gameState: null,
  opponentTurn: false,
  playerTurn: null,
  gameOver: false,
  deckClickable: false,
}

export const multiplayerReducer = (
  state: gameStateMultiplayer,
  action: gameActionMultiplayer
): gameStateMultiplayer => {
  switch (action.type) {
    case GameAction.START_SESSION: {
      return {
        ...state,
        socket: action.socket,
        gameOver: false,
      }
    }
    case GameAction.UPDATE: {
      if (state.opponentTurn) state.opponentTurn = false
      const { player1, player2, shuffledDeck } = action.serverState!

      let player: PlayerType | null = null
      let opponent: PlayerType | null = null
      let log: string = ""
      let gameState: clientStateMutiplayer | null = null
      let clientPlayer: number
      let playerTurnHandlerFactory:
        | ((playerHandEvent: MouseEvent) => void)
        | null = null

      switch (action.clientPlayer) {
        case Player.Player1: {
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
        case Player.Player2: {
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
          playerTurnHandler(
            playerHandEvent,
            player,
            clientPlayer,
            dispatchGameAction
          )

      return {
        ...state,
        player,
        opponent,
        shuffledDeck,
        log,
        gameState,
        clientPlayer: action.clientPlayer!,
        playerTurnHandlerFactory,
        sessionID: action.sessionID ? action.sessionID : state.sessionID,
      }
    }
    case GameAction.PLAYER_REQUEST: {
      if (state.socket)
        state.socket.emit(
          "player_request",
          action.playerRequest,
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

      if (state.clientPlayer === Player.Player1) opponentTurn = true
      if (state.clientPlayer === Player.Player2) opponentTurn = true

      const log = `Do you have a ${card.value}?`

      const playerResponseHandlerFactory = (hasCard: boolean) =>
        playerResponseHandler(
          hasCard,
          action.opponentRequestMultiplayer!,
          state.player!,
          state.clientPlayer!,
          dispatchGameAction
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
        const playerOutput = PlayerOutput.OpponentMatch
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
      if (action.activePlayer === state.clientPlayer) {
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
              const playerTurn =
                state.clientPlayer === Player.Player1
                  ? Player.Player2
                  : Player.Player1
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
              const playerTurn =
                state.clientPlayer === Player.Player1
                  ? Player.Player2
                  : Player.Player1
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
        case PlayerOutput.DeckMatch: {
          log =
            "Your opponent matched with the dealt card. It's their turn again."
          return { ...state, log }
        }
        case PlayerOutput.HandMatch: {
          log =
            "Your opponent didn't match with the dealt card. But another card in their hand did. It's your turn."
          return { ...state, log }
        }
        case PlayerOutput.NoMatch: {
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
        playerTurnHandler(
          playerHandEvent,
          state.player!,
          state.clientPlayer!,
          dispatchGameAction
        )
      return {
        ...state,
        playerTurnHandlerFactory,
      }
    }
    case GameAction.PLAYER_DISCONNECT: {
      if (state.socket) state.socket.disconnect()
    }
    case GameAction.PLAYER_DISCONNECTED: {
      return {
        ...state,
        log: "",
        outcome: Outcome.Disconnect,
        gameOver: true,
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
          if (state.player.pairs.length > state.opponent.pairs.length)
            outcome = Outcome.Player
          else if (state.player.pairs.length === state.opponent.pairs.length)
            outcome = Outcome.Draw
          else outcome = Outcome.Opponent
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

export const startSession = (
  socket: Socket,
  player: Accessor<number>,
  setPlayer: Setter<number>,
  setStartGame: Setter<boolean>
) => {
  if (socket) {
    dispatchGameAction({ type: GameAction.START_SESSION, socket: socket })

    socket.on("set_player", (player: number) => setPlayer(player))

    socket.on(
      "start",
      (
        serverState: serverStateMultiplayer,
        playerTurn: number,
        sessionID: string
      ) => {
        const startPlayerLog =
          "The cards have been dealt. Any initial pairs of cards have been added to your Pairs.\
  You get to go first! Please select a card from your hand to request a match with your opponent."

        const nonStartPlayerLog =
          "Waiting for your opponent to request a value..."

        const player1Log =
          playerTurn === Player.Player1 ? startPlayerLog : nonStartPlayerLog

        const player2Log =
          playerTurn === Player.Player2 ? startPlayerLog : nonStartPlayerLog

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
      }
    )

    socket.on(
      "player_requested",
      (opponentRequestMultiplayer: playerRequest) => {
        dispatchGameAction({
          type: GameAction.PLAYER_RESPONSE,
          opponentRequestMultiplayer,
        })
        dispatchGameAction({ type: GameAction.GAME_OVER })
      }
    )

    socket.on(
      "player_match",
      (
        serverState: serverStateMultiplayer,
        playerOutput: number,
        activePlayer: number
      ) => {
        dispatchGameAction({
          type: GameAction.UPDATE,
          serverState,
          clientPlayer: player(),
          playerTurn: activePlayer,
        })
        dispatchGameAction({
          type: GameAction.PLAYER_RESULT,
          playerOutput,
          activePlayer,
          serverState,
        })
        dispatchGameAction({ type: GameAction.GAME_OVER })
      }
    )

    socket.on("player_to_deal", (playerRequest: playerRequest) => {
      dispatchGameAction({
        type: GameAction.PLAYER_DEALS,
        playerRequest,
      })
      dispatchGameAction({ type: GameAction.GAME_OVER })
    })

    socket.on(
      "player_dealt",
      (
        serverState: serverStateMultiplayer,
        playerOutput: number,
        activePlayer: number
      ) => {
        let playerTurn: number
        if (playerOutput === PlayerOutput.DeckMatch) playerTurn = activePlayer
        else
          playerTurn =
            activePlayer === Player.Player1 ? Player.Player2 : Player.Player1
        dispatchGameAction({
          type: GameAction.UPDATE,
          serverState,
          clientPlayer: player(),
          playerTurn,
        })
        dispatchGameAction({
          type: GameAction.PLAYER_RESULT,
          playerOutput,
          activePlayer,
          serverState,
        })
        dispatchGameAction({ type: GameAction.GAME_OVER })
      }
    )

    socket.on("player_response_message", (playerOutput: number) => {
      dispatchGameAction({
        type: GameAction.PLAYER_RESPONSE_MESSAGE,
        playerOutput,
      })
      dispatchGameAction({ type: GameAction.GAME_OVER })
    })

    socket.on("player_turn_switch", (playerTurn: number) => {
      dispatchGameAction({
        type: GameAction.PLAYER_TURN_SWITCH,
        playerTurn,
      })
      dispatchGameAction({ type: GameAction.GAME_OVER })
    })

    socket.on("player_disconnected", () =>
      dispatchGameAction({ type: GameAction.PLAYER_DISCONNECTED })
    )
  }
}
