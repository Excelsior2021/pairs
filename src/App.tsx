import type { Component } from "solid-js"
import GameScreen from "./components/GameScreen/GameScreen"
import "./App.scss"

pendo.initialize({
  visitor: {
    id: null, // Required if user is logged in
    // email:        // Recommended if using Pendo Feedback, or NPS Email
    // full_name:    // Recommended if using Pendo Feedback
    // role:         // Optional

    // You can add any additional visitor level key-values here,
    // as long as it's not one of the above reserved names.
  },

  account: {
    id: null, // Highly recommended, required if using Pendo Feedback
    // name:         // Optional
    // is_paying:    // Recommended if using Pendo Feedback
    // monthly_value:// Recommended if using Pendo Feedback
    // planLevel:    // Optional
    // planPrice:    // Optional
    // creationDate: // Optional

    // You can add any additional account level key-values here,
    // as long as it's not one of the above reserved names.
  },
})

const App: Component = () => (
  <div class="app">
    <a
      class="app__link"
      href="https://jonathankila.vercel.app"
      target="_blank"
      rel="noreferrer">
      <h1 class="app__title">Pairs</h1>
    </a>
    <a class="counter" href="https://www.free-website-hit-counter.com">
      <img
        src="https://www.free-website-hit-counter.com/c.php?d=9&id=143227&s=5"
        alt="Free Website Hit Counter"
      />
    </a>
    <GameScreen />
  </div>
)

export default App
