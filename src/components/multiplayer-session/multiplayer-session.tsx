import { createSignal, Show, type Component } from "solid-js"
import { createReducer } from "@solid-primitives/memo"
import Game from "@components/game/game"
import Sidebar from "@components/sidebar/sidebar"
import CreateGame from "@components/create-game/create-game"
import PairsModal from "@components/pairs-modal/pairs-modal"
import QuitGameModal from "@components/quit-game-modal/quit-game-modal"
import PlayerModal from "@components/player-modal/player-modal"
import {
  initialGameState,
  multiplayerReducer,
  startSession,
} from "./component-lib"
import "@components/session/session.scss"

import type { Socket } from "socket.io-client"

export const [gameState, dispatchGameAction] = createReducer(
  multiplayerReducer,
  initialGameState
)

type props = {
  socket: Socket | null
}

const MultiplayerSession: Component<props> = props => {
  const [player, setPlayer] = createSignal(0)
  const [startGame, setStartGame] = createSignal(false)

  startSession(props.socket as Socket, player, setPlayer, setStartGame)

  return (
    <div class="session">
      <Show when={startGame()} fallback={<CreateGame />}>
        <Game gameState={gameState} />
        <PlayerModal gameState={gameState} />
        <PairsModal gameState={gameState} />
      </Show>
      <QuitGameModal
        multiplayer={true}
        dispatchGameAction={dispatchGameAction}
      />
      <Sidebar gameState={gameState} />
    </div>
  )
}

export default MultiplayerSession
