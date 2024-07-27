import { describe, expect, test, it, afterEach } from "vitest"
import { render } from "@solidjs/testing-library"
import GameOver from "../../src/components/game-over/game-over"
import { Outcome } from "../../src/enums"

describe("GameOver component", () => {
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

    const { getByText } = render(() => Component)

    const outcome = getByText(Outcome.Player)

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

    const { getByText } = render(() => Component)

    const outcome = getByText(Outcome.Opponent)

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

    const { getByText } = render(() => Component)

    const outcome = getByText(Outcome.Draw)

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

    const { getByRole, getByText } = render(() => Component)

    const gameOverHeading = getByRole("heading", {
      name: /game over/i,
    })
    const statsHeading = getByRole("heading", {
      name: /stats/i,
    })
    const playerPairsAmount = getByText(/your pairs/i)
    const opponentPairsAmount = getByText(/opponent pairs/i)
    const deckAmount = getByText(/remaining cards in deck/i)

    expect(gameOverHeading).toBeInTheDocument()
    expect(statsHeading).toBeInTheDocument()
    expect(playerPairsAmount).toHaveTextContent(/your pairs: 20/i)
    expect(opponentPairsAmount).toHaveTextContent(/opponent pairs: 10/i)
    expect(deckAmount).toHaveTextContent(/remaining cards in deck: 0/i)
  })
})
