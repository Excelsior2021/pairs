import { Component } from "solid-js"
import {
  setMultiplayerMenu,
  setCreateGame,
  setJoinGame,
} from "../GameScreen/GameScreen"
import { dispatchGameAction } from "../MultiplayerSession/MultiplayerSession"
import "./MultiplayerMenu.scss"

const MultiplayerMenu: Component = () => (
  <div class="multiplayer-menu">
    <h2 class="multiplayer-menu__heading">multiplayer</h2>
    <div class="multiplayer-menu__actions">
      <button
        class="multiplayer-menu__button"
        onclick={() => {
          setMultiplayerMenu(false), setCreateGame(true)
        }}>
        create game
      </button>
      <button
        class="multiplayer-menu__button"
        onclick={() => {
          setMultiplayerMenu(false), setJoinGame(true)
        }}>
        join game
      </button>
      <button
        class="multiplayer-menu__button"
        onclick={() => setMultiplayerMenu(false)}>
        ←
      </button>
    </div>
  </div>
)

export default MultiplayerMenu
