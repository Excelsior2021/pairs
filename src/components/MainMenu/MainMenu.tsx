import { Component } from "solid-js";

const MainMenu: Component = () => (
  <div class="main-menu">
    <h2 class={"main-menu__title"}>Pairs</h2>
    <button class="button button--gameboard">single player</button>
    <button class="button button--gameboard">multiplayer</button>
    <button class="button button--gameboard">instructions</button>
  </div>
);

export default MainMenu;
