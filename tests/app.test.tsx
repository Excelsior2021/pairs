import { describe, expect, it } from "vitest"
import { render, screen } from "@solidjs/testing-library"
import App from "../src/app"

describe("App component", async () => {
  render(() => <App />)
  const appName = await screen.findByText(/pairs/i)
  it("renders app name", () => {
    expect(appName).toBeInTheDocument()
  })
})
