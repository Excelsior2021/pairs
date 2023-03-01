import { Component, createSignal, Show } from "solid-js"
import { createReducer } from "@solid-primitives/memo"
import Game from "../Game/Game"
import Sidebar from "../Sidebar/Sidebar"
import CreateGame from "../CreateGame/CreateGame"
import PlayerModal from "../PlayerModal/PlayerModal"
import PairsModal from "../PairsModal/PairsModal"
import QuitGameModal from "../QuitGameModal/QuitGameModal"
import { gameDeckUI } from "../../gameFunctions/deckFunctions"
import UI from "../../gameFunctions/multiplayerUIFunctions"
import player from "../../gameFunctions/multiplayerPlayerFunctions"
import { setShowPlayerModal, setMatch } from "../PlayerModal/PlayerModal"
import { setGameDeck } from "../Sidebar/Sidebar"
import { multiplayerSessionProps } from "../../types/general"
import "../Session/Session.scss"

const multiplayerReducer = (state, action) => {
  switch (action.type) {
    case "START_SESSION": {
      return {
        ...state,
        socket: action.socket,
      }
    }
    case "CREATE_SESSION": {
      state.socket.emit("create_session", action.sessionID)
      return {
        ...state,
        sessionID: action.sessionID,
      }
    }
    case "JOIN_SESSION": {
      return {
        ...state,
        sessionID: action.sessionID,
      }
    }
    case "UPDATE": {
      const {
        player1Hand,
        player2Hand,
        player1Pairs,
        player2Pairs,
        shuffledDeck,
      } = action.serverState

      let playerHand
      let playerHandUI
      let playerHand2UI
      let opponentHand
      let opponentHandUI
      let playerPairs
      let playerPairsUI
      let opponentPairs
      let opponentPairsUI
      let log
      let gameState

      if (action.clientPlayer === "player1") {
        playerHand = player1Hand
        opponentHand = player2Hand

        if (action.playerTurn === "player1") {
          const playerTurnHandler = playerHandEvent =>
            player.playerTurnHandler(playerHandEvent, playerHand)
          playerHandUI = UI.createPlayerHandUI(playerHand, playerTurnHandler)
        } else {
          playerHandUI = UI.createHandUI(playerHand)
        }
        playerHand2UI = UI.createHandUI(playerHand)
        opponentHandUI = UI.createHandUIback(opponentHand)

        playerPairs = player1Pairs
        opponentPairs = player2Pairs
        playerPairsUI = UI.createPairsUI(player1Pairs)
        opponentPairsUI = UI.createPairsUI(player2Pairs)

        gameState = {
          player1Hand: playerHand,
          player2Hand: opponentHand,
          player1Pairs: playerPairs,
          player2Pairs: opponentPairs,
          shuffledDeck,
        }

        log = action.player1Log || state.log
      }

      if (action.clientPlayer === "player2") {
        playerHand = player2Hand
        opponentHand = player1Hand

        if (action.playerTurn === "player2") {
          const playerTurnHandler = playerHandEvent =>
            player.playerTurnHandler(playerHandEvent, playerHand)
          playerHandUI = UI.createPlayerHandUI(playerHand, playerTurnHandler)
        } else {
          playerHandUI = UI.createHandUI(playerHand)
        }
        playerHand2UI = UI.createHandUI(playerHand)
        opponentHandUI = UI.createHandUIback(opponentHand)

        playerPairs = player2Pairs
        opponentPairs = player1Pairs
        playerPairsUI = UI.createPairsUI(player2Pairs)
        opponentPairsUI = UI.createPairsUI(player1Pairs)

        gameState = {
          player1Hand: opponentHand,
          player2Hand: playerHand,
          player1Pairs: opponentPairs,
          player2Pairs: playerPairs,
          shuffledDeck,
        }

        log = action.player2Log || state.log
      }

      return {
        ...state,
        playerHand,
        opponentHand,
        playerHandUI,
        playerHand2UI,
        opponentHandUI,
        playerPairs,
        opponentPairs,
        playerPairsUI,
        opponentPairsUI,
        shuffledDeck,
        log,
        gameState,
        clientPlayer: action.clientPlayer,
      }
    }
    case "PLAYER_REQUEST": {
      state.socket.emit(
        "player_request",
        state.clientPlayer,
        action.playerRequest,
        state.sessionID
      )
      const log = "Waiting for you opponent to respond..."
      const playerHandUI = UI.createHandUI(state.playerHand)

      return {
        ...state,
        log,
        playerHandUI,
      }
    }
    case "PLAYER_RESPONSE": {
      const { card } = action.playerRequest
      let playerHand

      if (state.clientPlayer === "player1") {
        playerHand = state.playerHand
      }
      if (state.clientPlayer === "player2") {
        playerHand = state.playerHand
      }

      const playerResponseHandler = responseEvent =>
        player.playerResponseHandler(
          responseEvent,
          action.playerRequest,
          playerHand,
          state.clientPlayer,
          state.shuffledDeck
        )

      const log = `Do you have a ${card.value}?`
      const yesButton = (
        <button
          class="game__button"
          value="yes"
          onClick={playerResponseHandler}>
          Yes
        </button>
      )

      const noButton = (
        <button class="game__button" value="no" onClick={playerResponseHandler}>
          No
        </button>
      )

      return {
        ...state,
        log,
        yesButton,
        noButton,
      }
    }
    case "PLAYER_MATCH": {
      if (action.playerCard && action.opponentRequest) {
        const playerOutput = 0
        state.socket.emit(
          "player_match",
          action.opponentRequest,
          action.playerCard,
          state.gameState,
          playerOutput,
          state.sessionID
        )
        return {
          ...state,
          log: action.log,
          yesButton: null,
          noButton: null,
        }
      }
      return {
        ...state,
        log: action.log,
      }
    }
    case "NO_PLAYER_MATCH": {
      state.socket.emit(
        "no_player_match",
        action.opponentRequest,
        state.sessionID
      )
      return {
        ...state,
        log: action.log,
        yesButton: null,
        noButton: null,
      }
    }
    case "PLAYER_DEALS": {
      setGameDeck(
        gameDeckUI(() =>
          UI.gameDeckHandler(state.shuffledDeck, action.playerRequest)
        )
      )
      const log =
        "There were no matches with your opponent. You must now deal a card from the deck."
      return { ...state, log }
    }
    case "PLAYER_DEALT": {
      state.socket.emit(
        "player_dealt",
        action.dealtCard,
        state.shuffledDeck,
        action.playerRequest,
        state.gameState,
        state.sessionID
      )
      return state
    }
    case "PLAYER_RESULT": {
      if (action.requestPlayer === state.clientPlayer) {
        setShowPlayerModal(true)
        if (action.playerOutput === 0) {
          setMatch("Match (Opponent's Hand)")
          const log = "It's your turn again."
          return {
            ...state,
            log,
            playerOutput: action.playerOutput,
          }
        }
        if (action.playerOutput === 1) {
          setMatch("Match (Dealt Card)")
          const log = "It's your turn again."
          state.socket.emit(
            "player_response_message",
            action.playerOutput,
            state.sessionID
          )
          const playerTurnHandler = playerHandEvent =>
            player.playerTurnHandler(playerHandEvent, state.playerHand)
          const playerHandUI = UI.createPlayerHandUI(
            state.playerHand,
            playerTurnHandler
          )
          return {
            ...state,
            log,
            playerHandUI,
            playerOutput: action.playerOutput,
          }
        }
        if (action.playerOutput === 2) {
          setMatch("Match (Your Hand)")
          const log = "It's your opponent's turn."
          const playerHandUI = UI.createHandUI(state.playerHand)
          state.socket.emit(
            "player_response_message",
            action.playerOutput,
            state.sessionID
          )
          state.socket.emit("player_turn_switch", state.sessionID)
          return {
            ...state,
            log,
            playerOutput: action.playerOutput,
            playerHandUI,
          }
        }
        if (action.playerOutput === 3) {
          setMatch("No Match")
          const log = "It's your opponent's turn."
          const playerHandUI = UI.createHandUI(state.playerHand)
          state.socket.emit(
            "player_response_message",
            action.playerOutput,
            state.sessionID
          )
          state.socket.emit("player_turn_switch", state.sessionID)
          return {
            ...state,
            log,
            playerOutput: action.playerOutput,
            playerHandUI,
          }
        }
      }
      return {
        ...state,
      }
    }
    case "PLAYER_RESPONSE_MESSAGE": {
      let log
      if (action.playerOutput === 1) {
        log =
          "Your opponent matched with the dealt card. It's their turn again."
      }
      if (action.playerOutput === 2) {
        log =
          "Your opponent didn't match with the dealt card. But had another card in their hand did. It's your turn. Please choose a card from your hand."
      }
      if (action.playerOutput === 3) {
        log =
          "Your opponent had no matches. The dealt card has been added to their hand. It's your turn. Please choose a card from your hand."
      }
      return { ...state, log }
    }
    case "PLAYER_TURN_SWITCH": {
      const playerTurnHandler = playerHandEvent =>
        player.playerTurnHandler(playerHandEvent, state.playerHand)

      const playerHandUI = UI.createPlayerHandUI(
        state.playerHand,
        playerTurnHandler
      )

      return {
        ...state,
        playerHandUI,
      }
    }
    case "PLAYER_DISCONNECTED": {
      const log =
        "Unfortunately, your opponent has disconnected. The game has ended."

      const playerHandUI = UI.createHandUI(state.playerHand)
      setGameDeck(gameDeckUI())

      return {
        ...state,
        log,
        playerHandUI,
      }
    }
    case "GAME_OVER": {
      if (
        state.playerHand.length === 0 ||
        state.opponentHand.length === 0 ||
        state.shuffledDeck.length === 0
      ) {
        let outcome
        if (state.playerPairs.length > state.opponentPairs.length) {
          outcome = "You won! Well done!"
        } else if (state.playerPairs.length === state.opponentPairs.length) {
          outcome = "It's a draw!"
        } else {
          outcome = "Your opponent won! Better luck next time!"
        }

        const log = (
          <div class="game__game-over">
            <div class="game__outcome">
              <h2 class="game__game-over-heading">GAME OVER</h2>
              <p class="game__game-over-text">{outcome}</p>
            </div>
            <div class="game__stats">
              <h2 class="game__game-over-heading">STATS</h2>
              <p class="game__game-over-text">
                Player Pairs: {state.playerPairs.length}
              </p>
              <p class="game__game-over-text">
                Opponent Pairs: {state.opponentPairs.length}
              </p>
              <p class="game__game-over-text">
                Remaining cards in deck: {state.shuffledDeck.length}
              </p>
            </div>
          </div>
        )
        return {
          ...state,
          log,
        }
      }
      return state
    }
    default:
      return null
  }
}

export const [gameState, dispatchGameAction] = createReducer(
  multiplayerReducer,
  null
)

const MultiplayerSession: Component<multiplayerSessionProps> = props => {
  const [player, setPlayer] = createSignal("")
  const [startGame, setStartGame] = createSignal(false)

  dispatchGameAction({ type: "START_SESSION", socket: props.socket })

  props.socket.on("setPlayer", player => {
    if (player === 1) {
      setPlayer("player1")
    } else {
      setPlayer("player2")
    }
  })

  props.socket.on("start", (serverState, playerTurn, sessionID) => {
    const player1Log =
      "The cards have been dealt. Any initial pairs of cards have been added to your Pairs.\
      You get to go first! Please select a card from your hand to request a match with your opponent."

    const player2Log = "Waiting for your opponent to request a value..."

    dispatchGameAction({
      type: "UPDATE",
      serverState,
      clientPlayer: player(),
      player1Log,
      player2Log,
      playerTurn,
      sessionID,
    })
    setStartGame(true)
    dispatchGameAction({ type: "GAME_OVER" })
  })

  props.socket.on("player_requested", playerRequest => {
    dispatchGameAction({ type: "PLAYER_RESPONSE", playerRequest })
    dispatchGameAction({ type: "GAME_OVER" })
  })

  props.socket.on(
    "player_match",
    (serverState, playerOutput, requestPlayer) => {
      dispatchGameAction({
        type: "UPDATE",
        serverState,
        clientPlayer: player(),
        playerTurn: requestPlayer,
      })
      dispatchGameAction({ type: "PLAYER_RESULT", playerOutput, requestPlayer })
      dispatchGameAction({ type: "GAME_OVER" })
    }
  )

  props.socket.on("player_to_deal", playerRequest => {
    dispatchGameAction({
      type: "PLAYER_DEALS",
      playerRequest,
    })
    dispatchGameAction({ type: "GAME_OVER" })
  })

  props.socket.on(
    "player_dealt",
    (serverState, playerOutput, requestPlayer) => {
      dispatchGameAction({
        type: "UPDATE",
        serverState,
        clientPlayer: player(),
      })
      dispatchGameAction({ type: "PLAYER_RESULT", playerOutput, requestPlayer })
      dispatchGameAction({ type: "GAME_OVER" })
    }
  )

  props.socket.on("player_response_message", playerOutput => {
    dispatchGameAction({ type: "PLAYER_RESPONSE_MESSAGE", playerOutput })
    dispatchGameAction({ type: "GAME_OVER" })
  })

  props.socket.on("player_turn_switch", () => {
    dispatchGameAction({ type: "PLAYER_TURN_SWITCH" })
    dispatchGameAction({ type: "GAME_OVER" })
  })

  props.socket.on("player_disconnected", () =>
    dispatchGameAction({ type: "PLAYER_DISCONNECTED" })
  )

  return (
    <div class="session">
      <Show when={startGame()} fallback={<CreateGame />}>
        <Game gameState={gameState} />
        <PlayerModal gameState={gameState} />
        <PairsModal gameState={gameState} />
      </Show>
      <QuitGameModal multiplayer={true} socket={props.socket} />
      <Sidebar gameMode="multiplayer" />
    </div>
  )
}

export default MultiplayerSession
