import { type Setter, type Component } from "solid-js"
import Modal from "@components/modal/modal"
import { ModalHeadingColor } from "@enums"
import "./quit-game-modal.scss"

type props = {
  playerDisconnect?: () => void
  showQuitGameModal: boolean
  setSessionStarted: Setter<boolean>
  setMultiplayerSessionStarted: Setter<boolean>
  setShowQuitGameModal: Setter<boolean>
}

const QuitGameModal: Component<props> = props => (
  <Modal
    showModal={props.showQuitGameModal}
    setShowModal={props.setShowQuitGameModal}
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
          props.setSessionStarted(false)
          props.setMultiplayerSessionStarted(false)
          props.setShowQuitGameModal(false)
          if (props.playerDisconnect) props.playerDisconnect()
        }}>
        confirm
      </button>
    </div>
  </Modal>
)

export default QuitGameModal
