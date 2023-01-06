import { Component } from "solid-js"
import {
  setMultiplayerMenu,
  setMultiplayerStarted,
} from "../GameScreen/GameScreen"
import "./MultiplayerMenu.scss"

const MultiplayerMenu: Component = () => {
  const createGameHandler = () => {
    setMultiplayerMenu(false)
    setMultiplayerStarted(true)
  }

  const backToMainMenuHandler = () => {
    setMultiplayerMenu(false)
  }

  return (
    <div class="multiplayer-menu">
      <h2 class="multiplayer-menu__heading">multiplayer</h2>
      <div class="multiplayer-menu__actions">
        <button class="multiplayer-menu__button" onclick={createGameHandler}>
          create game
        </button>
        <button class="multiplayer-menu__button">join game</button>
        <button
          class="multiplayer-menu__button"
          onclick={backToMainMenuHandler}>
          ←
        </button>
      </div>
    </div>
  )
}

export default MultiplayerMenu
