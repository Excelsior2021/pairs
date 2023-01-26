import { Component, createSignal } from "solid-js"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"
import {
  setJoinGame,
  setMultiplayerSessionStarted,
  setMultiplayerMenu,
} from "../GameScreen/GameScreen"
import "./JoinGame.scss"

const JoinGame: Component = () => {
  const [sessionID, setSessionID] = createSignal("")
  return (
    <div class="join-game">
      <h2>Join a Game Session</h2>
      <p>Please enter the session ID from your opponent below.</p>
      <input
        type="text"
        value={sessionID()}
        onchange={event => setSessionID(event.target.value)}
      />
      <button
        class="create-game__button"
        onclick={() => {
          setJoinGame(false),
            setMultiplayerSessionStarted(true),
            dispatchGameAction({
              type: "JOIN_SESSION",
              sessionID: sessionID(),
            })
        }}>
        join
      </button>
      <button
        class="create-game__button"
        onclick={() => {
          setJoinGame(false), setMultiplayerMenu(true)
        }}>
        ←
      </button>
    </div>
  )
}

export default JoinGame
