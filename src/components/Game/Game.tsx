import { Component } from "solid-js";
import "./Game.scss";

const Game: Component = props => {
  return (
    <div class="game">
      <div class="game__opponent-hand">
        <p class="game__heading">Opponent's Hand</p>
        <div class="game__hand">{props.gameState().opponentHandState.UI}</div>
      </div>
      <div class="game__console">{props.gameState().log}</div>
      <div class="game__player-hand">
        <p class="game__heading">Your Hand</p>
        <div class="game__hand">{props.gameState().playerHandState.UI}</div>
      </div>
    </div>
  );
};

export default Game;
