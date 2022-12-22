import { Component, createSignal, Show } from "solid-js";
import "./Modal.scss";

const Backdrop: Component = props => (
  <div class="modal__backdrop">{props.children}</div>
);

const Content: Component = props => (
  <div class="modal__content">{props.children}</div>
);

const Modal: Component = props => {
  console.log(props);
  return (
    <Show when={props.showModal()} fallback={null}>
      <Backdrop>
        <Content children={props.children} />
        <button class="modal__button" onclick={() => props.setShowModal(false)}>
          close
        </button>
      </Backdrop>
    </Show>
  );
};
export default Modal;
