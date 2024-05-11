import { Component, For, createSignal } from "solid-js"
import { gameStateProp } from "../../../types"
import Modal from "../modal/modal"
import "./pairs-modal.scss"

export const [showPairsModal, setShowPairsModal] = createSignal(false)

const PairsModal: Component<gameStateProp> = props => (
  <Modal
    showModal={showPairsModal}
    setShowModal={setShowPairsModal}
    heading={null}>
    <div class="pairs-modal">
      <p class="pairs-modal__heading">
        Your Pairs ({props.gameState().player!.pairs.length})
      </p>
      <div class="pairs-modal__pairs" data-testid="player pairs">
        <For each={props.gameState().player!.pairs}>
          {card => (
            <img id={card.id} class="card" src={card.img} alt={card.id} />
          )}
        </For>
      </div>
      <p class="pairs-modal__heading">
        Opponent's Pairs ({props.gameState().opponent!.pairs.length})
      </p>
      <div class="pairs-modal__pairs" data-testid="comp pairs">
        <For each={props.gameState().opponent!.pairs}>
          {card => (
            <img id={card.id} class="card" src={card.img} alt={card.id} />
          )}
        </For>
      </div>
    </div>
  </Modal>
)

export default PairsModal
