import { Component, createSignal } from "solid-js"
import Modal from "../Modal/Modal"
import "./Instructions.scss"

export const [showInstructions, setShowInstructions] = createSignal(false)

const Instructions: Component = () => (
  <Modal
    showModal={showInstructions}
    setShowModal={setShowInstructions}
    heading="instructions">
    <div class="instructions">
      <p class="instructions__text">
        The aim is to have the most pairs of cards at the end of the game.
      </p>
      <ul class="instructions__list">
        <li class="instructions__item">
          Each player is dealt 7 cards from a shuffled deck.
        </li>
        <li class="instructions__item">
          If there are any pairs of cards in any of the players hands at the
          start of the game, they get added to the player's pairs.
        </li>
        <li class="instructions__item">
          Each player then takes turns requesting a value of a card in their
          hand to match with in their opponent's hand.
        </li>
        <li class="instructions__item">
          If there is a match. Both cards are added to the player's pairs and
          they go again.
        </li>
        <li class="instructions__item">
          If there is no match. The player has to deal a card from the deck.
        </li>
        <li class="instructions__item">
          If the player deals a card that has the same value that they
          requested, both cards are added to their pairs and they go again.
        </li>
        <li class="instructions__item">
          If the player deals a card that does not have the same value they
          requested but has the same value as another card in their hand, both
          cards are added to their pairs and it's their opponent's turn.
        </li>
        <li class="instructions__item">
          If the player deals a card and there are no matches, the dealt card
          gets added to their hand and it's their opponent's turn.
        </li>
        <li class="instructions__item">
          The game ends when either player has no cards left or there are no
          more cards in the deck.
        </li>
      </ul>
      <p class="instructions__text instructions__text--em">Enjoy!</p>
    </div>
  </Modal>
)

export default Instructions
