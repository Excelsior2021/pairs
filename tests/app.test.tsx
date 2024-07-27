import { describe, expect, it } from "vitest"
import { render } from "@solidjs/testing-library"
import App from "../src/app"

describe("App component", () => {
  const { getByRole, getByTestId } = render(() => <App />)

  const appComponent = getByTestId("app")

  const appName = getByRole("heading", { name: /pairs/i })

  it("renders", () => {
    expect(appComponent).toBeInTheDocument()
  })

  it("renders app name", () => {
    expect(appName).toBeInTheDocument()
  })
})
