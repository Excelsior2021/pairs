import { Component, For, createSignal } from "solid-js"
import { gameStateMultiplayerProp, gameStateProp } from "../../types/general"
import Modal from "../Modal/Modal"
import "./PairsModal.scss"

export const [showPairsModal, setShowPairsModal] = createSignal(false)

const PairsModal: Component<
  gameStateProp | gameStateMultiplayerProp
> = props => (
  <Modal
    showModal={showPairsModal}
    setShowModal={setShowPairsModal}
    heading={null}>
    <div class="pairs-modal">
      <p class="pairs-modal__heading">
        Your Pairs ({props.gameState().playerPairs.length})
      </p>
      <div class="pairs-modal__pairs" data-testid="player pairs">
        <For each={props.gameState().playerPairs}>
          {card => (
            <img id={card.id} class="card" src={card.img} alt={card.id} />
          )}
        </For>
      </div>
      <p class="pairs-modal__heading">
        Opponent's Pairs ({props.gameState().opponentPairs.length})
      </p>
      <div class="pairs-modal__pairs" data-testid="comp pairs">
        <For each={props.gameState().opponentPairs}>
          {card => (
            <img id={card.id} class="card" src={card.img} alt={card.id} />
          )}
        </For>
      </div>
    </div>
  </Modal>
)

export default PairsModal
