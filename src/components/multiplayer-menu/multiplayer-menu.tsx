import {
  createSignal,
  type Accessor,
  type Component,
  type Setter,
} from "solid-js"
import { io } from "socket.io-client"
import {
  setMultiplayerMenu,
  setMultiplayerSessionStarted,
  setJoinGame,
  setSocket,
  setCreateSessionID,
  socket,
} from "@/components/game-screen/game-screen"
import { dispatchGameAction } from "@/components/multiplayer-session/multiplayer-session"
import { GameAction } from "@/enums"
import "./multiplayer-menu.scss"

export const createGameHandler = (
  setServerTimeout: Setter<boolean>,
  setServerConnected: Setter<boolean | null>,
  timerInterval: Accessor<number>,
  setTimerInterval: Setter<number>,
  setClearInterval: Setter<NodeJS.Timeout | null>
) => {
  setServerTimeout(false)
  setServerConnected(null)
  const socket = io(import.meta.env.VITE_SERVER_DOMAIN)
  const timerIntervalRef = setInterval(() => {
    if (timerInterval() > 0) setTimerInterval((prev: number) => prev - 1)
    else clearInterval(timerIntervalRef)
  }, 1000)

  setSocket(socket)
  let timeoutCounter = 0

  const intervalRef = setInterval(() => {
    timeoutCounter++
    if (!socket.connected && timeoutCounter < 600) {
      setServerConnected(socket.connected)
    } else if (socket.connected && timeoutCounter < 3000) {
      const sessionIDGenerator = () => Math.floor(Math.random() * 10 ** 4)
      const sessionID = sessionIDGenerator().toString().padStart(4, "0")

      setCreateSessionID(sessionID)

      socket.emit("recieve_sessionID")

      socket.on("recieved_sessionID", () => {
        setMultiplayerMenu(false)
        setMultiplayerSessionStarted(true)
        dispatchGameAction({
          type: GameAction.CREATE_SESSION,
          sessionID,
        })
      })
      clearInterval(intervalRef)
    } else {
      socket.disconnect()
      setServerTimeout(true)
      clearInterval(intervalRef)
    }
  }, 100)
  setClearInterval(intervalRef)
}

const MultiplayerMenu: Component = () => {
  const [serverConnected, setServerConnected] = createSignal<boolean | null>(
    null
  )
  const [serverTimeout, setServerTimeout] = createSignal(false)
  const [clearIntervalRef, setClearInterval] =
    createSignal<NodeJS.Timeout | null>(null)
  const [timerInterval, setTimerInterval] = createSignal(60)

  return (
    <div class="multiplayer-menu">
      <h2 class="multiplayer-menu__heading">multiplayer</h2>
      <div class="multiplayer-menu__actions">
        <button
          class="multiplayer-menu__button"
          onclick={() =>
            createGameHandler(
              setServerTimeout,
              setServerConnected,
              timerInterval,
              setTimerInterval,
              setClearInterval
            )
          }
          disabled={serverConnected() === false}>
          create game
        </button>
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setMultiplayerMenu(false)
            setJoinGame(true)
          }}
          disabled={serverConnected() === false}>
          join game
        </button>
        <button
          class="multiplayer-menu__button"
          onclick={() => {
            setMultiplayerMenu(false)
            clearInterval(clearIntervalRef()!)
            socket()?.disconnect()
          }}>
          ←
        </button>
      </div>
      {serverConnected() === false && (
        <p class="multiplayer-menu__text">
          Please wait a few moments, the server may be initializing. (
          {timerInterval()})
        </p>
      )}
      {serverTimeout() && (
        <p class="multiplayer-menu__text">
          There seems to be an issue connecting to the server. Please try again
          later.
        </p>
      )}
    </div>
  )
}

export default MultiplayerMenu
