import {
  createEffect,
  createSignal,
  For,
  type Setter,
  type Component,
} from "solid-js"
import { GameMode } from "@enums"
import "./main-menu.scss"

type props = {
  setGameMode: Setter<GameMode>
  setMultiplayerMenu: Setter<boolean>
  setShowInstructions: Setter<boolean>
}

const [appLoaded, setAppLoaded] = createSignal(false) //global signal to prevent appLoaded from reinitializing

const MainMenu: Component<props> = props => {
  createEffect(() => setTimeout(() => setAppLoaded(true), 500)) //delay for setTimeout, set to 500ms because animation is 500ms

  const actions = [
    {
      name: GameMode.SinglePlayer,
      onclick: () => props.setGameMode(GameMode.SinglePlayer),
    },
    {
      name: GameMode.Multiplayer,
      onclick: () => props.setMultiplayerMenu(true),
    },
    {
      name: "instructions",
      onclick: () => props.setShowInstructions(true),
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
