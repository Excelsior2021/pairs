import { Component, createSignal } from "solid-js"
import Modal from "../Modal/Modal"
import { gameStateProp } from "../../types/general"
import "./PairsModal.scss"

export const [showPairsModal, setShowPairsModal] = createSignal(false)

const PairsModal: Component<gameStateProp> = props => (
  <Modal
    showModal={showPairsModal}
    setShowModal={setShowPairsModal}
    heading={null}>
    <div class="pairs-modal">
      <p class="pairs-modal__heading">Your Pairs</p>
      <div class="pairs-modal__pairs" data-testid="player pairs">
        {props.gameState().playerPairsState.UI()}
      </div>
      <p class="pairs-modal__heading">Opponent's Pairs</p>
      <div class="pairs-modal__pairs" data-testid="comp pairs">
        {props.gameState().opponentPairsState.UI()}
      </div>
    </div>
  </Modal>
)

export default PairsModal
