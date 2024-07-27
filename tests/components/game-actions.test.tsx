import { describe, expect, it, vi } from "vitest"
import { render } from "@solidjs/testing-library"
import GameActions from "../../src/components/game-actions/game-actions"
import user from "@testing-library/user-event"

describe("GameActions component", async () => {
  const playerResponseHandlerMock = vi.fn()
  const { getByRole } = render(() => (
    <GameActions playerResponseHandler={playerResponseHandlerMock} />
  ))
  const yesButton = getByRole("button", { name: "Yes" })
  const noButton = getByRole("button", { name: "No" })
  user.setup()

  it("renders buttons", () => {
    expect(yesButton).toBeInTheDocument()
    expect(noButton).toBeInTheDocument()
  })

  it("triggers event handler for yes button with correct argument", async () => {
    await user.click(yesButton)
    expect(playerResponseHandlerMock).toHaveBeenCalledWith(true)
  })

  it("triggers event handler for no button with correct argument", async () => {
    await user.click(noButton)
    expect(playerResponseHandlerMock).toHaveBeenCalledWith(false)
  })
})
