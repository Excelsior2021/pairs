import { Component, createSignal } from "solid-js"
import Modal from "../Modal/Modal"
import {
  setMultiplayerSessionStarted,
  setSinglePlayerStarted,
} from "../GameScreen/GameScreen"
import "./QuitGameModal.scss"
import { quitGameModalProps } from "../../types/general"

export const [showQuitGameModal, setShowQuitGameModal] = createSignal(false)

const QuitGameModal: Component<quitGameModalProps> = props => (
  <Modal
    showModal={showQuitGameModal}
    setShowModal={setShowQuitGameModal}
    heading="quit game"
    playerOutput={3}>
    <div class="quit-game-modal">
      <p class="quit-game-modal__text">
        Are you sure you want to quit this game? All progress will be lost.
      </p>
      <button
        class="quit-game-modal__button"
        onclick={() => {
          setSinglePlayerStarted(false)
          setMultiplayerSessionStarted(false)
          setShowQuitGameModal(false)
          if (props.multiplayer) props.socket?.disconnect()
        }}>
        confirm
      </button>
    </div>
  </Modal>
)

export default QuitGameModal
