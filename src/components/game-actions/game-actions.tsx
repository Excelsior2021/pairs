import { For, type Component } from "solid-js"

type props = {
  playerResponseHandler: (hasCard: boolean) => void
}

const GameActions: Component<props> = props => {
  const actions = [
    {
      name: "yes",
      onclick: () => props.playerResponseHandler(true),
    },
    {
      name: "no",
      onclick: () => props.playerResponseHandler(false),
    },
  ]

  return (
    <div class="game__actions">
      <For each={actions}>
        {action => (
          <button class="game__button" onclick={action.onclick}>
            {action.name}
          </button>
        )}
      </For>
    </div>
  )
}

export default GameActions
