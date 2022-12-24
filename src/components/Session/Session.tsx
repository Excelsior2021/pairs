import { Component } from "solid-js";
import { createReducer } from "@solid-primitives/memo";
import Game from "../Game/Game";
import Sidebar from "../Sidebar/Sidebar";
import PlayerModal from "../PlayerModal/PlayerModal";
import PairsModal from "../PairsModal/PairsModal";
import deck from "../../gameFunctions/deckFunctions";
import goFish from "../../gameFunctions/goFishFunctions";
import player from "../../gameFunctions/playerFunctions";
import opponent from "../../gameFunctions/opponentFunctions";
import gameReport from "../../gameFunctions/gameReport";
import { setShowPlayerModal } from "../PlayerModal/PlayerModal";
import { setGameDeck } from "../Sidebar/Sidebar";
import "./Session.scss";

const intialGameState = {
  playerHandState: null,
  playerPairsState: null,
  opponentHandState: null,
  opponentPairsState: null,
};

const newDeck = deck.createDeck();
const shuffledDeck = deck.shuffleDeck(newDeck);

const gameReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE": {
      let playerHandUI = deck.createPlayerHandUI(
        action.playerHand,
        action.playerTurnHandler
      );
      let playerHandUI2 = deck.createPlayerHandUI(
        action.playerHand,
        action.playerTurnHandler
      );
      const playerPairsUI = goFish.createPairsUI(action.playerPairs);

      const opponentHandUI = deck.createHandUIback(action.opponentHand);
      const opponentPairsUI = goFish.createPairsUI(action.opponentPairs);

      if (action.playerHandUnclickable) {
        playerHandUI = deck.createHandUI(action.playerHand);
        playerHandUI2 = deck.createHandUI(action.playerHand);
      }

      gameReport(
        shuffledDeck,
        action.playerHand,
        action.opponentHand,
        action.playerPairs,
        action.opponentPairs
      );

      return {
        ...state,
        playerHandState: { data: action.playerHand, UI: playerHandUI },
        playerHandState2: { data: action.playerHand, UI: playerHandUI2 },
        playerPairsState: { data: action.playerPairs, UI: playerPairsUI },
        opponentHandState: { data: action.opponentHand, UI: opponentHandUI },
        opponentPairsState: { data: action.opponentPairs, UI: opponentPairsUI },
      };
    }
    case "PLAYER_ACTION": {
      if (action.playerOutput !== false) {
        setShowPlayerModal(true);
      }

      return { ...state, playerOutput: action.playerOutput };
    }
    case "PLAYER_ANSWER": {
      const playerHandUI = deck.createPlayerHandUI(
        action.playerHand,
        action.playerAnswerHandler
      );
      return {
        ...state,
        playerHandState: { ...state.playerHandState, UI: playerHandUI },
      };
    }
    case "GAME_LOG": {
      const question = action.question;
      const yesButton = action.yesButton;
      const noButton = action.noButton;
      const log = action.log;
      return { ...state, question, yesButton, noButton, log };
    }
    case "GAME_OVER": {
      return state;
    }
    default:
      return intialGameState;
  }
};

const [gameState, dispatchGameAction] = createReducer(
  gameReducer,
  intialGameState
);

const updateUI = (
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  playerHandUnclickable = null
) =>
  dispatchGameAction({
    type: "UPDATE",
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    playerHandUnclickable,
  });

const startGame = () => {
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

  const gameOver = () =>
    goFish.gameOver(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction
    );

  const playerTurnHandler = (cardImg: MouseEvent) =>
    player.playerTurnHandler(
      cardImg,
      goFish,
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction,
      setGameDeck,
      opponentTurn,
      gameOver
    );

  const opponentTurn = () =>
    opponent.opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction,
      gameOver
    );

  updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler
  );
  dispatchGameAction({ type: "GAME_LOG", log });
};

const Session: Component = () => {
  startGame();

  return (
    <div class="session">
      <Game gameState={gameState} dispatchGameAction={dispatchGameAction} />
      <Sidebar />
      <PlayerModal gameState={gameState} />
      <PairsModal gameState={gameState} />
    </div>
  );
};

export default Session;
