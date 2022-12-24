import deck from "./deckFunctions";
import goFish from "./goFishFunctions";
import comp from "./opponentFunctions";
import gameReport from "./gameReport";

export const playerMatch = (
  cardImg,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI
) => {
  if (
    shuffledDeck.length > 0 &&
    playerHand.length > 0 &&
    opponentHand.length > 0
  ) {
    const chosenCardValue = cardImg.target.value;

    //Match with card in opponentHand
    for (const card of opponentHand) {
      if (card.value === chosenCardValue) {
        playerPairs.push(card);
        opponentHand.splice(opponentHand.indexOf(card), 1);

        for (const card of playerHand) {
          if (cardImg.target.id === card.id) {
            playerPairs.push(card);
            playerHand.splice(playerHand.indexOf(card), 1);
            updateUI(
              playerHand,
              opponentHand,
              playerPairs,
              opponentPairs,
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
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck);
  const chosenCardValue = cardImg.target.value;

  if (chosenCardValue === dealtCard.value) {
    playerPairs.push(dealtCard);
    for (let card of playerHand) {
      if (cardImg.target.id === card.id) {
        playerPairs.push(card);
        playerHand.splice(playerHand.indexOf(card), 1);
        updateUI(
          playerHand,
          opponentHand,
          playerPairs,
          opponentPairs,
          playerTurnHandler
        );
        return 1;
      }
    }
  }

  for (let card of playerHand) {
    if (dealtCard.value === card.value) {
      playerPairs.push(dealtCard);
      playerPairs.push(card);
      playerHand.splice(playerHand.indexOf(card), 1);
      updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        playerTurnHandler
      );
      return 2;
    }
  }

  playerHand.push(dealtCard);
  updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler
  );
  return 3;
};

export const playerTurnHandler = (
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
) => {
  const gameDeckHandler = () =>
    deck.gameDeckHandler(
      playerDealt,
      cardImg,
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

  let playerOutput = playerMatch(
    cardImg,
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    updateUI
  );

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    playerHand,
    playerPairs,
  });
  dispatchGameAction({ type: "GAME_LOG" });

  // gameReport(
  //   shuffledDeck,
  //   playerHand,
  //   opponentHand,
  //   playerPairs,
  //   opponentPairs
  // );

  const gameOverCheck = gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    updateUI
  );

  if (!gameOverCheck) {
    if (playerOutput === false) {
      const log = (
        <p class="">
          You didn't match with any card in your opponent's hand. Please deal a
          card from the deck.
        </p>
      );
      goFish.playerHandUnclickable(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        playerTurnHandler,
        updateUI
      );
      setGameDeck(deck.gameDeckUI(gameDeckHandler));
      dispatchGameAction({ type: "GAME_LOG", log });

      // gameReport(
      //   shuffledDeck,
      //   playerHand,
      //   opponentHand,
      //   playerPairs,
      //   opponentPairs
      // );
    }
  }
};

export const playerResponseHandler = (
  response,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsked,
  playerAnswerHandler,
  playerTurnHandler,
  opponentDealt,
  yesButton,
  noButton,
  updateUI,
  dispatchGameAction,
  gameOver
) => {
  const opponentTurn = () =>
    comp.opponentTurn(
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

  let log;

  if (response.target.innerHTML === "Yes") {
    for (let card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = (
          <p class="heading">
            Please select the card with the same value as the one your opponent
            requested. Then it will be your opponent's turn again.
          </p>
        );
        dispatchGameAction({ type: "GAME_LOG", log });
        dispatchGameAction({
          type: "PLAYER_ANSWER",
          playerHand,
          opponentAsked,
          playerAnswerHandler,
        });
        return;
      }
    }
    log = (
      <p class="heading">Are you sure? Do you have a {opponentAsked.value}?</p>
    );
    dispatchGameAction({
      type: "GAME_LOG",
      yesButton: yesButton,
      noButton: noButton,
      log: log,
    });
    return;
  }
  if (response.target.innerHTML === "No") {
    for (let card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = (
          <p class="heading">
            Are you sure? Do you have a {opponentAsked.value}?
          </p>
        );
        dispatchGameAction({
          type: "GAME_LOG",
          yesButton: yesButton,
          noButton: noButton,
          log,
        });
        return;
      }
    }

    const opponentOutput = opponentDealt(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      opponentAsked
    );
    if (opponentOutput === 0) {
      goFish.playerHandUnclickable(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        playerTurnHandler,
        updateUI
      );
      log = (
        <p class="heading">
          Your opponent has dealt a card from the deck and the value they chose
          matched with the dealt card's value. It's your opponent's turn again.
        </p>
      );
      dispatchGameAction({ type: "GAME_LOG", log });
      setTimeout(opponentTurn, 4000);
    }
    if (opponentOutput === 1) {
      log = (
        <p class="heading">
          Your opponent has dealt a card from the deck. The value they chose did
          not match with the dealt card's value but they matched with another
          card in their deck. It's your turn.
        </p>
      );
    }
    if (opponentOutput === 2) {
      log = (
        <p class="heading">
          Your opponent has dealt a card from the deck and added it to their
          hand. There were no matches. It's your turn.
        </p>
      );
    }
  }
  dispatchGameAction({ type: "GAME_LOG", log });
};

export const playerAnswerHandler = (
  cardImg,
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  opponentAsked,
  playerTurnHandler,
  opponentMatch,
  opponentTurn,
  updateUI,
  dispatchGameAction,
  gameOver
) => {
  const chosenCard = cardImg.target.value;
  if (chosenCard === opponentAsked.value) {
    opponentMatch(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI,
      opponentAsked,
      cardImg
    );
    opponentTurn(
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
  } else if (chosenCard !== opponentAsked.value) {
    const log = (
      <p class="heading">
        That card does not have the value that your opponent requested. Please
        select the card with the value your opponent requested. (Card Value:{" "}
        {opponentAsked.value})
      </p>
    );
    dispatchGameAction({ type: "GAME_LOG", log });
  }
};

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
  playerAnswerHandler,
};
