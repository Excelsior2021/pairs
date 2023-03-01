import { Component, createSignal } from "solid-js"
import {
  setJoinGame,
  setMultiplayerSessionStarted,
  setMultiplayerMenu,
  setSocket,
} from "../GameScreen/GameScreen"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"
import { io, Socket } from "socket.io-client"
import "./JoinGame.scss"

const [sessionIDNotValid, setSessionIDNotValid] = createSignal(false)
const [noSessionExists, setNoSessionExists] = createSignal(false)
const [serverConnected, setServerConnected] = createSignal(true)

const joinGameHandler = (socket: Socket, sessionID: string) => {
  if (!socket.connected) {
    setServerConnected(false)
    return
  }
  setSessionIDNotValid(false)
  setNoSessionExists(false)
  setServerConnected(true)
  if (!sessionID) {
    setSessionIDNotValid(true)
    return
  }

  socket.emit("join_session", sessionID)

  socket.on("no-sessionID", () => {
    setNoSessionExists(true)
    return
  })

  socket.on("sessionID-exists", () => {
    dispatchGameAction({ type: "JOIN_SESSION", sessionID })

    setJoinGame(false)
    setMultiplayerSessionStarted(true)
  })
}

const JoinGame: Component = () => {
  const socket = io(import.meta.env.VITE_SERVER_URL)
  setSocket(socket)
  const [sessionID, setSessionID] = createSignal("")
  return (
    <div class="join-game">
      <h2 class="join-game__heading">Join a Game Session</h2>
      <p class="join-game__text">
        Please enter the session ID from your opponent below
      </p>
      <input
        class="join-game__input"
        type="text"
        maxlength="4"
        value={sessionID()}
        onchange={event => setSessionID(event.target.value)}
      />
      {sessionIDNotValid() && (
        <p class="join-game__text join-game__text--error">
          Please enter a valid session ID.
        </p>
      )}
      {noSessionExists() && (
        <p class="join-game__text join-game__text--error">
          This session does not exist. Please check that the session ID is
          correct.
        </p>
      )}
      {!serverConnected() && (
        <p class="join-game__text join-game__text--error">
          There seems to be an issue connecting to the server. Please check your
          internet connection or try again later.
        </p>
      )}
      <div class="join-game__actions">
        <button
          class="join-game__button"
          onclick={() => joinGameHandler(socket, sessionID())}>
          join
        </button>
        <button
          class="join-game__button"
          onclick={() => {
            setJoinGame(false)
            setMultiplayerMenu(true)
            setServerConnected(true)
            setSessionIDNotValid(false)
            setNoSessionExists(false)
            socket.disconnect()
          }}>
          ←
        </button>
      </div>
    </div>
  )
}

export default JoinGame
