import {
  createSignal,
  type Accessor,
  type Component,
  type Setter,
} from "solid-js"
import { io } from "socket.io-client"
import {
  setJoinGame,
  setMultiplayerSessionStarted,
  setMultiplayerMenu,
  setSocket,
  socket,
} from "@/components/game-screen/game-screen"
import { dispatchGameAction } from "@/components/multiplayer-session/multiplayer-session"
import { GameAction } from "@/enums"
import "./join-game.scss"

export const joinGameHandler = async (
  sessionID: string,
  setSessionIDNotValid: Setter<boolean>,
  setNoSessionExists: Setter<boolean>,
  setServerConnected: Setter<boolean | null>,
  loading: Accessor<boolean>,
  setLoading: Setter<boolean>
) => {
  setSessionIDNotValid(false)
  setNoSessionExists(false)
  setServerConnected(null)
  const socketVar = setSocket(io(import.meta.env.VITE_SERVER_DOMAIN))

  let timeoutCounter = 0

  const interval = setInterval(() => {
    timeoutCounter++
    if (socketVar) {
      if (!socketVar.connected) {
        if (timeoutCounter < 50 && !loading()) setLoading(true)
        else if (timeoutCounter >= 50) {
          setServerConnected(false)
          setLoading(false)
          socketVar.disconnect()
          clearInterval(interval)
          return
        }
      }
      if (socketVar.connected) {
        setLoading(false)
        setSessionIDNotValid(false)
        setNoSessionExists(false)
        setServerConnected(true)

        if (!sessionID) {
          setSessionIDNotValid(true)
          clearInterval(interval)
          socketVar.disconnect()
          return
        }

        socketVar.emit("join_session", sessionID)

        socketVar.on("no_sessionID", () => {
          setNoSessionExists(true)
          socketVar.disconnect()
        })

        socketVar.on("sessionID_exists", () => {
          dispatchGameAction({ type: GameAction.JOIN_SESSION, sessionID })
          setJoinGame(false)
          setMultiplayerSessionStarted(true)
        })

        clearInterval(interval)
        return
      }
    }
  }, 100)
}

const JoinGame: Component = () => {
  const [joinSessionID, setJoinSessionID] = createSignal("")
  const [sessionIDNotValid, setSessionIDNotValid] = createSignal(false)
  const [noSessionExists, setNoSessionExists] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [serverConnected, setServerConnected] = createSignal<boolean | null>(
    null
  )
  return (
    <div class="join-game">
      <h2 class="join-game__heading">Join a Game Session</h2>
      <p class="join-game__text">
        Please enter the session ID from your opponent below
      </p>
      <input
        class="join-game__input"
        type="text"
        placeholder="session ID"
        maxlength="4"
        value={joinSessionID()}
        onchange={event => setJoinSessionID(event.currentTarget.value)}
        aria-label="session id"
      />
      {loading() && (
        <p class="join-game__text join-game__text--info">Please wait...</p>
      )}
      {sessionIDNotValid() && (
        <p class="join-game__text join-game__text--info">
          Please enter a valid session ID.
        </p>
      )}
      {noSessionExists() && (
        <p class="join-game__text join-game__text--info">
          This session does not exist. Please check the session ID is correct.
        </p>
      )}
      {serverConnected() === false && (
        <p class="join-game__text join-game__text--info">
          There seems to be an issue connecting to the server. Please try again
          later.
        </p>
      )}
      <div class="join-game__actions">
        <button
          class="join-game__button"
          onclick={() =>
            joinGameHandler(
              joinSessionID(),
              setSessionIDNotValid,
              setNoSessionExists,
              setServerConnected,
              loading,
              setLoading
            )
          }
          disabled={loading()}>
          join
        </button>
        <button
          class="join-game__button"
          onclick={() => {
            setJoinGame(false)
            setMultiplayerMenu(true)
            setSessionIDNotValid(false)
            setNoSessionExists(false)
            socket()?.disconnect()
          }}>
          ←
        </button>
      </div>
    </div>
  )
}

export default JoinGame
