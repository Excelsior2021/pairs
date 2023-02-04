import { Component, createSignal } from "solid-js"
import {
  setMultiplayerMenu,
  setMultiplayerSessionStarted,
  setJoinGame,
  setSocket,
  setSessionID,
} from "../GameScreen/GameScreen"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"
import { io } from "socket.io-client"
import "./MultiplayerMenu.scss"

const [serverConnected, setServerConnected] = createSignal(true)

const MultiplayerMenu: Component = () => (
  <div class="multiplayer-menu">
    <h2 class="multiplayer-menu__heading">multiplayer</h2>
    <div class="multiplayer-menu__actions">
      <button
        class="multiplayer-menu__button"
        onclick={async () => {
          const socket = io(import.meta.env.VITE_SERVER_URL)
          setTimeout(() => {
            if (!socket.connected) {
              setServerConnected(false)
              return
            }
            setSocket(socket)
            const sessionIDGenerator = () => Math.floor(Math.random() * 10 ** 4)
            const sessionID = sessionIDGenerator().toString().padStart(4, "0")
            setSessionID(sessionID)
            setMultiplayerMenu(false)
            setMultiplayerSessionStarted(true)
            dispatchGameAction({
              type: "CREATE_SESSION",
              sessionID,
            })
          }, 100)
        }}>
        create game
      </button>
      <button
        class="multiplayer-menu__button"
        onclick={() => {
          setMultiplayerMenu(false)
          setJoinGame(true)
          setServerConnected(true)
        }}>
        join game
      </button>
      <button
        class="multiplayer-menu__button"
        onclick={() => {
          setMultiplayerMenu(false)
          setServerConnected(true)
        }}>
        ←
      </button>
    </div>
    {!serverConnected() && (
      <p class="multiplayer-menu__text">
        There seems to be an issue connecting to the server. Please check your
        internet connection or try again later.
      </p>
    )}
  </div>
)

export default MultiplayerMenu
