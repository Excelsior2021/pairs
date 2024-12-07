import { createEffect, createSignal, For, type Component } from "solid-js"
import {
  setSessionStarted,
  setMultiplayerMenu,
} from "@components/game-screen/game-screen"
import { setShowInstructions } from "@components/instructions/instructions"
import "./main-menu.scss"

//global signal to prevent appLoaded from reinitializing
const [appLoaded, setAppLoaded] = createSignal(false)

const MainMenu: Component = () => {
  //delay for setTimeout, set to 500ms because animation is 500ms
  createEffect(() => setTimeout(() => setAppLoaded(true), 500))

  const actions = [
    {
      name: "single player",
      onclick: () => setSessionStarted(true),
    },
    {
      name: "multiplayer",
      onclick: () => setMultiplayerMenu(true),
    },
    {
      name: "instructions",
      onclick: () => setShowInstructions(true),
    },
  ]

  return (
    <div
      class={appLoaded() ? "main-menu main-menu--no-animation" : "main-menu"}
      data-testid="main-menu">
      <h2 class="main-menu__heading">main menu</h2>
      <div class="main-menu__actions">
        <For each={actions}>
          {action => (
            <button class="main-menu__button" onclick={action.onclick}>
              {action.name}
            </button>
          )}
        </For>
      </div>
    </div>
  )
}

export default MainMenu
