import { createSignal, type Component } from "solid-js"
import Modal from "@components/modal/modal"
import {
  setMultiplayerSessionStarted,
  setSessionStarted,
} from "@components/game-screen/game-screen"
import { GameAction, ModalHeadingColor } from "@enums"
import "./quit-game-modal.scss"

import type { dispatchGameActionType } from "@types"

export const [showQuitGameModal, setShowQuitGameModal] = createSignal(false)

type props = {
  multiplayer?: true
  dispatchGameAction?: dispatchGameActionType
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
          if (props.multiplayer && props.dispatchGameAction)
            props.dispatchGameAction({ type: GameAction.PLAYER_DISCONNECT })
        }}>
        confirm
      </button>
    </div>
  </Modal>
)

export default QuitGameModal
