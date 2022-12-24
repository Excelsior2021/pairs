import * as deck from "./deckFunctions";
import * as goFish from "./goFishFunctions";
import * as player from "./playerFunctions";

export const opponentAsk = opponentHand =>
  opponentHand[Math.floor(Math.random() * opponentHand.length)];

export const opponentMatch = (
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurn,
  updateUI,
  opponentAsk,
  cardImg
) => {
  opponentPairs.push(opponentAsk);
  opponentHand.splice(opponentHand.indexOf(opponentAsk), 1);
  for (let x in playerHand) {
    if (cardImg.target.id === playerHand[x].id) {
      opponentPairs.push(playerHand[x]);
      playerHand.splice(playerHand.indexOf(playerHand[x]), 1);
    }
  }

  goFish.playerHandUnclickable(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurn,
    updateUI
  );
  return;
};

//If value of chosen card not in playerHand
export const opponentDealt = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurn,
  updateUI,
  opponentAsk
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck);

  //opponent matches with dealt card
  if (dealtCard.value === opponentAsk.value) {
    opponentPairs.push(dealtCard);
    opponentPairs.push(opponentAsk);
    opponentHand.splice(opponentHand.indexOf(opponentAsk), 1);
    updateUI(playerHand, opponentHand, playerPairs, opponentPairs, playerTurn);
    return 0;
  }

  //opponent matches dealt card with another card in opponent hand
  for (let x in opponentHand) {
    if (dealtCard.value === opponentHand[x].value) {
      opponentPairs.push(dealtCard);
      opponentPairs.push(opponentHand[x]);
      opponentHand.splice(opponentHand.indexOf(opponentHand[x]), 1);
      updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        playerTurn
      );
      return 1;
    }
  }

  //opponent adds dealt card to opponent hand
  opponentHand.push(dealtCard);
  updateUI(playerHand, opponentHand, playerPairs, opponentPairs, playerTurn);
  return 2;
};

export const opponentTurn = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI,
  dispatchGameAction,
  gameOver
) => {
  const gameOverCheck = gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    updateUI
  );

  goFish.playerHandUnclickable(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    updateUI
  );

  if (!gameOverCheck) {
    const chosenCard = opponentAsk(opponentHand);
    const question = <p class="heading">Do you have a {chosenCard.value}?</p>;
    const yesButton = (
      <button
        class="button button--response"
        onClick={response => playerResponseHandler(response)}
      >
        Yes
      </button>
    );
    const noButton = (
      <button
        class="button button--response"
        onClick={response => playerResponseHandler(response)}
      >
        No
      </button>
    );

    const playerResponseHandler = response =>
      player.playerResponseHandler(
        response,
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        chosenCard,
        playerAnswerHandler,
        playerTurnHandler,
        opponentDealt,
        yesButton,
        noButton,
        updateUI,
        dispatchGameAction,
        gameOver
      );

    dispatchGameAction({
      type: "GAME_LOG",
      chosenCard,
      question,
      yesButton,
      noButton,
    });

    const playerAnswerHandler = cardImg =>
      player.playerAnswerHandler(
        cardImg,
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        chosenCard,
        playerTurnHandler,
        opponentMatch,
        opponentTurn,
        updateUI,
        dispatchGameAction,
        gameOver
      );
  }
};

export default {
  opponentAsk,
  opponentMatch,
  opponentDealt,
  opponentTurn,
};
