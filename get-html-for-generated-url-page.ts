import { createSnippetUrl, getCompressedBase64SnippetString } from "@tscircuit/create-snippet-url"

export const getHtmlForGeneratedUrlPage = async (code: string, urlPrefix = "https://code-runner-preview.tscircuit.com") => {
  const snippetUrl = createSnippetUrl(code)
  const compressedCode = getCompressedBase64SnippetString(code)
  const circuitJsonPreviewUrl = `${urlPrefix}/start_runframe/?code=${encodeURIComponent(compressedCode)}`

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
      </table>
    </body>
  </html>
  `
}