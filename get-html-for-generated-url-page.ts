import {
  createSnippetUrl,
  getCompressedBase64SnippetString,
} from "@tscircuit/create-snippet-url"

export const getHtmlForGeneratedUrlPage = async (
  code: string,
  urlPrefix = "https://code-runner-preview.tscircuit.com",
  view?: string | null,
) => {
  const snippetUrl = createSnippetUrl(code)
  const compressedCode = getCompressedBase64SnippetString(code)
  const encodedCode = encodeURIComponent(compressedCode)
  const normalizedView = view?.trim().toLowerCase()
  const viewQuery =
    normalizedView && /^[a-z0-9_]+$/.test(normalizedView)
      ? `view=${encodeURIComponent(normalizedView)}&`
      : ""
  const circuitJsonPreviewUrl = `${urlPrefix}/start_runframe/?${viewQuery}code=${encodedCode}`
  const pcbPreviewUrl = `${urlPrefix}/?view=pcb&code=${encodedCode}`
  const schematicPreviewUrl = `${urlPrefix}/?view=schematic&code=${encodedCode}`
  const threeDPreviewUrl = `${urlPrefix}/?view=3d&code=${encodedCode}`

  return `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>code-runner-preview.tscircuit.com</h1>
      <table>
        <tr>
          <th>Type</th>
          <th>URL</th>
        </tr>
        <tr>
          <td>Snippet URL</td>
          <td><a href="${snippetUrl}">${snippetUrl}</a></td>
        </tr>
        <tr>
          <td>Circuit JSON Preview</td>
          <td><a href="${circuitJsonPreviewUrl}">${circuitJsonPreviewUrl}</a></td>
        </tr>
        <tr>
          <td>PCB Preview</td>
          <td><a href="${pcbPreviewUrl}">${pcbPreviewUrl}</a></td>
        </tr>
        <tr>
          <td>Schematic Preview</td>
          <td><a href="${schematicPreviewUrl}">${schematicPreviewUrl}</a></td>
        </tr>
        <tr>
          <td>3D Preview</td>
          <td><a href="${threeDPreviewUrl}">${threeDPreviewUrl}</a></td>
        </tr>
      </table>
    </body>
  </html>
  `
}
