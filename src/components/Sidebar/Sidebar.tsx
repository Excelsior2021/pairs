import { Component } from "solid-js";
import { setShowPairsModal } from "../PairsModal/PairsModal";
import { setShowInstructions } from "../Instructions/Instructions";
import "./Sidebar.scss";

const Sidebar: Component = () => (
  <div class="sidebar">
    <div class="sidebar__deck">
      <p>deck</p>
    </div>
    <div class="sidebar__actions">
      <button onclick={() => setShowPairsModal(true)}>pairs</button>
      <button onclick={() => setShowInstructions(true)}>instructions</button>
      <button>quit</button>
    </div>
  </div>
);

export default Sidebar;
