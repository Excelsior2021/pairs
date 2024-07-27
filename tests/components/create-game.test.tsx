import { describe, expect, it } from "vitest"
import { render } from "@solidjs/testing-library"
import CreateGame from "../../src/components/create-game/create-game"

describe("CreateGame component", () => {
  const { getByText } = render(() => <CreateGame />)
  const heading = getByText(/create game session/i)

  it("renders heading", () => {
    expect(heading).toBeInTheDocument()
  })
})
