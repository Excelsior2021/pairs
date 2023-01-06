import { Component } from "solid-js"
import {
  setSinglePlayerStarted,
  setMultiplayerMenu,
} from "../GameScreen/GameScreen"
import { setShowInstructions } from "../Instructions/Instructions"
import { io } from "socket.io-client"
import "./MainMenu.scss"

const MainMenu: Component = () => (
  <div class="main-menu">
    <h2 class="heading">main menu</h2>
    <div class="main-menu__actions">
      <button
        class="main-menu__button"
        onclick={() => setSinglePlayerStarted(true)}>
        single player
      </button>
      <button
        class="main-menu__button"
        onclick={() => setMultiplayerMenu(true)}>
        multiplayer
      </button>
      <button
        class="main-menu__button"
        onclick={() => setShowInstructions(true)}>
        instructions
      </button>
    </div>
  </div>
)

export default MainMenu
