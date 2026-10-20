import { expect, test } from "bun:test"
import { getCompressedBase64SnippetString } from "@tscircuit/create-snippet-url"
import {
  circuitJsonPreviewHtml,
  resolveViewToActiveTab,
} from "../circuit-json-preview-html"
import { getTestServer } from "./fixtures/get-test-server"

test("resolveViewToActiveTab maps view query values to preview tabs", () => {
  expect(resolveViewToActiveTab("pcb")).toBe("pcb")
  expect(resolveViewToActiveTab("PCB")).toBe("pcb")
  expect(resolveViewToActiveTab("schematic")).toBe("schematic")
  expect(resolveViewToActiveTab("sch")).toBe("schematic")
  expect(resolveViewToActiveTab("3d")).toBe("cad")
  expect(resolveViewToActiveTab("cad")).toBe("cad")
  expect(resolveViewToActiveTab(undefined)).toBe("cad")
  expect(resolveViewToActiveTab(null)).toBe("cad")
  expect(resolveViewToActiveTab("unknown")).toBe("cad")
})

test("circuitJsonPreviewHtml sets defaultActiveTab based on view or defaultActiveTab option", () => {
  expect(circuitJsonPreviewHtml("[]", { view: "pcb" })).toContain(
    'window.CIRCUIT_JSON_PREVIEW_PROPS = { defaultActiveTab: "pcb" };',
  )
  expect(circuitJsonPreviewHtml("[]", { view: "schematic" })).toContain(
    'window.CIRCUIT_JSON_PREVIEW_PROPS = { defaultActiveTab: "schematic" };',
  )
  expect(circuitJsonPreviewHtml("[]", { view: "3d" })).toContain(
    'window.CIRCUIT_JSON_PREVIEW_PROPS = { defaultActiveTab: "cad" };',
  )
  expect(circuitJsonPreviewHtml("[]")).toContain(
    'window.CIRCUIT_JSON_PREVIEW_PROPS = { defaultActiveTab: "cad" };',
  )
})

test(
  "GET /?code=...&view=... renders preview with requested defaultActiveTab",
  async () => {
    const { serverUrl } = await getTestServer()
    const compressedCode = getCompressedBase64SnippetString(
      `export default () => <board width="10mm" height="10mm"><resistor name="R1" resistance="1k" footprint="0402" /></board>`,
    )

    const [pcbRes, schRes, cadRes] = await Promise.all([
      fetch(
        `${serverUrl}/?code=${encodeURIComponent(compressedCode)}&view=pcb`,
      ),
      fetch(
        `${serverUrl}/?code=${encodeURIComponent(compressedCode)}&view=schematic`,
      ),
      fetch(`${serverUrl}/?code=${encodeURIComponent(compressedCode)}&view=3d`),
    ])

    expect(pcbRes.status).toBe(200)
    expect(await pcbRes.text()).toContain('defaultActiveTab: "pcb"')

    expect(schRes.status).toBe(200)
    expect(await schRes.text()).toContain('defaultActiveTab: "schematic"')

    expect(cadRes.status).toBe(200)
    expect(await cadRes.text()).toContain('defaultActiveTab: "cad"')
  },
  { timeout: 30000 },
)
