import { createSignal, Switch, Match, type Component } from "solid-js"
import MainMenu from "@components/main-menu/main-menu"
import Session from "@components/session/session"
import Instructions from "@components/instructions/instructions"
import MultiplayerMenu from "@components/multiplayer-menu/multiplayer-menu"
import MultiplayerSession from "@components/multiplayer-session/multiplayer-session"
import JoinGame from "@components/join-game/join-game"
import "./game-screen.scss"

import type { Socket } from "socket.io-client"
import type { PlayerID } from "@enums"

const GameScreen: Component = () => {
  const [sessionStarted, setSessionStarted] = createSignal(false)
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
            setSessionStarted={setSessionStarted}
            setMultiplayerMenu={setMultiplayerMenu}
            setShowInstructions={setShowInstructions}
          />
        }>
        <Match when={sessionStarted()}>
          <Session
            showPairsModal={showPairsModal()}
            showQuitGameModal={showQuitGameModal()}
            setSessionStarted={setSessionStarted}
            setMultiplayerSessionStarted={setMultiplayerSessionStarted}
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
            setMultiplayerSessionStarted={setMultiplayerSessionStarted}
            setMultiplayerMenu={setMultiplayerMenu}
          />
        </Match>
        <Match when={joinGameMenu()}>
          <JoinGame
            socket={socket()}
            setSocket={setSocket}
            setPlayerID={setPlayerID}
            setJoinGameMenu={setJoinGameMenu}
            setMultiplayerSessionStarted={setMultiplayerSessionStarted}
            setMultiplayerMenu={setMultiplayerMenu}
          />
        </Match>
        <Match when={multiplayerSessionStarted()}>
          <MultiplayerSession
            socket={socket()}
            sessionID={sessionID()}
            playerID={playerID()}
            showPairsModal={showPairsModal()}
            showQuitGameModal={showQuitGameModal()}
            setSessionStarted={setSessionStarted}
            setMultiplayerSessionStarted={setMultiplayerSessionStarted}
            setShowPairsModal={setShowPairsModal}
            setShowInstructions={setShowInstructions}
            setShowQuitGameModal={setShowQuitGameModal}
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
