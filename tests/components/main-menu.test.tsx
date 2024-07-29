import { afterEach, describe, expect, it, test, vi } from "vitest"
import { render, waitFor } from "@solidjs/testing-library"
import user from "@testing-library/user-event"
import MainMenu from "../../src/components/main-menu/main-menu"
import {
  setMultiplayerMenu,
  setSinglePlayerStarted,
} from "../../src/components/game-screen/game-screen"
import { setShowInstructions } from "../../src/components/instructions/instructions"

describe("MainMenu Component", () => {
  const { getByRole, getByTestId } = render(() => <MainMenu />)

  const heading = getByRole("heading", {
    level: 2,
  })

  const singlePlayerButton = getByRole("button", {
    name: /single player/i,
  })

  const multiplayerButton = getByRole("button", {
    name: /multiplayer/i,
  })

  const instructionsButton = getByRole("button", {
    name: /instructions/i,
  })

  const mainMenuWrapper = getByTestId("main-menu")

  it("renders", () => {
    expect(heading).toBeInTheDocument()
    expect(singlePlayerButton).toBeInTheDocument()
    expect(multiplayerButton).toBeInTheDocument()
    expect(instructionsButton).toBeInTheDocument()
  })

  test("animation", async () => {
    expect(mainMenuWrapper.className).toBe("main-menu")

    await waitFor(
      () =>
        expect(mainMenuWrapper.className).toBe(
          "main-menu main-menu--no-animation"
        ),
      {
        timeout: 500,
      }
    )
  })

  describe("actions", () => {
    vi.mock("../../src/components/game-screen/game-screen")
    vi.mock("../../src/components/instructions/instructions")
    user.setup()

    afterEach(() => {
      vi.resetAllMocks()
    })

    test("single player button clicked", async () => {
      await user.click(singlePlayerButton)
      expect(setSinglePlayerStarted).toHaveBeenCalledWith(true)
    })

    test("multiplayer button clicked", async () => {
      await user.click(multiplayerButton)
      expect(setMultiplayerMenu).toHaveBeenCalledWith(true)
    })

    test("instructions button clicked", async () => {
      await user.click(instructionsButton)
      expect(setShowInstructions).toHaveBeenCalledWith(true)
    })
  })
})
