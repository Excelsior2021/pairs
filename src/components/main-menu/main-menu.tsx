import { createEffect, createSignal } from "solid-js"
import {
  setSinglePlayerStarted,
  setMultiplayerMenu,
} from "../game-screen/game-screen"
import { setShowInstructions } from "../instructions/instructions"
import "./main-menu.scss"

import type { Component } from "solid-js"

const [appLoaded, setAppLoaded] = createSignal(false)

const MainMenu: Component = () => {
  createEffect(() => setTimeout(() => setAppLoaded(true), 500))
  return (
    <div
      class={appLoaded() ? "main-menu main-menu--no-animation" : "main-menu"}>
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
    </div>
  )
}

export default MainMenu
