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
import { GameAction } from "../../types/enums"
import "./MultiplayerMenu.scss"

const MultiplayerMenu: Component = () => {
  const [serverConnected, setServerConnected] = createSignal<boolean | null>(
    null
  )

  const createGameHandler = () => {
    const socket = io(import.meta.env.VITE_SERVER_URL)

    setSocket(socket)

    setTimeout(() => setServerConnected(socket.connected), 100)

    const sessionIDGenerator = () => Math.floor(Math.random() * 10 ** 4)
    const sessionID = sessionIDGenerator().toString().padStart(4, "0")

    setSessionID(sessionID)

    socket.emit("recieve_sessionID")

    socket.on("recieved_sessionID", () => {
      setMultiplayerMenu(false)
      setMultiplayerSessionStarted(true)
      dispatchGameAction({
        type: GameAction.CREATE_SESSION,
        sessionID,
      })
    })
  }

  return (
    <div class="multiplayer-menu">
      <h2 class="multiplayer-menu__heading">multiplayer</h2>
      <div class="multiplayer-menu__actions">
        <button class="multiplayer-menu__button" onclick={createGameHandler}>
          create game
        </button>
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setMultiplayerMenu(false)
            setJoinGame(true)
          }}>
          join game
        </button>
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setMultiplayerMenu(false)
          }}>
          ←
        </button>
      </div>
      {serverConnected() === false && (
        <>
          <p class="multiplayer-menu__text">
            Please wait a few moments, the server may be initializing.
          </p>
          <p class="multiplayer-menu__text">
            Otherwise, there may be an issue connecting to the server. Please
            try again later.
          </p>
        </>
      )}
    </div>
  )
}

export default MultiplayerMenu
