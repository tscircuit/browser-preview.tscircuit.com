export type PreviewTabId =
  | "pcb"
  | "schematic"
  | "assembly"
  | "cad"
  | "bom"
  | "circuit_json"
  | "errors"
  | "render_log"

export const resolveDefaultActiveTab = (view?: string | null): PreviewTabId => {
  switch (view?.trim().toLowerCase()) {
    case "pcb":
      return "pcb"
    case "schematic":
    case "sch":
      return "schematic"
    case "3d":
    case "cad":
      return "cad"
    case "assembly":
      return "assembly"
    case "bom":
      return "bom"
    case "circuit_json":
    case "json":
      return "circuit_json"
    case "errors":
      return "errors"
    case "render_log":
      return "render_log"
    default:
      return "cad"
  }
}

export const circuitJsonPreviewHtml = (
  code: unknown,
  options: { view?: string | null } = {},
) => {
  const defaultActiveTab = resolveDefaultActiveTab(options.view)
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <div id="root"></div>
        <script>
        // Add process polyfill
          window.process = {
            env: {
              NODE_ENV: 'production'
            }
          };
          window.CIRCUIT_JSON = ${JSON.stringify(code)};
          window.CIRCUIT_JSON_PREVIEW_PROPS = ${JSON.stringify({ defaultActiveTab })};
        </script>
        <script src="/standalone-preview.min.js"></script>
      </body>
    </html>
  `
}
