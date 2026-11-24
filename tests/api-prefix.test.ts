import { expect, test } from "bun:test"
import { getTestServer } from "./fixtures/get-test-server"

test("GET /api/health removes the api prefix without a double slash", async () => {
  const { serverUrl } = await getTestServer()

  const response = await fetch(`${serverUrl}/api/health`)
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data).toEqual({ ok: true })
})
