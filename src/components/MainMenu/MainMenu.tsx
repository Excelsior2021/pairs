import { Component } from "solid-js";
import { setShowInstructions } from "../Instructions/Instructions";
import "./MainMenu.scss";

const MainMenu: Component = props => (
  <div class="main-menu">
    <h2 class={"main-menu__title"}>Pairs</h2>
    <div class="main-menu__actions">
      <button
        class="button button--gameboard"
        onclick={() => props.setGameStarted(true)}
      >
        single player
      </button>
      <button class="button button--gameboard">multiplayer</button>
      <button
        class="button button--gameboard"
        onclick={() => setShowInstructions(true)}
      >
        instructions
      </button>
    </div>
  </div>
);

export default MainMenu;
