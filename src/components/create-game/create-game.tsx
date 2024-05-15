import { sessionID } from "../game-screen/game-screen"
import "./create-game.scss"

import type { Component } from "solid-js"

const CreateGame: Component = () => (
  <div class="create-game">
    <h2 class="create-game__heading">Create Game Session</h2>
    <p class="create-game__text">
      Share the session ID with the user you want to play with
    </p>
    <p class="create-game__text">
      session ID: <span class="create-game__id">{sessionID()}</span>
    </p>
    <p class="create-game__text">waiting for opponent to connect...</p>
  </div>
)

export default CreateGame
