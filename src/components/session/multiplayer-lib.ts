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
  socket: Socket,
  playerID: PlayerID,
  sessionID: string,
  setState: SetStoreFunction<sessionState>,
  produce: (
    fn: (state: sessionState) => void
  ) => (state: sessionState) => sessionState
) => {
  switch (action.type) {
    case Action.UPDATE: {
      const { player1, player2, deck } = action.serverState!

      setState(
        produce((state: sessionState) => {
          //update client side players state depending on client player
          switch (playerID) {
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

      let isPlayerTurn = false
      if (playerID === action.playerTurn) isPlayerTurn = true

      setState({
        gameStartedMultiplayer: true,
        isPlayerTurn,
        isOpponentTurn: false,
        deck,
      })
      break
    }
    case Action.PLAYER_REQUEST: {
      socket.emit("player_request", action.playerRequest, sessionID)

      setState({
        log: "Waiting for you opponent to respond...",
        isPlayerTurn: false,
      })
      break
    }
    case Action.PLAYER_RESPONSE: {
      const { card } = action.opponentRequest! //opponent's request
      let isOpponentTurn = false

      if (playerID === P1) isOpponentTurn = true
      if (playerID === P2) isOpponentTurn = true

      setState({
        log: `Do you have a ${card.value}?`,
        opponentRequest: action.opponentRequest,
        isOpponentTurn,
      })
      break
    }
    case Action.PLAYER_MATCH: {
      const playerOutput = PlayerOutput.OpponentMatch

      console.log("hit")

      setState(state => {
        const sessionState = {
          player: state.player,
          opponent: state.opponent,
          deck: state.deck,
        }
        socket.emit(
          "player_match",
          action.opponentRequest,
          action.playerCard,
          sessionState,
          playerOutput,
          sessionID
        )
        return {
          log: action.log,
        }
      })
      break
    }
    case Action.NO_PLAYER_MATCH: {
      socket.emit("no_player_match", action.opponentRequest, sessionID)

      setState({
        log: action.log,
        isOpponentTurn: false,
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
        socket.emit(
          "player_dealt",
          action.playerRequest,
          sessionState,
          sessionID
        )
        return { isDealFromDeck: false }
      })
      break
    }
    case Action.PLAYER_RESULT: {
      if (action.activePlayer === playerID) {
        const updateState = {
          showPlayerModal: true,
          playerModalHeading: PlayerModalHeading.Match,
          playerOutput: action.playerOutput,
          log: "It's your turn again.",
        } as {
          showPlayerModal: boolean
          playerModalHeading: PlayerModalHeading
          playerModalSubHeading: PlayerModalSubHeading
          playerTurn: PlayerID
          playerOutput: PlayerOutput
          log: string
        }

        const opponentTurn = {
          log: "It's your opponent's turn.",
          player: P1 ? P2 : P1,
        }

        const emitPlayerResponseMessage = () =>
          socket.emit("player_response_message", action.playerOutput, sessionID)

        const emitPlayerTurnSwitch = () =>
          socket.emit("player_turn_switch", sessionID)

        switch (action.playerOutput) {
          case PlayerOutput.OpponentMatch: {
            updateState.playerModalSubHeading = PlayerModalSubHeading.Opponent
            break
          }
          case PlayerOutput.DeckMatch: {
            emitPlayerResponseMessage()
            updateState.playerTurn = playerID
            updateState.playerModalSubHeading = PlayerModalSubHeading.Deck
            break
          }
          case PlayerOutput.HandMatch: {
            emitPlayerResponseMessage()
            emitPlayerTurnSwitch()
            updateState.log = opponentTurn.log
            updateState.playerTurn = opponentTurn.player
            updateState.playerModalSubHeading = PlayerModalSubHeading.Player
            break
          }
          case PlayerOutput.NoMatch: {
            emitPlayerResponseMessage()
            emitPlayerTurnSwitch()
            updateState.log = opponentTurn.log
            updateState.playerTurn = opponentTurn.player
            updateState.playerModalHeading = PlayerModalHeading.NoMatch
            updateState.playerModalSubHeading = PlayerModalSubHeading.None
            break
          }
        }
        setState(updateState)
      }
      break
    }
    case Action.PLAYER_RESPONSE_MESSAGE: {
      let log: string = action.log as string
      switch (action.playerOutput) {
        case PlayerOutput.DeckMatch: {
          log =
            "Your opponent matched with the dealt card. It's their turn again."
        }
        case PlayerOutput.HandMatch: {
          log =
            "Your opponent didn't match with the dealt card. But another card in their hand did. It's your turn."
        }
        case PlayerOutput.NoMatch: {
          log =
            "Your opponent had no matches. The dealt card has been added to their hand. It's your turn."
        }
      }
      setState({
        log,
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
      setState(state => ({
        log: "",
        outcome: Outcome.Disconnect,
        gameOver: true,
        deckCount: state.deck?.length,
      }))
      return
    }
    case Action.CLOSE_PLAYER_MODAL: {
      setState({
        showPlayerModal: false,
      })
      return
    }
  }

  //Game Over Check
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
          deckCount: state.deck.length,
        }
      }
    return {}
  })
}

export const startSession = (socket: Socket, handleAction: handleAction) => {
  socket.on(
    "start",
    (serverState: serverStateMultiplayer, playerTurn: number) => {
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
      })
    }
  )

  socket.on("player_requested", (opponentRequest: playerRequest) => {
    handleAction({
      type: Action.PLAYER_RESPONSE,
      opponentRequest,
    })
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
  })

  socket.on("player_response_message", (playerOutput: number) => {
    handleAction({
      type: Action.PLAYER_RESPONSE_MESSAGE,
      playerOutput,
    })
  })

  socket.on("player_turn_switch", (playerTurn: number) => {
    handleAction({
      type: Action.PLAYER_TURN_SWITCH,
      playerTurn,
    })
  })

  socket.on("player_disconnected", () =>
    handleAction({ type: Action.PLAYER_DISCONNECTED })
  )
}
