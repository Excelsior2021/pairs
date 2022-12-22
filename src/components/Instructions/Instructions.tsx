import { Component, createSignal } from "solid-js";
import Modal from "../Modal/Modal";

export const [showInstructions, setShowInstructions] = createSignal(false);

const Instructions: Component = props => (
  <Modal showModal={showInstructions} setShowModal={setShowInstructions}>
    <div class="instructions">
      <h1>Go Fish</h1>
      <p>An adaptation of the classic card game, Go Fish.</p>
      <p>The aim is to have the most pairs at the end of the game.</p>
      <ul>
        <li>Each player is dealt 7 cards from a shuffled deck.</li>
        <li>
          If there are any pairs of cards in any of the players hands at the
          start of the game, they get added to the player's pairs.
        </li>
        <li>
          Each player then takes turns requesting a value of a card in their
          hand to match with in their opponent's hand.
        </li>
        <li>
          If there is a match. The player adds both cards to their pairs and
          goes again.
        </li>
        <li>
          If there is no match. The player has to deal a card from the deck.
        </li>
        <li>
          If the player deals a card that has the same value that they
          requested, the player adds both cards to their pairs and goes again.
        </li>
        <li>
          If the player deals a card that does not have the same value they
          requested but has the same value as another card in their hand, they
          add both cards to their pairs and it's their opponent's turn.
        </li>
        <li>
          If the player deals a card and there are no matches, the dealt card
          gets added to their hand and it's their opponent's turn.
        </li>
        <li>
          The game ends when either player has no cards left or there are no
          more cards in the deck.
        </li>
      </ul>
      <p>Enjoy!</p>
    </div>
  </Modal>
);

export default Instructions;
