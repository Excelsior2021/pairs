import { Component, createSignal, Switch, Match } from "solid-js";
import { createHandUI } from "../../gameFunctions/deckFunctions";
import Modal from "../Modal/Modal";
import "./PlayerModal.scss";

export const [showPlayerModal, setShowPlayerModal] = createSignal(false);

const PlayerModal: Component = props => {
  return (
    <Modal showModal={showPlayerModal} setShowModal={setShowPlayerModal}>
      <div class="player-modal__output">
        <Switch fallback={null}>
          <Match when={props.gameState().playerOutput === 0}>
            <p>
              You have a match! Both cards will be added to your pairs. It's
              your turn again!
            </p>
            <span>
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
            </span>
          </Match>
          <Match when={props.gameState().playerOutput === 1}>
            <p>
              The value of the card you chose matches the value of the card you
              dealt from the deck! Both cards will be added to your pairs. It's
              your turn again!
            </p>
            <span>
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
            </span>
          </Match>
          <Match when={props.gameState().playerOutput === 2}>
            <>
              <p>
                The value of the card you chose didn't match with the value of
                the dealt card but you had another match in your hand, both
                cards will be added to your pairs. It's your opponent's turn.
              </p>
              <span>
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
              </span>
            </>
          </Match>
          <Match when={props.gameState().playerOutput === 3}>
            <p>
              No matches, the dealt card has been added to your hand. It's your
              opponent's turn.
            </p>
            <span>
              {
                props.gameState().playerHandState2.UI()[
                  props.gameState().playerHandState2.UI().length - 1
                ]
              }
            </span>
          </Match>
        </Switch>
      </div>
    </Modal>
  );
};

export default PlayerModal;
