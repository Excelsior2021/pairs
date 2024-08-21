import { createEffect, createSignal, type Component } from "solid-js"
import {
  setSinglePlayerStarted,
  setMultiplayerMenu,
} from "@/components/game-screen/game-screen"
import { setShowInstructions } from "@/components/instructions/instructions"
import "./main-menu.scss"

//global signal to prevent appLoaded from reinitializing
const [appLoaded, setAppLoaded] = createSignal(false)

const MainMenu: Component = () => {
  //delay for setTimeout set to 500ms because animation is 500ms
  createEffect(() => setTimeout(() => setAppLoaded(true), 500))

  return (
    <div
      class={appLoaded() ? "main-menu main-menu--no-animation" : "main-menu"}
      data-testid="main-menu">
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
