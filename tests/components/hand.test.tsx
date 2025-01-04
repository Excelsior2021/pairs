import { describe, expect, it, vi } from "vitest"
import { render } from "@solidjs/testing-library"
import Hand from "@components/hand/hand"
import user from "@testing-library/user-event"

describe("Hand component", () => {
  const hand = [
    { id: 1, img: "img" },
    { id: 2, img: "img" },
    { id: 3, img: "img" },
  ] as any

  let HandComponent: Element

  describe("player hand without handler", () => {
    HandComponent = (
      <Hand hand={hand} heading="Your Hand" player={true} />
    ) as Element

    const { getByRole, getAllByRole } = render(() => (
      <Hand hand={hand} heading="Your Hand" player={true} />
    ))

    const cardEls = getAllByRole("img")

    const heading = getByRole("heading", { level: 3 })

    it("renders correct heading", () => {
      expect(heading).toHaveTextContent(/your hand/i)
    })

    it("renders cards in hand", () => {
      for (const i in cardEls) {
        const id = Number(i) + 1
        expect(Number(cardEls[i].id)).toBe(id)
        expect(cardEls).toHaveLength(3)
        expect(cardEls[i].src).toBe(
          `${import.meta.env.VITE_CLIENT_DOMAIN}/${hand[i].img}`
        )
        expect(cardEls[i].className).toBe("card")
      }
    })
  })

  describe("player hand with handler", () => {
    const playerTurnHandlerMock = vi.fn()

    HandComponent = (
      <Hand
        hand={hand}
        heading="Your Hand"
        player={true}
        playerTurnHandler={playerTurnHandlerMock}
      />
    ) as Element

    const { getAllByRole } = render(() => HandComponent)

    const cardEls = getAllByRole("img")

    it("triggers event handler and has correct class names", async () => {
      for (const i in cardEls) {
        await user.click(cardEls[i])
        expect(cardEls[i].className).toBe("card card--player")
        expect(playerTurnHandlerMock).toBeCalledTimes(Number(i) + 1)
      }
    })
  })

  describe("opponent hand", () => {
    HandComponent = (<Hand hand={hand} heading="Opponent Hand" />) as Element

    const { getByRole, getAllByRole } = render(() => HandComponent)

    const cardEls = getAllByRole("img")

    const heading = getByRole("heading", { level: 3 })

    it("renders correct heading", () => {
      expect(heading).toHaveTextContent(/opponent hand/i)
    })

    it("renders cards in hand", () => {
      for (const i in cardEls) {
        expect(cardEls).toHaveLength(3)
        expect(cardEls[i].src).toBe(
          `${import.meta.env.VITE_CLIENT_DOMAIN}/cards/back.webp`
        )
        expect(cardEls[i].className).toBe("card")
      }
    })
  })
})
