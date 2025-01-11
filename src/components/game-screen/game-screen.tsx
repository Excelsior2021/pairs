import {
  createSignal,
  Switch,
  Match,
  type Component,
  type Setter,
} from "solid-js"
import MainMenu from "@components/main-menu/main-menu"
import Session from "@components/session/session"
import Instructions from "@components/instructions/instructions"
import MultiplayerMenu from "@components/multiplayer-menu/multiplayer-menu"
import JoinGame from "@components/join-game/join-game"
import "./game-screen.scss"

import type { Socket } from "socket.io-client"
import { GameMode, type PlayerID } from "@enums"

const GameScreen: Component = () => {
  const [gameMode, setGameMode] = createSignal<GameMode | null>(null)
  const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
  const [joinGameMenu, setJoinGameMenu] = createSignal(false)
  const [multiplayerSessionStarted, setMultiplayerSessionStarted] =
    createSignal(false)
  const [socket, setSocket] = createSignal<Socket | null>(null)
  const [sessionID, setSessionID] = createSignal("")
  const [playerID, setPlayerID] = createSignal<PlayerID | null>(null)
  const [showPairsModal, setShowPairsModal] = createSignal(false)
  const [showQuitGameModal, setShowQuitGameModal] = createSignal(false)
  const [showInstructions, setShowInstructions] = createSignal(false)
  const [showPlayerModal, setShowPlayerModal] = createSignal(false)
  const [matchStatusHeading, setMatchStatusHeading] = createSignal("")
  const [matchStatusSubHeading, setMatchStatusSubHeading] = createSignal("")

  return (
    <main class="game-screen">
      <Switch
        fallback={
          <MainMenu
            setGameMode={setGameMode as Setter<GameMode>}
            setMultiplayerMenu={setMultiplayerMenu}
            setShowInstructions={setShowInstructions}
          />
        }>
        <Match when={gameMode()}>
          <Session
            gameMode={gameMode() as GameMode}
            socket={socket()}
            sessionID={sessionID()}
            playerID={playerID()}
            showPairsModal={showPairsModal()}
            showQuitGameModal={showQuitGameModal()}
            setGameMode={setGameMode as Setter<null>}
            setShowPairsModal={setShowPairsModal}
            setShowInstructions={setShowInstructions}
            setShowQuitGameModal={setShowQuitGameModal}
          />
        </Match>
        <Match when={multiplayerMenu()}>
          <MultiplayerMenu
            socket={socket()}
            setSocket={setSocket}
            setPlayerID={setPlayerID}
            setSessionID={setSessionID}
            setJoinGameMenu={setJoinGameMenu}
            setGameMode={setGameMode as Setter<GameMode>}
            setMultiplayerMenu={setMultiplayerMenu}
          />
        </Match>
        <Match when={joinGameMenu()}>
          <JoinGame
            socket={socket()}
            setSocket={setSocket}
            setPlayerID={setPlayerID}
            setJoinGameMenu={setJoinGameMenu}
            setGameMode={setGameMode as Setter<GameMode>}
            setMultiplayerMenu={setMultiplayerMenu}
          />
        </Match>
      </Switch>
      <Instructions
        showInstructions={showInstructions()}
        setShowInstructions={setShowInstructions}
      />
    </main>
  )
}

export default GameScreen
