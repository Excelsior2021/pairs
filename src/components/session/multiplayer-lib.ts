import {
  PlayerOutput,
  Outcome,
  Action,
  PlayerID,
  PlayerModalHeading,
  PlayerModalSubHeading,
} from "@enums"

import type {
  playerRequest,
  serverStateMultiplayer,
  sessionState,
  action,
  handleAction,
} from "@types"
import type { Socket } from "socket.io-client"
import type { SetStoreFunction } from "solid-js/store"

const { P1, P2 } = PlayerID

export const multiplayerReducer = (
  action: action,
  setState: SetStoreFunction<sessionState>,
  produce: (
    fn: (state: sessionState) => void
  ) => (state: sessionState) => sessionState
) => {
  switch (action.type) {
    case Action.START_SESSION: {
      setState({
        socket: action.socket,
        playerID: action.playerID,
        gameOver: false,
      })
      break
    }
    case Action.UPDATE: {
      const { player1, player2, deck } = action.serverState!

      setState(
        produce((state: sessionState) => {
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
        })
      )

      setState(state => {
        let isPlayerTurn = false
        if (state.playerID === action.playerTurn) isPlayerTurn = true

        return {
          gameStartedMultiplayer: true,
          isPlayerTurn,
          sessionID: action.sessionID ? action.sessionID : state.sessionID,
          isOpponentTurn: false,
          deck,
        }
      })
      break
    }
    case Action.PLAYER_REQUEST: {
      setState(state => {
        state.socket.emit(
          "player_request",
          action.playerRequest,
          state.sessionID
        )
        const log = "Waiting for you opponent to respond..."
        return {
          log,
          isPlayerTurn: false,
        }
      })
      break
    }
    case Action.PLAYER_RESPONSE: {
      setState(state => {
        const { card } = action.opponentRequest! //opponent's request
        let isOpponentTurn = false

        if (state.playerID === P1) isOpponentTurn = true
        if (state.playerID === P2) isOpponentTurn = true

        const log = `Do you have a ${card.value}?`

        return {
          log,
          opponentRequest: action.opponentRequest,
          isOpponentTurn,
        }
      })
      break
    }
    case Action.PLAYER_MATCH: {
      setState(state => {
        const playerOutput = PlayerOutput.OpponentMatch
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
        return {
          log: action.log!,
        }
      })
      break
    }
    case Action.NO_PLAYER_MATCH: {
      setState(state => {
        state.socket.emit(
          "no_player_match",
          action.opponentRequest,
          state.sessionID
        )
        return {
          log: action.log!,
          isOpponentTurn: false,
        }
      })
      break
    }
    case Action.PLAYER_DEALS: {
      setState({
        log: "There were no matches with your opponent. You must now deal a card from the deck.",
        playerRequest: action.playerRequest,
        isDealFromDeck: true,
      })
      break
    }
    case Action.PLAYER_DEALT: {
      setState(state => {
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
        return { isDealFromDeck: false }
      })
      break
    }
    case Action.PLAYER_RESULT: {
      setState(state => {
        if (action.activePlayer === state.playerID) {
          const initialNewState = {
            showPlayerModal: true,
            playerModalHeading: PlayerModalHeading.Match,
            playerOutput: action.playerOutput,
            log: "It's your turn again.",
          }

          const opponentTurn = {
            log: "It's your opponent's turn.",
            player: P1 ? P2 : P1,
          }

          switch (action.playerOutput) {
            case PlayerOutput.OpponentMatch: {
              return {
                ...initialNewState,
                playerModalSubHeading: PlayerModalSubHeading.Opponent,
              }
            }
            case PlayerOutput.DeckMatch: {
              if (state.socket) {
                state.socket.emit(
                  "player_response_message",
                  action.playerOutput,
                  state.sessionID
                )
                return {
                  ...initialNewState,
                  playerTurn: state.playerID,
                  playerModalSubHeading: PlayerModalSubHeading.Deck,
                }
              }
            }
            case PlayerOutput.HandMatch: {
              state.socket.emit(
                "player_response_message",
                action.playerOutput,
                state.sessionID
              )
              state.socket.emit("player_turn_switch", state.sessionID)
              return {
                ...initialNewState,
                log: opponentTurn.log,
                playerTurn: opponentTurn.player,
                playerModalSubHeading: PlayerModalSubHeading.Player,
              }
            }
            case PlayerOutput.NoMatch: {
              state.socket.emit(
                "player_response_message",
                action.playerOutput,
                state.sessionID
              )
              state.socket.emit("player_turn_switch", state.sessionID)
              const playerTurn = state.playerID === P1 ? P2 : P1
              return {
                ...initialNewState,
                log: opponentTurn.log,
                playerTurn: opponentTurn.player,
                playerModalHeading: PlayerModalHeading.NoMatch,
                playerModalSubHeading: PlayerModalSubHeading.None,
              }
            }
          }
        }
        return {}
      })
      break
    }
    case Action.PLAYER_RESPONSE_MESSAGE: {
      setState(_ => {
        let log: string
        switch (action.playerOutput) {
          case PlayerOutput.DeckMatch: {
            log =
              "Your opponent matched with the dealt card. It's their turn again."
            return { log }
          }
          case PlayerOutput.HandMatch: {
            log =
              "Your opponent didn't match with the dealt card. But another card in their hand did. It's your turn."
            return { log }
          }
          case PlayerOutput.NoMatch: {
            log =
              "Your opponent had no matches. The dealt card has been added to their hand. It's your turn."
            return { log }
          }
        }
        return {}
      })
      break
    }
    case Action.PLAYER_TURN_SWITCH: {
      setState({
        isPlayerTurn: true,
      })
      break
    }
    case Action.PLAYER_DISCONNECTED: {
      setState({
        log: "",
        outcome: Outcome.Disconnect,
        gameOver: true,
      })
      break
    }
    case Action.GAME_OVER: {
      setState(state => {
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
              log: "",
              outcome,
              gameOver: true,
              deckCount: state.deck.length, //should come from payload?
            }
          }
        return {}
      })
      break
    }
    case Action.CLOSE_PLAYER_MODAL: {
      setState({
        showPlayerModal: false,
      })
      break
    }
  }
}

export const startSession = (
  socket: Socket,
  playerID: PlayerID,
  handleAction: handleAction
) => {
  handleAction({
    type: Action.START_SESSION,
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

      handleAction({
        type: Action.UPDATE,
        serverState,
        player1Log,
        player2Log,
        playerTurn,
        sessionID,
      })
      handleAction({ type: Action.GAME_OVER })
    }
  )

  socket.on("player_requested", (opponentRequest: playerRequest) => {
    handleAction({
      type: Action.PLAYER_RESPONSE,
      opponentRequest,
    })
    handleAction({ type: Action.GAME_OVER })
  })

  //helper function for player_match and player_dealt
  const handlePlayerResult = (
    serverState: serverStateMultiplayer,
    playerOutput: number,
    activePlayer: number,
    playerTurn: number
  ) => {
    handleAction({
      type: Action.UPDATE,
      serverState,
      playerTurn,
    })
    handleAction({
      type: Action.PLAYER_RESULT,
      playerOutput,
      activePlayer,
      serverState,
    })
    handleAction({ type: Action.GAME_OVER })
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
    handleAction({
      type: Action.PLAYER_DEALS,
      playerRequest,
    })
    handleAction({ type: Action.GAME_OVER })
  })

  socket.on("player_response_message", (playerOutput: number) => {
    handleAction({
      type: Action.PLAYER_RESPONSE_MESSAGE,
      playerOutput,
    })
    handleAction({ type: Action.GAME_OVER })
  })

  socket.on("player_turn_switch", (playerTurn: number) => {
    handleAction({
      type: Action.PLAYER_TURN_SWITCH,
      playerTurn,
    })
    handleAction({ type: Action.GAME_OVER })
  })

  socket.on("player_disconnected", () =>
    handleAction({ type: Action.PLAYER_DISCONNECTED })
  )
}
