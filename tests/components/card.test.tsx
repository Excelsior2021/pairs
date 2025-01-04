import { describe, expect, it, vi } from "vitest"
import { render } from "@solidjs/testing-library"
import Card from "@components/card/card"
import { nonNumCardValue, suit } from "@enums"
import userEvent from "@testing-library/user-event"

describe("Card component", () => {
  const cardMock = {
    id: "ace_of_clubs",
    value: nonNumCardValue.ace,
    suit: suit.clubs,
    img: "./cards/ace_of_clubs.webp",
  }

  it("renders an opponent card", async () => {
    const { getByRole } = render(() => <Card card={cardMock} />)
    const cardEl = getByRole("img")

    expect(cardEl).toHaveClass("card")
    expect(cardEl.id).toBe("")
    expect(cardEl).not.toHaveClass("card--player")
    expect(cardEl).toHaveAttribute("src", "./cards/back.webp")
    expect(cardEl).toHaveAttribute("alt", "card")
  })

  it("renders a player card, while it's not the player's turn", async () => {
    const user = userEvent.setup()
    const playerTurnHandlerMock = vi.fn()
    const { getByRole } = render(() => (
      <Card
        card={cardMock}
        show={true}
        player={true}
        isPlayerTurn={false}
        playerTurnHandler={playerTurnHandlerMock}
      />
    ))
    const cardEl = getByRole("img")

    expect(cardEl).toHaveClass("card")
    expect(cardEl.id).toBe(cardMock.id)
    expect(cardEl).not.toHaveClass("card--player")
    expect(cardEl).toHaveAttribute("src", cardMock.img)
    expect(cardEl).toHaveAttribute("alt", cardMock.id)

    await user.click(cardEl)

    expect(playerTurnHandlerMock).not.toHaveBeenCalled()
  })

  it("renders a player card, while it's the player's turn", async () => {
    const user = userEvent.setup()
    const playerTurnHandlerMock = vi.fn()
    const { getByRole } = render(() => (
      <Card
        card={cardMock}
        show={true}
        player={true}
        isPlayerTurn={true}
        playerTurnHandler={playerTurnHandlerMock}
      />
    ))
    const cardEl = getByRole("img")

    expect(cardEl).toHaveClass("card")
    expect(cardEl).toHaveClass("card--player")
    expect(cardEl.id).toBe(cardMock.id)
    expect(cardEl).toHaveAttribute("src", cardMock.img)
    expect(cardEl).toHaveAttribute("alt", cardMock.id)

    await user.click(cardEl)

    expect(playerTurnHandlerMock).toHaveBeenCalledOnce()
  })
})
