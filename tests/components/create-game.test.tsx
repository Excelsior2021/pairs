import { describe, expect, it } from "vitest"
import { render } from "@solidjs/testing-library"
import CreateGame from "@components/create-game/create-game"

describe("CreateGame component", () => {
  const sessionIDMock = "1234"
  const { getByText } = render(() => <CreateGame sessionID={sessionIDMock} />)
  const sessionIDEl = getByText(sessionIDMock)

  it("renders the session ID", () => {
    expect(sessionIDEl).toBeInTheDocument()
  })
})
