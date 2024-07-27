import { describe, expect, it, test } from "vitest"
import { render, waitFor } from "@solidjs/testing-library"
import MainMenu from "../../src/components/main-menu/main-menu"

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
})
