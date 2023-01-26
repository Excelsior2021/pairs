import { Component } from "solid-js"
import "./AwaitConnection.scss"

const AwaitConnection: Component = props => (
  <div class="await-connection">
    <p class="await-connection__text">waiting for opponent to connect...</p>
    <p class="await-connection__text">session ID: {props.sessionID()}</p>
  </div>
)

export default AwaitConnection
