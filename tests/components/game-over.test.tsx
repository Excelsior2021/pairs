import { describe, expect, test, it, afterEach } from "vitest"
import { render, screen } from "@solidjs/testing-library"
import GameOver from "../../src/components/game-over/game-over"
import { Outcome } from "../../src/enums"

describe("GameOver component", async () => {
  let Component: Element

  afterEach(() => {
    const { unmount } = render(() => Component)
    unmount()
  })

  test("render player wins outcome", () => {
    Component = (
      <GameOver
        outcome={Outcome.Player}
        playerPairsAmount={20}
        opponentPairsAmount={10}
        deckAmount={0}
      />
    ) as Element

    render(() => Component)

    const outcome = screen.getByText(Outcome.Player)

    expect(outcome).toBeInTheDocument()
  })

  test("render opponent wins outcome", () => {
    Component = (
      <GameOver
        outcome={Outcome.Opponent}
        playerPairsAmount={10}
        opponentPairsAmount={20}
        deckAmount={0}
      />
    ) as Element

    render(() => Component)

    const outcome = screen.getByText(Outcome.Opponent)

    expect(outcome).toBeInTheDocument()
  })

  test("render draw outcome", () => {
    Component = (
      <GameOver
        outcome={Outcome.Draw}
        playerPairsAmount={20}
        opponentPairsAmount={20}
        deckAmount={0}
      />
    ) as Element

    render(() => Component)

    const outcome = screen.getByText(Outcome.Draw)

    expect(outcome).toBeInTheDocument()
  })

  it("renders correctly", () => {
    Component = (
      <GameOver
        outcome={Outcome.Player}
        playerPairsAmount={20}
        opponentPairsAmount={10}
        deckAmount={0}
      />
    ) as Element

    render(() => Component)

    const gameOverHeading = screen.getByRole("heading", {
      name: /game over/i,
    })
    const statsHeading = screen.getByRole("heading", {
      name: /stats/i,
    })
    const playerPairsAmount = screen.getByText(/your pairs/i)
    const opponentPairsAmount = screen.getByText(/opponent pairs/i)
    const deckAmount = screen.getByText(/remaining cards in deck/i)

    expect(gameOverHeading).toBeInTheDocument()
    expect(statsHeading).toBeInTheDocument()
    expect(playerPairsAmount).toHaveTextContent(/your pairs: 20/i)
    expect(opponentPairsAmount).toHaveTextContent(/opponent pairs: 10/i)
    expect(deckAmount).toHaveTextContent(/remaining cards in deck: 0/i)
  })
})
