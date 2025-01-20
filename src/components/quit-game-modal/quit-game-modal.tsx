import Modal from "@components/modal/modal"
import { ModalHeadingColor } from "@enums"
import "./quit-game-modal.scss"

import type { Setter, Component } from "solid-js"
import type { multiplayerConfig } from "@types"

type props = {
  multiplayerConfig: multiplayerConfig
  setGameMode: Setter<null>
  playerDisconnectHandler?: () => void
  showQuitGameModal: boolean
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
          props.multiplayerConfig.socket = null
          props.multiplayerConfig.sessionID = ""
          props.multiplayerConfig.playerID = null
          props.setGameMode(null)
          props.setShowQuitGameModal(false)
          if (props.playerDisconnectHandler) props.playerDisconnectHandler()
        }}>
        confirm
      </button>
    </div>
  </Modal>
)

export default QuitGameModal
