import { Component, createSignal } from "solid-js";
import { setShowPairsModal } from "../PairsModal/PairsModal";
import { setShowInstructions } from "../Instructions/Instructions";
import { setGameStarted } from "../GameScreen/GameScreen";
import { gameDeckUI } from "../../gameFunctions/deckFunctions";
import "./Sidebar.scss";

export const [gameDeck, setGameDeck] = createSignal(gameDeckUI());

const Sidebar: Component = () => (
  <div class="sidebar">
    <div class="sidebar__deck">
      <p>deck</p>
      {gameDeck()}
    </div>
    <div class="sidebar__actions">
      <button onclick={() => setShowPairsModal(true)}>pairs</button>
      <button onclick={() => setShowInstructions(true)}>instructions</button>
      <button onclick={() => setGameStarted(false)}>quit</button>
    </div>
  </div>
);

export default Sidebar;
