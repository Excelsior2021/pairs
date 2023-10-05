import { Component, createEffect, createSignal } from "solid-js"
import {
  setSinglePlayerStarted,
  setMultiplayerMenu,
} from "../GameScreen/GameScreen"
import { setShowInstructions } from "../Instructions/Instructions"
import "./MainMenu.scss"

const [appLoaded, setAppLoaded] = createSignal(false)
createEffect(() => setTimeout(() => setAppLoaded(true), 1000))

const MainMenu: Component = () => (
  <div class={appLoaded() ? "main-menu main-menu--no-animation" : "main-menu"}>
    <h2 class="main-menu__heading">main menu</h2>
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
    <p class="main-menu__text">
      Multiplayer is disabled as the server is currently down.
    </p>
  </div>
)

export default MainMenu
