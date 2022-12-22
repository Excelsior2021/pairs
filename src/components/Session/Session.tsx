import { Component } from "solid-js";
import { createReducer } from "@solid-primitives/memo";
import Game from "../Game/Game";
import deck from "../../gameFunctions/deckFunctions";
import goFish from "../../gameFunctions/goFishFunctions";

import Sidebar from "../Sidebar/Sidebar";
import "./Session.scss";
import PairsModal from "../PairsModal/PairsModal";

const intialGameState = {
  playerHandState: null,
  playerPairsState: null,
  opponentHandState: null,
  opponentPairsState: null,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      let playerHandUI = deck.createPlayerHandUI(
        action.playerHand,
        action.playerTurnHandler
      );
      const playerPairsUI = goFish.createPairsUI(action.playerPairs);

      const opponentHandUI = deck.createHandUIback(action.opponentHand);
      const opponentPairsUI = goFish.createPairsUI(action.opponentPairs);

      if (action.playerHandUnclickable) {
        playerHandUI = deck.createHandUI(action.playerHand);
      }

      return {
        ...state,
        playerHandState: { data: action.playerHand, UI: playerHandUI },
        playerPairsState: { data: action.playerPairs, UI: playerPairsUI },
        opponentHandState: { data: action.opponentHand, UI: opponentHandUI },
        opponentPairsState: { data: action.opponentPairs, UI: opponentPairsUI },
      };
    case "GAME_LOG":
      const question = action.question;
      const yesButton = action.yesButton;
      const noButton = action.noButton;
      const log = action.log;
      return { ...state, question, yesButton, noButton, log };

    default:
      return intialGameState;
  }
};

const [gameState, dispatchGameAction] = createReducer(
  gameReducer,
  intialGameState
);

const startGame = () => {
  const newDeck = deck.createDeck();
  const shuffledDeck = deck.shuffleDeck(newDeck);

  const playerHand = deck.dealHand(shuffledDeck, 7);
  const opponentHand = deck.dealHand(shuffledDeck, 7);

  const playerPairs = goFish.initialPairs(playerHand);
  const opponentPairs = goFish.initialPairs(opponentHand);

  const log = (
    <p>
      The cards have been dealt. Any initial pairs of cards have been added to
      your Pairs. <br /> Please select a card from your hand to request a match
      with your opponent.
    </p>
  );

  dispatchGameAction({
    type: "UPDATE",
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
  });
  dispatchGameAction({ type: "GAME_LOG", log });
};

const Session: Component = () => {
  startGame();

  return (
    <div class="session">
      <Game gameState={gameState} dispatchGameAction={dispatchGameAction} />
      <Sidebar />
      <PairsModal gameState={gameState} />
    </div>
  );
};

export default Session;
