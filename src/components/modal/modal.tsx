import {
  Show,
  type ParentComponent,
  type Accessor,
  type Setter,
} from "solid-js"
import "./modal.scss"
import { PlayerOutput } from "@/enums"

type contentProps = {
  heading: string | null
  subHeading?: string | null
  playerOutput?: number
}

type modalProps = {
  heading: string | null
  subHeading?: string | null
  showModal: Accessor<boolean>
  setShowModal: Setter<boolean>
  playerOutput?: number
  hideTitle?: true
}

const Backdrop: ParentComponent = props => (
  <div class="modal__backdrop">{props.children}</div>
)

const Content: ParentComponent<contentProps> = props => (
  <div class="modal__container">
    <div class="modal__heading-container">
      <h2
        class={
          props.playerOutput !== undefined
            ? props.playerOutput! < PlayerOutput.NoMatch
              ? "modal__heading modal__heading--match"
              : "modal__heading modal__heading--no-match"
            : "modal__heading"
        }>
        {props.heading}
      </h2>
      <h3
        class={
          props.playerOutput! < PlayerOutput.NoMatch
            ? "modal__sub-heading modal__sub-heading--match"
            : "modal__sub-heading modal__sub-heading--no-match"
        }>
        {props.subHeading}
      </h3>
    </div>

    <div class="modal__content">{props.children}</div>
  </div>
)

const Modal: ParentComponent<modalProps> = props => (
  <Show when={props.showModal()} fallback={null}>
    <Backdrop>
      {!props.hideTitle && <p class="modal__title">Pairs</p>}
      <Content
        children={props.children}
        heading={props.heading}
        subHeading={props.subHeading}
        playerOutput={props.playerOutput}
      />
      <button class="modal__button" onclick={() => props.setShowModal(false)}>
        close
      </button>
    </Backdrop>
  </Show>
)

export default Modal
