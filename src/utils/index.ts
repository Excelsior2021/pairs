import { createSignal } from "solid-js"

function createReducer(dispatcher, initialState) {
  const [state, setState] = createSignal(initialState)
  return [
    state,
    (...args) => void setState(prevState => dispatcher(prevState, ...args)),
  ]
}

export { createReducer }
