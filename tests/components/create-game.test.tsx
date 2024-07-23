import { describe, expect, test } from "vitest"
import { render, screen } from "@solidjs/testing-library"
import CreateGame from "../../src/components/create-game/create-game"

describe("CreateGame component", async () => {
  render(() => <CreateGame />)
  const heading = await screen.findByText(/create game session/i)
  test("heading in document", () => {
    expect(heading).toBeInTheDocument()
  })
})
