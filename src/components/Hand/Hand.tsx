import { Component } from "solid-js"
import { handProp } from "../../types/general"
import "./Hand.scss"

const Hand: Component<handProp> = props => (
  <div class="hand">
    <p class="hand__heading">{props.heading}</p>
    <div class="hand__hand">{props.hand}</div>
  </div>
)

export default Hand
