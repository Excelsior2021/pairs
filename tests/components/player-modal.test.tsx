import { describe, expect, it, vi } from "vitest"
import { render } from "@solidjs/testing-library"
import PlayerModal from "@components/player-modal/player-modal"
import user from "@testing-library/user-event"
import { singlePlayerGamestate } from "../__mocks__/game-state"
import { createReducer } from "@solid-primitives/memo"

describe("PlayerModal component", async () => {
  const reducerMock = vi.fn()
  const [gameState, dispatchGameAction] = createReducer(
    reducerMock,
    singlePlayerGamestate
  )

  const {} = render(() => <PlayerModal gameState={gameState} />)
  it("", () => {})
})
