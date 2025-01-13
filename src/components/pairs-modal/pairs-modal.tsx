import { For, type Component, type Setter } from "solid-js"
import Card from "@components/card/card"
import Modal from "@components/modal/modal"
import "./pairs-modal.scss"

import type { Opponent, Player } from "@game-objects"

type props = {
  player: Player
  opponent: Player | Opponent
  showPairsModal: boolean
  setShowPairsModal: Setter<boolean>
}

const PairsModal: Component<props> = props => (
  <Modal
    showModal={props.showPairsModal}
    setShowModal={props.setShowPairsModal}>
    <div class="pairs-modal">
      <div class="pairs-modal__pairs-container">
        <p class="pairs-modal__heading">{`Your Pairs (${props.player.pairs.length})`}</p>
        <div class="pairs-modal__pairs" data-testid="player pairs">
          <For each={props.player.pairs}>
            {card => <Card card={card} show={true} />}
          </For>
        </div>
      </div>
      <div class="pairs-modal__pairs-container">
        <p class="pairs-modal__heading">{`Opponent's Pairs (${props.opponent.pairs.length})`}</p>
        <div class="pairs-modal__pairs" data-testid="opponent pairs">
          <For each={props.opponent.pairs}>
            {card => <Card card={card} show={true} />}
          </For>
        </div>
      </div>
    </div>
  </Modal>
)

export default PairsModal
