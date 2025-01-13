import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

function createReducer(dispatcher, initialState) {
  const [state, setState] = createSignal(initialState)
  return [
    state,
    (...args) => void setState(prevState => dispatcher(prevState, ...args)),
  ]
}

export { createReducer }
