import { Component, createSignal } from "solid-js";
import MainMenu from "../MainMenu/MainMenu";
import Session from "../Session/Session";
import Instructions from "../Instructions/Instructions";
import "./GameScreen.scss";

const GameScreen: Component = () => {
  return (
    <main class="game-screen">
      {/* <MainMenu /> */}
      <Session />
      <Instructions />
    </main>
  );
};

export default GameScreen;
