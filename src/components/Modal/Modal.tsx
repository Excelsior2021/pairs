import { Component, createSignal, Show } from "solid-js";
import "./Modal.scss";

const Backdrop: Component = props => (
  <div class="modal__backdrop">{props.children}</div>
);

const Content: Component = props => (
  <div class="modal__container">
    <h2 class="modal__heading">{props.heading}</h2>
    <div class="modal__content">{props.children}</div>
  </div>
);

const Modal: Component = props => {
  return (
    <Show when={props.showModal()} fallback={null}>
      <Backdrop>
        <Content children={props.children} heading={props.heading} />
        <button
          class="button modal__button"
          onclick={() => props.setShowModal(false)}
        >
          close
        </button>
      </Backdrop>
    </Show>
  );
};
export default Modal;
