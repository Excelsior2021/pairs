import { Show, type ParentComponent, type Setter } from "solid-js"
import { ModalHeadingColor } from "@enums"
import "./modal.scss"

type contentProps = {
  heading?: string
  subHeading?: string
  headingColor?: ModalHeadingColor
}

type modalProps = {
  showModal: boolean
  setShowModal: Setter<boolean>
  heading?: string
  subHeading?: string
  headingColor?: ModalHeadingColor
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
          props.headingColor
            ? `modal__heading modal__heading--${props.headingColor}`
            : "modal__heading"
        }>
        {props.heading}
      </h2>
      <h3
        class={
          props.headingColor
            ? `modal__heading modal__heading--${props.headingColor}`
            : "modal__heading"
        }>
        {props.subHeading}
      </h3>
    </div>

    <div class="modal__content">{props.children}</div>
  </div>
)

const Modal: ParentComponent<modalProps> = props => (
  <Show when={props.showModal} fallback={null}>
    <Backdrop>
      {!props.hideTitle && <p class="modal__title">Pairs</p>}
      <Content
        children={props.children}
        heading={props.heading}
        subHeading={props.subHeading}
        headingColor={props.headingColor}
      />
      <button class="modal__button" onclick={() => props.setShowModal(false)}>
        close
      </button>
    </Backdrop>
  </Show>
)

export default Modal
