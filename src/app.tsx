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
import type { GameMode, PlayerID } from "@enums"
import type { Socket } from "socket.io-client"
import "./app.scss"

const App: Component = () => {
  const [gameMode, setGameMode] = createSignal<GameMode | null>(null) //session config
  const [multiplayerMenu, setMultiplayerMenu] = createSignal(false)
  const [joinGameMenu, setJoinGameMenu] = createSignal(false)
  const [socket, setSocket] = createSignal<Socket | null>(null) //session config
  const [sessionID, setSessionID] = createSignal("") //session config
  const [playerID, setPlayerID] = createSignal<PlayerID | null>(null) //session config
  const [showPairsModal, setShowPairsModal] = createSignal(false)
  const [showQuitGameModal, setShowQuitGameModal] = createSignal(false)
  const [showInstructions, setShowInstructions] = createSignal(false)

  return (
    <div class="app" data-testId="app">
      <a
        class="app__link"
        href="https://jonathankila.vercel.app"
        target="_blank"
        rel="noreferrer">
        <h1 class="app__title">Pairs</h1>
      </a>
      <a class="counter" href="https://www.free-website-hit-counter.com">
        <img
          src="https://www.free-website-hit-counter.com/c.php?d=9&id=143227&s=5"
          alt="Free Website Hit Counter"
        />
      </a>
      <main class="app__container">
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
    </div>
  )
}

export default App
