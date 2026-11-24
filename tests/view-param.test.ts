import { expect, test } from "bun:test"
import { getCompressedBase64SnippetString } from "@tscircuit/create-snippet-url"
import {
  circuitJsonPreviewHtml,
  resolveDefaultActiveTab,
} from "../circuit-json-preview-html"
import { getTestServer } from "./fixtures/get-test-server"

test("resolveDefaultActiveTab maps view query values to RunFrame TabId", () => {
  expect(resolveDefaultActiveTab("pcb")).toBe("pcb")
  expect(resolveDefaultActiveTab("PCB")).toBe("pcb")
  expect(resolveDefaultActiveTab("schematic")).toBe("schematic")
  expect(resolveDefaultActiveTab("sch")).toBe("schematic")
  expect(resolveDefaultActiveTab("3d")).toBe("cad")
  expect(resolveDefaultActiveTab("cad")).toBe("cad")
  expect(resolveDefaultActiveTab("assembly")).toBe("assembly")
  expect(resolveDefaultActiveTab("bom")).toBe("bom")
  expect(resolveDefaultActiveTab("circuit_json")).toBe("circuit_json")
  expect(resolveDefaultActiveTab("json")).toBe("circuit_json")
  expect(resolveDefaultActiveTab(undefined)).toBe("cad")
  expect(resolveDefaultActiveTab("unknown")).toBe("cad")
})

test("circuitJsonPreviewHtml injects defaultActiveTab into CIRCUIT_JSON_PREVIEW_PROPS", () => {
  const html = circuitJsonPreviewHtml([{ type: "pcb_board" }], {
    view: "schematic",
  })
  expect(html).toContain(
    'window.CIRCUIT_JSON_PREVIEW_PROPS = {"defaultActiveTab":"schematic"};',
  )
})

test("GET /?code=...&view=... selects pcb, schematic, and 3d tabs", async () => {
  const { serverUrl } = await getTestServer()
  const compressed = encodeURIComponent(
    getCompressedBase64SnippetString(`
      export default () => (
        <board width="10mm" height="10mm">
          <resistor name="R1" resistance="1k" footprint="0402" />
        </board>
      )
    `),
  )

  for (const [viewQuery, expectedTab] of [
    ["view=pcb", "pcb"],
    ["view=schematic", "schematic"],
    ["view=3d", "cad"],
    ["view=cad", "cad"],
    ["", "cad"],
  ] as const) {
    const query = viewQuery
      ? `?${viewQuery}&code=${compressed}`
      : `?code=${compressed}`
    const res = await fetch(`${serverUrl}/${query}`)
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain(
      `window.CIRCUIT_JSON_PREVIEW_PROPS = {"defaultActiveTab":"${expectedTab}"};`,
    )
    expect(html).toContain("window.CIRCUIT_JSON = [")
  }

  const genRes = await fetch(
    `${serverUrl}/generate_url?code=${encodeURIComponent("export default () => <board />")}`,
  )
  expect(genRes.status).toBe(200)
  const genHtml = await genRes.text()
  expect(genHtml).toContain("?view=pcb&code=")
  expect(genHtml).toContain("?view=schematic&code=")
  expect(genHtml).toContain("?view=3d&code=")
}, 20000)
