import { dispatchAction } from "./multiplayer-session"
import {
  setShowPlayerModal,
  setMatchStatusHeading,
  setMatchStatusSubHeading,
} from "@components/player-modal/player-modal"
import { PlayerOutput, Outcome, GameAction, GameMode, PlayerID } from "@enums"

import type {
  gameActionMultiplayer,
  gameStateMultiplayer,
  playerRequest,
  serverStateMultiplayer,
} from "@types"
import type { Socket } from "socket.io-client"

const { P1, P2 } = PlayerID

export const initialSessionState = {
  gameStarted: false,
  gameMode: GameMode.Multiplayer,
  playerID: null,
  player: null,
  opponent: null,
  deck: null,
  isPlayerTurn: false,
  isOpponentTurn: false,
  playerOutput: null,
  log: "",
  outcome: "",
  socket: null,
  sessionID: "",
  playerTurn: null,
  gameOver: false,
  isDealFromDeck: false,
  deckCount: null,
}

export const multiplayerReducer = (
  state: gameStateMultiplayer,
  action: gameActionMultiplayer
): gameStateMultiplayer => {
  switch (action.action) {
    case GameAction.START_SESSION: {
      return {
        ...state,
        socket: action.socket,
        playerID: action.playerID,
        gameOver: false,
      }
    }
    case GameAction.UPDATE: {
      if (!state.gameStarted) state.gameStarted = true
      if (!state.sessionID) state.sessionID = action.sessionID
      if (state.isOpponentTurn) state.isOpponentTurn = false
      const { player1, player2, deck } = action.serverState!

      //update client side players state depending on client player
      switch (state.playerID) {
        case P1: {
          state.player = player1
          state.opponent = player2

          state.log = action.player1Log || state.log
          break
        }
        case P2: {
          state.player = player2
          state.opponent = player1

          state.log = action.player2Log || state.log
          break
        }
      }

      if (state.playerID === action.playerTurn) state.isPlayerTurn = true
      else state.isPlayerTurn = false

      return {
        ...state,
        deck, //update deck state from server
        deckCount: deck.length,
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
        isPlayerTurn: false,
      }
    }
    case GameAction.PLAYER_RESPONSE: {
      const { card } = action.opponentRequest! //opponent's request
      state.isOpponentTurn = false

      if (state.playerID === P1) state.isOpponentTurn = true
      if (state.playerID === P2) state.isOpponentTurn = true

      const log = `Do you have a ${card.value}?`

      return {
        ...state,
        log,
        opponentRequest: action.opponentRequest,
      }
    }
    case GameAction.PLAYER_MATCH: {
      if (action.playerCard && action.opponentRequest) {
        const playerOutput = PlayerOutput.OpponentMatch
        if (state.socket) {
          const sessionState = {
            player: state.player,
            opponent: state.opponent,
            deck: state.deck,
          }
          state.socket.emit(
            "player_match",
            action.opponentRequest,
            action.playerCard,
            sessionState,
            playerOutput,
            state.sessionID
          )
        }
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
          action.opponentRequest,
          state.sessionID
        )
      return {
        ...state,
        log: action.log!,
        isOpponentTurn: false,
      }
    }
    case GameAction.PLAYER_DEALS: {
      const log =
        "There were no matches with your opponent. You must now deal a card from the deck."

      return {
        ...state,
        log,
        playerRequest: action.playerRequest,
        isDealFromDeck: true,
      }
    }
    case GameAction.PLAYER_DEALT: {
      if (state.socket) {
        const sessionState = {
          player: state.player,
          opponent: state.opponent,
          deck: state.deck,
        }
        state.socket.emit(
          "player_dealt",
          action.playerRequest,
          sessionState,
          state.sessionID
        )
      }
      return { ...state, isDealFromDeck: false }
    }
    case GameAction.PLAYER_RESULT: {
      if (action.activePlayer === state.playerID) {
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
              const playerTurn = state.playerID
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
              const playerTurn = state.playerID === P1 ? P2 : P1
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
              const playerTurn = state.playerID === P1 ? P2 : P1
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
      return {
        ...state,
        isPlayerTurn: true,
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
      if (state.player && state.opponent && state.deck)
        if (
          state.player.hand.length === 0 ||
          state.opponent.hand.length === 0 ||
          state.deck.length === 0
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
            deckCount: state.deck.length,
          }
        }
      return state
    }
    default:
      return state
  }
}

export const startSession = (socket: Socket, playerID: PlayerID) => {
  dispatchAction({
    action: GameAction.START_SESSION,
    socket,
    playerID,
  })

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

      const player1Log = playerTurn === P1 ? startPlayerLog : nonStartPlayerLog

      const player2Log = playerTurn === P2 ? startPlayerLog : nonStartPlayerLog

      dispatchAction({
        action: GameAction.UPDATE,
        serverState,
        player1Log,
        player2Log,
        playerTurn,
        sessionID,
      })
      dispatchAction({ action: GameAction.GAME_OVER })
    }
  )

  socket.on("player_requested", (opponentRequest: playerRequest) => {
    dispatchAction({
      action: GameAction.PLAYER_RESPONSE,
      opponentRequest,
    })
    dispatchAction({ action: GameAction.GAME_OVER })
  })

  //helper function for player_match and player_dealt
  const handlePlayerResult = (
    serverState: serverStateMultiplayer,
    playerOutput: number,
    activePlayer: number,
    playerTurn: number
  ) => {
    dispatchAction({
      action: GameAction.UPDATE,
      serverState,
      playerTurn,
    })
    dispatchAction({
      action: GameAction.PLAYER_RESULT,
      playerOutput,
      activePlayer,
      serverState,
    })
    dispatchAction({ action: GameAction.GAME_OVER })
  }

  //playerTurn is activePlayer
  socket.on(
    "player_match",
    (
      serverState: serverStateMultiplayer,
      playerOutput: number,
      activePlayer: number
    ) =>
      handlePlayerResult(serverState, playerOutput, activePlayer, activePlayer)
  )
  socket.on(
    "player_dealt",
    (
      serverState: serverStateMultiplayer,
      playerOutput: number,
      activePlayer: number
    ) => {
      let playerTurn: number
      if (playerOutput === PlayerOutput.DeckMatch) playerTurn = activePlayer
      else playerTurn = activePlayer === P1 ? P2 : P1
      handlePlayerResult(serverState, playerOutput, activePlayer, playerTurn)
    }
  )

  socket.on("player_to_deal", (playerRequest: playerRequest) => {
    dispatchAction({
      action: GameAction.PLAYER_DEALS,
      playerRequest,
    })
    dispatchAction({ action: GameAction.GAME_OVER })
  })

  socket.on("player_response_message", (playerOutput: number) => {
    dispatchAction({
      action: GameAction.PLAYER_RESPONSE_MESSAGE,
      playerOutput,
    })
    dispatchAction({ action: GameAction.GAME_OVER })
  })

  socket.on("player_turn_switch", (playerTurn: number) => {
    dispatchAction({
      action: GameAction.PLAYER_TURN_SWITCH,
      playerTurn,
    })
    dispatchAction({ action: GameAction.GAME_OVER })
  })

  socket.on("player_disconnected", () =>
    dispatchAction({ action: GameAction.PLAYER_DISCONNECTED })
  )
}
