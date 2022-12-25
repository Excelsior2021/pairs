import { Component, Setter } from "solid-js";
import { setShowInstructions } from "../Instructions/Instructions";
import "./MainMenu.scss";

type props = {
  setGameStarted: Setter<boolean>;
};

const MainMenu: Component<props> = props => (
  <div class="main-menu">
    <div class="main-menu__actions">
      <button
        class="main-menu__button"
        onclick={() => props.setGameStarted(true)}
      >
        single player
      </button>
      <button class="main-menu__button">multiplayer</button>
      <button
        class="main-menu__button"
        onclick={() => setShowInstructions(true)}
      >
        instructions
      </button>
    </div>
  </div>
);

export default MainMenu;
