import * as deck from "./deckFunctions";
import * as goFish from "./goFishFunctions";
import * as comp from "./compFunctions";

export const playerMatch = (
  cardImg,
  shuffledDeck,
  playerHand,
  compHand,
  playerPairs,
  compPairs,
  playerTurnHandler,
  updateUI
) => {
  if (shuffledDeck.length > 0 && playerHand.length > 0 && compHand.length > 0) {
    const chosenCardValue = cardImg.target.attributes[1].value;

    //Match with card in compHand
    for (const card of compHand) {
      if (card.value.toString() === chosenCardValue) {
        playerPairs.push(card);
        compHand.splice(compHand.indexOf(card), 1);

        for (const card of playerHand) {
          if (cardImg.target.id === card.id) {
            playerPairs.push(card);
            playerHand.splice(playerHand.indexOf(card), 1);
            updateUI(
              playerHand,
              compHand,
              playerPairs,
              compPairs,
              playerTurnHandler
            );
            return 0;
          }
        }
      }
    }
    return false;
  }
};

export const playerDealt = (
  cardImg,
  shuffledDeck,
  playerHand,
  compHand,
  playerPairs,
  compPairs,
  playerTurnHandler,
  updateUI
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck);
  const chosenCardValue = cardImg.target.attributes[1].value;

  if (chosenCardValue === dealtCard.value.toString()) {
    playerPairs.push(dealtCard);
    for (let card of playerHand) {
      if (cardImg.target.id === card.id) {
        playerPairs.push(card);
        playerHand.splice(playerHand.indexOf(card), 1);
        updateUI(
          playerHand,
          compHand,
          playerPairs,
          compPairs,
          playerTurnHandler
        );
        return 1;
      }
    }
  }

  for (let x in playerHand) {
    if (dealtCard.value === playerHand[x].value) {
      playerPairs.push(dealtCard);
      playerPairs.push(playerHand[x]);
      playerHand.splice(playerHand.indexOf(playerHand[x]), 1);
      updateUI(playerHand, compHand, playerPairs, compPairs, playerTurnHandler);
      return 2;
    }
  }

  playerHand.push(dealtCard);
  updateUI(playerHand, compHand, playerPairs, compPairs, playerTurnHandler);
  return 3;
};

export const playerTurnHandler = (
  cardImg,
  styles,
  goFish,
  shuffledDeck,
  playerHand,
  compHand,
  playerPairs,
  compPairs,
  playerTurnHandler,
  updateUI,
  dispatchGameAction,
  setGameDeck,
  compTurn,
  gameOver
) => {
  const gameDeckHandler = () =>
    deck.gameDeckHandler(
      playerDealt,
      styles,
      cardImg,
      shuffledDeck,
      playerHand,
      compHand,
      playerPairs,
      compPairs,
      playerTurnHandler,
      updateUI,
      dispatchGameAction,
      setGameDeck,
      compTurn,
      gameOver
    );

  let playerOutput = playerMatch(
    cardImg,
    shuffledDeck,
    playerHand,
    compHand,
    playerPairs,
    compPairs,
    playerTurnHandler,
    updateUI
  );
  dispatchGameAction({ type: "PLAYER_ACTION", playerOutput });
  dispatchGameAction({ type: "CONSOLE_LOG", response: false });
  const gameOverCheck = gameOver(
    shuffledDeck,
    playerHand,
    compHand,
    playerPairs,
    compPairs,
    playerTurnHandler,
    updateUI
  );
  if (!gameOverCheck) {
    if (playerOutput === false) {
      const response = (
        <h3 className={styles.heading}>
          You didn't match with any card in your opponent's hand. Please deal a
          card from the deck.
        </h3>
      );
      goFish.playerHandUnclickable(
        playerHand,
        compHand,
        playerPairs,
        compPairs,
        playerTurnHandler,
        updateUI
      );
      setGameDeck(deck.gameDeckUI(styles, gameDeckHandler));
      dispatchGameAction({ type: "CONSOLE_LOG", response: response });
    }
  }
};

export const playerResponseHandler = (
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
) => {
  const compTurn = () =>
    comp.compTurn(
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
    );

  if (response.target.innerHTML === "Yes") {
    for (let x in playerHand) {
      if (playerHand[x].value === compAsked.value) {
        response = (
          <h3 className={styles.heading}>
            Please select the card with the same value as the one your opponent
            requested. Then it will be your opponent's turn again.
          </h3>
        );
        dispatchGameAction({ type: "CONSOLE_LOG", response: response });
        dispatchGameAction({
          type: "PLAYER_ANSWER",
          playerHand,
          compAsked,
          playerAnswerHandler,
        });
        return;
      }
    }
    response = (
      <h3 className={styles.heading}>
        Are you sure? Do you have a {compAsked.value}?
      </h3>
    );
    dispatchGameAction({
      type: "CONSOLE_LOG",
      yesButton: yesButton,
      noButton: noButton,
      response: response,
    });
    return;
  }
  if (response.target.innerHTML === "No") {
    for (let x in playerHand) {
      if (playerHand[x].value === compAsked.value) {
        response = (
          <h3 className={styles.heading}>
            Are you sure? Do you have a {compAsked.value}?
          </h3>
        );
        dispatchGameAction({
          type: "CONSOLE_LOG",
          yesButton: yesButton,
          noButton: noButton,
          response: response,
        });
        return;
      }
    }

    const compOutput = compDealt(
      shuffledDeck,
      playerHand,
      compHand,
      playerPairs,
      compPairs,
      playerTurnHandler,
      updateUI,
      compAsked
    );
    if (compOutput === 0) {
      goFish.playerHandUnclickable(
        playerHand,
        compHand,
        playerPairs,
        compPairs,
        playerTurnHandler,
        updateUI
      );
      response = (
        <h3 className={styles.heading}>
          Your opponent has dealt a card from the deck and the value they chose
          matched with the dealt card's value. It's your opponent's turn again.
        </h3>
      );
      dispatchGameAction({ type: "CONSOLE_LOG", response: response });
      setTimeout(compTurn, 4000);
    }
    if (compOutput === 1) {
      response = (
        <h3 className={styles.heading}>
          Your opponent has dealt a card from the deck. The value they chose did
          not match with the dealt card's value but they matched with another
          card in their deck. It's your turn.
        </h3>
      );
    }
    if (compOutput === 2) {
      response = (
        <h3 className={styles.heading}>
          Your opponent has dealt a card from the deck and added it to their
          hand. There were no matches. It's your turn.
        </h3>
      );
    }
  }
  dispatchGameAction({ type: "CONSOLE_LOG", response: response });
};

export const playerAnswerHandler = (
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
) => {
  const playerPickValue = cardImg.target.attributes[1].value;
  if (playerPickValue === String(compAsked.value)) {
    compMatch(
      playerHand,
      compHand,
      playerPairs,
      compPairs,
      playerTurnHandler,
      updateUI,
      compAsked,
      cardImg
    );
    compTurn(
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
    );
  } else if (playerPickValue !== compAsked.value) {
    const response = (
      <h3 className={styles.heading}>
        That card does not have the value that your opponent requested. Please
        select the card with the value your opponent requested. (Card Value:{" "}
        {compAsked.value})
      </h3>
    );
    dispatchGameAction({ type: "CONSOLE_LOG", response: response });
  }
};

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
  playerAnswerHandler,
};
