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

const [serverNotConnected, setServerNotConnected] = createSignal(false)
const [pleaseWait, setPleaseWait] = createSignal(false)

const MultiplayerMenu: Component = () => {
  setServerNotConnected(false)
  return (
    <div class="multiplayer-menu">
      <h2 class="multiplayer-menu__heading">multiplayer</h2>
      <div class="multiplayer-menu__actions">
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setPleaseWait(true)
            const socket = io(import.meta.env.VITE_SERVER_URL)
            setSocket(socket)
            const sessionIDGenerator = () => Math.floor(Math.random() * 10 ** 4)
            const sessionID = sessionIDGenerator().toString().padStart(4, "0")
            setSessionID(sessionID)
            socket.emit("recieve_sessionID")
            socket.on("recieved_sessionID", () => {
              setMultiplayerMenu(false)
              setMultiplayerSessionStarted(true)
              dispatchGameAction({
                type: "CREATE_SESSION",
                sessionID,
              })
              setPleaseWait(false)
              setServerNotConnected(false)
            })
            setTimeout(() => {
              setPleaseWait(false)
              setServerNotConnected(true)
            }, 1000)
          }}>
          create game
        </button>
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setMultiplayerMenu(false)
            setJoinGame(true)
            setServerNotConnected(false)
          }}>
          join game
        </button>
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setMultiplayerMenu(false)
            setServerNotConnected(false)
          }}>
          ←
        </button>
      </div>
      {pleaseWait() && <p class="multiplayer-menu__text">please wait...</p>}
      {serverNotConnected() && !pleaseWait() && (
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
