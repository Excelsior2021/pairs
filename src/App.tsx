import type { Component } from "solid-js";
import GameScreen from "./components/GameScreen/GameScreen";
import "./App.scss";

const App: Component = () => (
  <div class="app">
    <h1>Pairs</h1>
    <GameScreen />
  </div>
);

export default App;
