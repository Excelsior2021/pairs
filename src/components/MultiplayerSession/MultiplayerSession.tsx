import { Component, createSignal, Show } from "solid-js"
import { createReducer } from "@solid-primitives/memo"
import MultiplayerGame from "../MultiplayerGame/MultiplayerGame"
import Sidebar from "../Sidebar/Sidebar"
import PlayerModal from "../PlayerModal/PlayerModal"
import PairsModal from "../PairsModal/PairsModal"
import Connection from "../Connection/Connection"
import deck from "../../gameFunctions/multiplayerDeckFunctions"
import pairs from "../../gameFunctions/multiplayerPairsFunctions"
import player from "../../gameFunctions/multiplayerPlayerFunctions"
import { io } from "socket.io-client"
import "../Session/Session.scss"

// const initialGameState = {
//   playerHandState: { data: [], UI: () => [] },
//   playerHandState2: { data: [], UI: () => [] },
//   playerPairsState: { data: [], UI: () => [] },
//   opponentHandState: { data: [], UI: () => [] },
//   opponentPairsState: { data: [], UI: () => [] },
// }

const multiplayerReducer = (state, action) => {
  console.log(action.serverState)
  switch (action.type) {
    case "UPDATE": {
      const {
        player1Hand,
        player2Hand,
        player1Pairs,
        player2Pairs,
        shuffledDeck,
      } = action.serverState

      if (action.clientPlayer === "player1") {
        let playerHandUI = deck.createPlayerHandUI(
          player1Hand,
          player.playerTurnHandler
        )
        let opponentHandUI = deck.createHandUIback(player2Hand, null)

        const playerPairsUI = pairs.createPairsUI(player1Pairs)
        const opponentPairsUI = pairs.createPairsUI(player2Pairs)

        console.log(
          playerHandUI,
          opponentHandUI,
          playerPairsUI,
          opponentPairsUI
        )

        return {
          ...state,
          playerHandUI,
          opponentHandUI,
          playerPairsUI,
          opponentPairsUI,
        }
      }

      if (action.clientPlayer === "player2") {
        let playerHandUI = deck.createPlayerHandUI(player2Hand, null)
        let opponentHandUI = deck.createHandUIback(player1Hand, null)

        const playerPairsUI = pairs.createPairsUI(player2Pairs)
        const opponentPairsUI = pairs.createPairsUI(player1Pairs)

        return {
          ...state,
          playerHandUI,
          opponentHandUI,
          playerPairsUI,
          opponentPairsUI,
        }
      }
    }
    default:
      return null
  }
}

export const [gameState, dispatchGameAction] = createReducer(
  multiplayerReducer,
  null
)

const MultiplayerSession: Component = () => {
  const socket = io("http://localhost:8080")
  const [player, setPlayer] = createSignal("")
  const [startGame, setStartGame] = createSignal(false)
  const [serverGameState, setServerGameState] = createSignal(null)

  socket.on("setPlayer", players => {
    if (players === 1) {
      setPlayer("player1")
    } else {
      setPlayer("player2")
    }
    console.log(player())
  })

  socket.on("start", serverState => {
    dispatchGameAction({ type: "UPDATE", serverState, clientPlayer: player() })
    setStartGame(true)
    setServerGameState(serverState)
    console.log(startGame())
    console.log(serverGameState())
  })

  return (
    <div class="session">
      <h2>Multiplayer</h2>
      <Show when={startGame()} fallback={<Connection />}>
        <MultiplayerGame gameState={gameState} />
        <PlayerModal gameState={gameState} />
        <PairsModal gameState={gameState} />
      </Show>
      <Sidebar />
    </div>
  )
}

export default MultiplayerSession
