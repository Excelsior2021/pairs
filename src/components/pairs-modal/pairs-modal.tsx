import { For, createSignal, type Component } from "solid-js"
import Card from "@components/card/card"
import Modal from "@components/modal/modal"
import "./pairs-modal.scss"

import type { gameStateProp } from "@types"

export const [showPairsModal, setShowPairsModal] = createSignal(false)

const PairsModal: Component<gameStateProp> = props => (
  <Modal showModal={showPairsModal} setShowModal={setShowPairsModal}>
    <div class="pairs-modal">
      <div class="pairs-modal__pairs-container">
        <p class="pairs-modal__heading">{`Your Pairs (${
          props.gameState().player!.pairs.length
        })`}</p>
        <div class="pairs-modal__pairs" data-testid={`player pairs`}>
          <For each={props.gameState().player!.pairs}>
            {card => <Card card={card} show={true} />}
          </For>
        </div>
      </div>
      <div class="pairs-modal__pairs-container">
        <p class="pairs-modal__heading">{`Opponent's Pairs (${
          props.gameState().opponent!.pairs.length
        })`}</p>
        <div class="pairs-modal__pairs" data-testid={`opponent pairs`}>
          <For each={props.gameState().opponent!.pairs}>
            {card => <Card card={card} show={true} />}
          </For>
        </div>
      </div>
    </div>
  </Modal>
)

export default PairsModal
