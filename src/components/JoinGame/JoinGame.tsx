import { Component, createSignal } from "solid-js"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"
import {
  setJoinGame,
  setMultiplayerSessionStarted,
  setMultiplayerMenu,
} from "../GameScreen/GameScreen"
import "./JoinGame.scss"

export const [sessionExists, setSessionExists] = createSignal(false)

const JoinGame: Component = () => {
  const [sessionID, setSessionID] = createSignal("")

  return (
    <div class="join-game">
      <h2 class="join-game__heading">Join a Game Session</h2>
      <p class="join-game__text">
        Please enter the session ID from your opponent below
      </p>
      <input
        class="join-game__input"
        type="number"
        value={sessionID()}
        onchange={event => setSessionID(event.target.value)}
      />
      <div class="join-game__actions">
        <button
          class="join-game__button"
          onclick={() => {
            setJoinGame(false)
            setMultiplayerSessionStarted(true)

            dispatchGameAction({
              type: "JOIN_SESSION",
              sessionID: sessionID(),
            })

            if (sessionExists()) {
              setJoinGame(false)
              setMultiplayerSessionStarted(true)
            } else {
              console.log("session does not exist")
            }
          }}>
          join
        </button>
        <button
          class="join-game__button"
          onclick={() => {
            setJoinGame(false), setMultiplayerMenu(true)
          }}>
          ←
        </button>
      </div>
    </div>
  )
}

export default JoinGame
