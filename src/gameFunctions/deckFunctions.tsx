import cardBack from "../assets/cards/back.png";

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

export const gameDeckUI = (gameDeckHandler = null) => (
  <img
    class="card card--deck"
    src={cardBack}
    alt="game deck"
    onclick={gameDeckHandler}
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

export const createPlayerHandUI = (hand, cardHandler) => (
  <For each={hand}>
    {card => (
      <img
        id={card.id}
        value={card.value}
        class="card card--player"
        src={card.img}
        alt={card.id}
        onclick={cardHandler}
      />
    )}
  </For>
);

export const createHandUI = hand => (
  <For each={hand}>
    {card => (
      <img
        class="card"
        id={card.id}
        value={card.value}
        src={card.img}
        alt={card.id}
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
) => {
  let playerOutput = playerDealt(
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
  });
  dispatchGameAction({ type: "GAME_LOG" });
  setGameDeck(gameDeckUI());
  if (playerOutput === 2 || playerOutput === 3) {
    opponentTurn();
  }
  gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
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
