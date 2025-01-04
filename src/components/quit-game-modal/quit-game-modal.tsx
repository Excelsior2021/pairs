import { createSignal, type Component } from "solid-js"
import Modal from "@components/modal/modal"
import {
  setMultiplayerSessionStarted,
  setSessionStarted,
} from "@components/game-screen/game-screen"
import { ModalHeadingColor } from "@enums"
import "./quit-game-modal.scss"

export const [showQuitGameModal, setShowQuitGameModal] = createSignal(false)

type props = {
  playerDisconnect?: () => void
}

const QuitGameModal: Component<props> = props => (
  <Modal
    showModal={showQuitGameModal}
    setShowModal={setShowQuitGameModal}
    heading="quit game"
    headingColor={ModalHeadingColor.red}
    hideTitle={true}>
    <div class="quit-game-modal">
      <p class="quit-game-modal__text">
        Are you sure you want to quit this game? All progress will be lost.
      </p>
      <button
        class="quit-game-modal__button"
        onclick={() => {
          setSessionStarted(false)
          setMultiplayerSessionStarted(false)
          setShowQuitGameModal(false)
          if (props.playerDisconnect) props.playerDisconnect()
        }}>
        confirm
      </button>
    </div>
  </Modal>
)

export default QuitGameModal
