import { createSignal, type Component } from "solid-js"
import Modal from "../modal/modal"
import {
  setMultiplayerSessionStarted,
  setSinglePlayerStarted,
} from "../game-screen/game-screen"
import "./quit-game-modal.scss"

import type { Socket } from "socket.io-client"

export const [showQuitGameModal, setShowQuitGameModal] = createSignal(false)

type props = {
  multiplayer: boolean
  socket: Socket | null
}

const QuitGameModal: Component<props> = props => (
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
