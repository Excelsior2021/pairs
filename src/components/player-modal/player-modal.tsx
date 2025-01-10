import { createSignal, Switch, Match, type Component, For } from "solid-js"
import Card from "@components/card/card"
import Modal from "@components/modal/modal"
import { ModalHeadingColor, PlayerOutput } from "@enums"
import "./player-modal.scss"

import type { Player } from "@game-objects"

export const [showPlayerModal, setShowPlayerModal] = createSignal(false)
export const [matchStatusHeading, setMatchStatusHeading] = createSignal("")
export const [matchStatusSubHeading, setMatchStatusSubHeading] =
  createSignal("")

type props = {
  player: Player
  playerOutput: PlayerOutput
}

const PlayerModal: Component<props> = props => (
  <Modal
    showModal={showPlayerModal()}
    setShowModal={setShowPlayerModal}
    heading={matchStatusHeading()}
    subHeading={matchStatusSubHeading()}
    headingColor={
      props.playerOutput! < 3 ? ModalHeadingColor.green : ModalHeadingColor.red
    }
    hideTitle={true}>
    <div class="player-modal__output">
      <p class="player-modal__text">
        <Switch>
          <Match when={props.playerOutput === PlayerOutput.OpponentMatch}>
            You have a match! Both cards will be added to your pairs. It's your
            turn again!
          </Match>
          <Match when={props.playerOutput === PlayerOutput.DeckMatch}>
            The value of the card you chose matches the value of the card you
            dealt from the deck! Both cards will be added to your pairs. It's
            your turn again!
          </Match>
          <Match when={props.playerOutput === PlayerOutput.HandMatch}>
            The value of the card you chose didn't match with the value of the
            dealt card but you had another match in your hand, both cards will
            be added to your pairs. It's your opponent's turn.
          </Match>
          <Match when={props.playerOutput === PlayerOutput.NoMatch}>
            No matches, the dealt card has been added to your hand. It's your
            opponent's turn.
          </Match>
        </Switch>
      </p>
      <div class="player-modal__cards">
        <Switch>
          <Match when={props.playerOutput !== PlayerOutput.NoMatch}>
            <For each={props.player!.pairs.slice(-2)}>
              {card => <Card card={card} show={true} />}
            </For>
          </Match>
          <Match when={props.playerOutput === PlayerOutput.NoMatch}>
            {props.player!.hand.length > 0 && (
              <Card
                card={props.player!.hand[props.player!.hand.length - 1]}
                show={true}
              />
            )}
          </Match>
        </Switch>
      </div>
    </div>
  </Modal>
)

export default PlayerModal
