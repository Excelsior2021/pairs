import { Component } from "solid-js"
import {
  setCreateGame,
  setMultiplayerSessionStarted,
  setMultiplayerMenu,
  sessionID,
  setSessionID,
} from "../GameScreen/GameScreen"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"
import "./CreateGame.scss"

const roomIDGenerator = () => Math.floor(Math.random() * 10 ** 4)

const CreateGame: Component = () => {
  setSessionID(roomIDGenerator())
  return (
    <div class="create-game">
      <h2 class="create-game__heading">Create Game Session</h2>
      <p class="create-game__text">
        Share the session ID with the user you want to play with.{" "}
      </p>
      <span class="create-game__id">session ID: {sessionID()}</span>

      <div class="create-game__actions">
        <button
          class="create-game__button"
          onclick={() => {
            setCreateGame(false),
              setMultiplayerSessionStarted(true),
              dispatchGameAction({
                type: "CREATE_SESSION",
                sessionID: sessionID(),
              })
          }}>
          create
        </button>
        <button
          class="create-game__button"
          onclick={() => {
            setCreateGame(false), setMultiplayerMenu(true)
          }}>
          ←
        </button>
      </div>
    </div>
  )
}

export default CreateGame
