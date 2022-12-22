import cardBack from "../assets/cards/back.png";
import "../styles/card.scss";

export const createDeck = () => {
  const deck = [];
  const non_num_cards = ["ace", "jack", "queen", "king"];
  const suits = ["clubs", "diamonds", "hearts", "spades"];

  for (let x of [...Array(9).keys()]) {
    for (let suit of suits) {
      let id = `${x + 2}_of_${suit}`;
      let img = `./src/assets/cards/${id}.png`;
      deck.push({
        id,
        value: x + 2,
        suit,
        img,
      });
    }
  }

  for (let value of non_num_cards) {
    if (value !== "ace") {
      for (let suit of suits) {
        let id = `${value}_of_${suit}`;
        let img = `./src/assets/cards/${id}.png`;
        deck.push({
          id,
          value,
          suit,
          img,
        });
      }
    }
  }

  for (let suit of suits.reverse()) {
    let id = `ace_of_${suit}`;
    let img = `./src/assets/cards/${id}.png`;
    deck.unshift({
      id,
      value: "ace",
      suit,
      img,
    });
  }
  return deck;
};

export const gameDeckUI = (styles, gameDeckHandler) => (
  <img
    className={null}
    src={cardBack}
    alt="game deck"
    onClick={gameDeckHandler}
  />
);

export const shuffleDeck = deck => {
  const shuffledDeck = [...deck];
  for (let x in shuffledDeck) {
    const y = Math.floor(Math.random() * x);
    const temp = shuffledDeck[x];
    shuffledDeck[x] = shuffledDeck[y];
    shuffledDeck[y] = temp;
  }
  return shuffledDeck;
};

export const dealTopCard = deck => deck.shift();

export const dealHand = (deck, handSize) => {
  const hand = [];
  while (hand.length < handSize) {
    let card = dealTopCard(deck);
    hand.push(card);
  }
  return hand;
};

export const createPlayerHandUI = (hand, onClickHandler) => (
  <For each={hand}>
    {card => (
      <img
        id={card.id}
        value={card.value}
        class="card card--player"
        src={card.img}
        alt={card.id}
        onClick={onClickHandler}
      />
    )}
  </For>
);

export const createHandUI = (hand, onClickHandler = null) => (
  <For each={hand}>
    {card => (
      <img
        class="card"
        id={card.id}
        value={card.value}
        src={card.img}
        alt={card.id}
        onClick={onClickHandler}
      />
    )}
  </For>
);

export const createHandUIback = hand => (
  <For each={hand}>
    {card => (
      <img
        class="card"
        id={card.id}
        value={card.value}
        src={cardBack}
        alt={card.id}
      />
    )}
  </For>
);

export const gameDeckHandler = (
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
) => {
  let playerOutput = playerDealt(
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
  setGameDeck(gameDeckUI(styles));
  if (playerOutput === 2 || playerOutput === 3) {
    compTurn();
  }
  gameOver(
    shuffledDeck,
    playerHand,
    compHand,
    playerPairs,
    compPairs,
    playerTurnHandler,
    updateUI
  );
};

export default {
  createDeck,
  gameDeckUI,
  shuffleDeck,
  dealTopCard,
  dealHand,
  createPlayerHandUI,
  createHandUI,
  createHandUIback,
  gameDeckHandler,
};
