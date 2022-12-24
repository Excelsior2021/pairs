import { Component, createSignal } from "solid-js";
import Modal from "../Modal/Modal";

export const [showPairsModal, setShowPairsModal] = createSignal(false);

const PairsModal: Component = props => {
  return (
    <Modal showModal={showPairsModal} setShowModal={setShowPairsModal}>
      <p class="pairs-modal__heading">Your Pairs</p>
      <div class="pairs-modal__pairs" data-testid="player pairs">
        {props.gameState().playerPairsState.UI()}
      </div>
      <p class="pairs-modal__heading">Opponent's Pairs</p>
      <div class="pairs-modal__pairs" data-testid="comp pairs">
        {props.gameState().opponentPairsState.UI()}
      </div>
    </Modal>
  );
};

export default PairsModal;
