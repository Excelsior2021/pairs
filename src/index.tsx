/* @refresh reload */
import { render } from "solid-js/web"
import App from "./app"
import "./styles/partials/_globals.scss"

render(() => <App />, document.getElementById("root") as HTMLElement)
