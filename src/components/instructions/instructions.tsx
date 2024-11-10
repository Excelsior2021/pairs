import { For, createSignal, type Component } from "solid-js"
import Modal from "@/components/modal/modal"
import "./instructions.scss"

export const [showInstructions, setShowInstructions] = createSignal(false)

const Instructions: Component = () => {
  const instructions = [
    "Each player is dealt 7 cards from a shuffled deck.",
    "If there are any pairs of cards in any of the players hands at the start of the game, they get added to the player's pairs.",
    "Each player then takes turns requesting a value of a card in their hand to match with in their opponent's hand.",
    "If there is a match. Both cards are added to the player's pairs and they go again.",
    "If there is no match. The player has to deal a card from the deck.",
    "If the player deals a card that has the same value that they requested, both cards are added to their pairs and they go again.",
    "If the player deals a card that does not have the same value they requested but has the same value as another card in their hand, both cards are added to their pairs and it's their opponent's turn.",
    "If the player deals a card and there are no matches, the dealt card gets added to their hand and it's their opponent's turn.",
    "The game ends when either player has no cards left or there are no more cards in the deck.",
  ]
  return (
    <Modal
      showModal={showInstructions}
      setShowModal={setShowInstructions}
      heading="instructions">
      <div class="instructions">
        <p class="instructions__text">
          The aim is to have the most pairs of cards at the end of the game.
        </p>
        <ul class="instructions__list">
          <For each={instructions}>
            {instruction => <li class="instructions__item">{instruction}</li>}
          </For>
        </ul>
      </div>
    </Modal>
  )
}

export default Instructions
