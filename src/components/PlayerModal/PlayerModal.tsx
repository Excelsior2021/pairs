import { Component, createSignal, Switch, Match } from "solid-js"
import Modal from "../Modal/Modal"
import { gameStateProp } from "../../types/general"
import "./PlayerModal.scss"

export const [showPlayerModal, setShowPlayerModal] = createSignal(false)
export const [match, setMatch] = createSignal("")

const PlayerModal: Component<gameStateProp> = props => (
  <Modal
    showModal={showPlayerModal}
    setShowModal={setShowPlayerModal}
    heading={match()}
    playerOutput={props.gameState().playerOutput}>
    <div class="player-modal__output">
      <Switch fallback={null}>
        <Match when={props.gameState().playerOutput === 0}>
          <p class="player-modal__text">
            You have a match! Both cards will be added to your pairs. It's your
            turn again!
          </p>
          <div class="player-modal__cards">
            {
              props.gameState().playerPairsUI()[
                props.gameState().playerPairsUI().length - 1
              ]
            }
            {
              props.gameState().playerPairsUI()[
                props.gameState().playerPairsUI().length - 2
              ]
            }
          </div>
        </Match>
        <Match when={props.gameState().playerOutput === 1}>
          <p class="player-modal__text">
            The value of the card you chose matches the value of the card you
            dealt from the deck! Both cards will be added to your pairs. It's
            your turn again!
          </p>
          <div class="player-modal__cards">
            {
              props.gameState().playerPairsUI()[
                props.gameState().playerPairsUI().length - 1
              ]
            }
            {
              props.gameState().playerPairsUI()[
                props.gameState().playerPairsUI().length - 2
              ]
            }
          </div>
        </Match>
        <Match when={props.gameState().playerOutput === 2}>
          <>
            <p class="player-modal__text">
              The value of the card you chose didn't match with the value of the
              dealt card but you had another match in your hand, both cards will
              be added to your pairs. It's your opponent's turn.
            </p>
            <div class="player-modal__cards">
              {
                props.gameState().playerPairsUI()[
                  props.gameState().playerPairsUI().length - 1
                ]
              }
              {
                props.gameState().playerPairsUI()[
                  props.gameState().playerPairsUI().length - 2
                ]
              }
            </div>
          </>
        </Match>
        <Match when={props.gameState().playerOutput === 3}>
          <p class="player-modal__text">
            No matches, the dealt card has been added to your hand. It's your
            opponent's turn.
          </p>
          <div class="player-modal__cards">
            {
              props.gameState().playerHand2UI()[
                props.gameState().playerHand2UI().length - 1
              ]
            }
          </div>
        </Match>
      </Switch>
    </div>
  </Modal>
)

export default PlayerModal
