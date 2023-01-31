import { Component, createSignal } from "solid-js"
import {
  setJoinGame,
  setMultiplayerSessionStarted,
  setMultiplayerMenu,
  setSocket,
} from "../GameScreen/GameScreen"
import { io } from "socket.io-client"
import "./JoinGame.scss"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"

const [sessionIDNotValid, setSessionIDNotValid] = createSignal(false)
const [noSessionExists, setNoSessionExists] = createSignal(false)

const joinGameHandler = (socket, sessionID) => {
  setSessionIDNotValid(false)
  setNoSessionExists(false)
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
  const socket = io("http://localhost:8080")
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
      <div class="join-game__actions">
        <button
          class="join-game__button"
          onclick={() => joinGameHandler(socket, sessionID())}>
          join
        </button>
        <button
          class="join-game__button"
          onclick={() => {
            setJoinGame(false), setMultiplayerMenu(true), socket.disconnect()
          }}>
          ←
        </button>
      </div>
    </div>
  )
}

export default JoinGame
