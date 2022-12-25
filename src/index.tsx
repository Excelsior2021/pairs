/* @refresh reload */
import { render } from "solid-js/web"
import App from "./App"
import "./styles/partials/_globals.scss"

render(() => <App />, document.getElementById("root") as HTMLElement)
