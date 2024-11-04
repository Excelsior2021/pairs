import { For, createSignal, type Component } from "solid-js"
import Card from "@/components/card/card"
import Modal from "@/components/modal/modal"
import "./pairs-modal.scss"

import type { gameStateProp } from "@/types"

export const [showPairsModal, setShowPairsModal] = createSignal(false)

const PairsModal: Component<gameStateProp> = props => {
  const pairsObjs = [
    {
      player: "player",
      heading: `Your Pairs (${props.gameState().player!.pairs.length})`,
      pairs: props.gameState().player!.pairs,
    },
    {
      player: "opponent",
      heading: `Opponent's Pairs (${props.gameState().opponent!.pairs.length})`,
      pairs: props.gameState().opponent!.pairs,
    },
  ]

  return (
    <Modal
      showModal={showPairsModal}
      setShowModal={setShowPairsModal}
      heading={null}>
      <div class="pairs-modal">
        <For each={pairsObjs}>
          {pairs => (
            <div class="pairs-modal__pairs-container">
              <p class="pairs-modal__heading">{pairs.heading}</p>
              <div
                class="pairs-modal__pairs"
                data-testid={`${pairs.player} pairs`}>
                <For each={pairs.pairs}>
                  {card => <Card card={card} show={true} />}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </Modal>
  )
}

export default PairsModal
