import * as deck from "./deckFunctions";
import * as goFish from "./goFishFunctions";
import * as player from "./playerFunctions";

export const compAsk = compHand => {
  const index = Math.floor(Math.random() * compHand.length);
  const card = compHand[index];
  return card;
};

export const compMatch = (
  playerHand,
  compHand,
  playerPairs,
  compPairs,
  playerTurn,
  updateUI,
  compAsk,
  cardImg
) => {
  compPairs.push(compAsk);
  compHand.splice(compHand.indexOf(compAsk), 1);
  for (let x in playerHand) {
    if (cardImg.target.id === playerHand[x].id) {
      compPairs.push(playerHand[x]);
      playerHand.splice(playerHand.indexOf(playerHand[x]), 1);
    }
  }

  goFish.playerHandUnclickable(
    playerHand,
    compHand,
    playerPairs,
    compPairs,
    playerTurn,
    updateUI
  );
  return;
};

//If value of chosen card not in playerHand
export const compDealt = (
  shuffledDeck,
  playerHand,
  compHand,
  playerPairs,
  compPairs,
  playerTurn,
  updateUI,
  compAsk
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck);

  //comp matches with dealt card
  if (dealtCard.value === compAsk.value) {
    compPairs.push(dealtCard);
    compPairs.push(compAsk);
    compHand.splice(compHand.indexOf(compAsk), 1);
    updateUI(playerHand, compHand, playerPairs, compPairs, playerTurn);
    return 0;
  }

  //comp matches dealt card with another card in comp hand
  for (let x in compHand) {
    if (dealtCard.value === compHand[x].value) {
      compPairs.push(dealtCard);
      compPairs.push(compHand[x]);
      compHand.splice(compHand.indexOf(compHand[x]), 1);
      updateUI(playerHand, compHand, playerPairs, compPairs, playerTurn);
      return 1;
    }
  }

  //comp adds dealt card to comp hand
  compHand.push(dealtCard);
  updateUI(playerHand, compHand, playerPairs, compPairs, playerTurn);
  return 2;
};

export const compTurn = (
  styles,
  shuffledDeck,
  playerHand,
  compHand,
  playerPairs,
  compPairs,
  playerTurnHandler,
  updateUI,
  dispatchGameAction,
  gameOver
) => {
  const gameOverCheck = gameOver(
    shuffledDeck,
    playerHand,
    compHand,
    playerPairs,
    compPairs,
    playerTurnHandler,
    updateUI
  );

  goFish.playerHandUnclickable(
    playerHand,
    compHand,
    playerPairs,
    compPairs,
    playerTurnHandler,
    updateUI
  );

  if (!gameOverCheck) {
    const compAsked = compAsk(compHand);
    const question = (
      <h3 className={styles.heading}>Do you have a {compAsked.value}?</h3>
    );
    const yesButton = (
      <button
        className={`${styles["button"]} ${styles["button--response"]}`}
        onClick={response => playerResponseHandler(response)}
      >
        Yes
      </button>
    );
    const noButton = (
      <button
        className={`${styles["button"]} ${styles["button--response"]}`}
        onClick={response => playerResponseHandler(response)}
      >
        No
      </button>
    );

    let response = true;

    const playerResponseHandler = response =>
      player.playerResponseHandler(
        response,
        styles,
        shuffledDeck,
        playerHand,
        compHand,
        playerPairs,
        compPairs,
        compAsked,
        playerAnswerHandler,
        playerTurnHandler,
        compDealt,
        yesButton,
        noButton,
        updateUI,
        dispatchGameAction,
        gameOver
      );

    dispatchGameAction({
      type: "CONSOLE_LOG",
      compAsked,
      question,
      yesButton,
      noButton,
      response,
    });

    const playerAnswerHandler = cardImg =>
      player.playerAnswerHandler(
        cardImg,
        styles,
        shuffledDeck,
        playerHand,
        compHand,
        playerPairs,
        compPairs,
        compAsked,
        playerTurnHandler,
        compMatch,
        compTurn,
        updateUI,
        dispatchGameAction,
        gameOver
      );
  }
};

export default {
  compAsk,
  compMatch,
  compDealt,
  compTurn,
};
