import { Component, createSignal, Switch, Match } from "solid-js"
import Modal from "../Modal/Modal"
import { gameStateProp } from "../../types/general"
import "../PlayerModal/PlayerModal.scss"

export const [showMultiplayerPlayerModal, setShowMultiplayerPlayerModal] =
  createSignal(false)
export const [match, setMatch] = createSignal("")

const MultiplayerPlayerModal: Component<gameStateProp> = props => (
  <Modal
    showModal={showMultiplayerPlayerModal}
    setShowModal={setShowMultiplayerPlayerModal}
    heading={match()}
    playerOutput={props.gameState().playerOutput}>
    <div class="player-modal__output">
      <Switch fallback={null}>
        <Match when={props.gameState().playerOutput === 0}>
          <p class="player-modal__text">
            You have a match! Both cards will be added to your pairs. It's your
            turn again!
          </p>
          {/* <div class="player-modal__cards">
            {
              props.gameState().playerPairsState.UI()[
                props.gameState().playerPairsState.UI().length - 1
              ]
            }
            {
              props.gameState().playerPairsState.UI()[
                props.gameState().playerPairsState.UI().length - 2
              ]
            }
          </div> */}
        </Match>
        <Match when={props.gameState().playerOutput === 1}>
          <p class="player-modal__text">
            The value of the card you chose matches the value of the card you
            dealt from the deck! Both cards will be added to your pairs. It's
            your turn again!
          </p>
          {/* <div class="player-modal__cards">
            {
              props.gameState().playerPairsState.UI()[
                props.gameState().playerPairsState.UI().length - 1
              ]
            }
            {
              props.gameState().playerPairsState.UI()[
                props.gameState().playerPairsState.UI().length - 2
              ]
            }
          </div> */}
        </Match>
        <Match when={props.gameState().playerOutput === 2}>
          <>
            <p class="player-modal__text">
              The value of the card you chose didn't match with the value of the
              dealt card but you had another match in your hand, both cards will
              be added to your pairs. It's your opponent's turn.
            </p>
            {/* <div class="player-modal__cards">
              {
                props.gameState().playerPairsState.UI()[
                  props.gameState().playerPairsState.UI().length - 1
                ]
              }
              {
                props.gameState().playerPairsState.UI()[
                  props.gameState().playerPairsState.UI().length - 2
                ]
              }
            </div> */}
          </>
        </Match>
        <Match when={props.gameState().playerOutput === 3}>
          <p class="player-modal__text">
            No matches, the dealt card has been added to your hand. It's your
            opponent's turn.
          </p>
          {/* <div class="player-modal__cards">
            {
              props.gameState().playerHandState2.UI()[
                props.gameState().playerHandState2.UI().length - 1
              ]
            }
          </div> */}
        </Match>
      </Switch>
    </div>
  </Modal>
)

export default MultiplayerPlayerModal
