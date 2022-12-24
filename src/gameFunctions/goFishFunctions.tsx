export const initialPairs = hand => {
  let pairs = [];
  hand.forEach(cardX =>
    hand.forEach(cardY => {
      if (
        cardX.value === cardY.value &&
        cardX.suit !== cardY.suit &&
        !pairs.includes(cardX) &&
        !pairs.includes(cardY)
      )
        pairs.push(cardX, cardY);
    })
  );

  pairs.forEach(cardP =>
    hand.forEach(cardH => {
      if (cardP === cardH) {
        hand.splice(hand.indexOf(cardH), 1);
      }
    })
  );
  return pairs;
};

export const createPairsUI = pairs => (
  <For each={pairs}>
    {card => <img id={card.id} class="card" src={card.img} alt={card.id} />}
  </For>
);

export const playerHandUnclickable = (
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI
) => {
  const playerHandUnclickable = true;
  updateUI(
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    playerTurnHandler,
    playerHandUnclickable
  );
};

export const gameOver = (
  shuffledDeck,
  playerHand,
  opponentHand,
  playerPairs,
  opponentPairs,
  playerTurnHandler,
  updateUI,
  dispatchGameAction
) => {
  if (
    playerHand.length === 0 ||
    opponentHand.length === 0 ||
    shuffledDeck.length === 0
  ) {
    const playerPairsAmount = playerPairs.length;
    const opponentPairsAmount = opponentPairs.length;
    const deckRemaining = shuffledDeck.length;
    let winner;
    if (playerPairsAmount > opponentPairsAmount) {
      winner = "You won! Well done!";
    } else if (playerPairsAmount === opponentPairsAmount) {
      winner = "It's a draw!";
    } else {
      winner = "Your opponent won! Better luck next time!";
    }
    const log = (
      <div>
        <div>
          <h1>GAME OVER</h1>
          <h3>{winner}</h3>
        </div>
        <div>
          <h2 class="stats-heading">STATS</h2>
          <p>Player Pairs: {playerPairsAmount}</p>
          <p>Opponent Pairs: {opponentPairsAmount}</p>
          <p>Remaining cards in deck: {deckRemaining}</p>
        </div>
      </div>
    );
    dispatchGameAction({ type: "GAME_LOG", log });
    playerHandUnclickable(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      playerTurnHandler,
      updateUI
    );
    dispatchGameAction({ type: "GAME_OVER" });
    return true;
  }
};

export default {
  initialPairs,
  createPairsUI,
  playerHandUnclickable,
  gameOver,
};
