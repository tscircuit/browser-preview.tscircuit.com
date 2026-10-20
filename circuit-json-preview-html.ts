export type PreviewTab = "pcb" | "schematic" | "cad"

export const resolveViewToActiveTab = (view?: string | null): PreviewTab => {
  const normalizedView = view?.trim().toLowerCase()
  if (normalizedView === "pcb") return "pcb"
  if (normalizedView === "schematic" || normalizedView === "sch") {
    return "schematic"
  }
  if (normalizedView === "3d" || normalizedView === "cad") return "cad"
  return "cad"
}

export const circuitJsonPreviewHtml = (
  code: string,
  options?: {
    defaultActiveTab?: PreviewTab
    view?: string | null
  },
) => {
  const defaultActiveTab =
    options?.defaultActiveTab ?? resolveViewToActiveTab(options?.view)
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
          window.CIRCUIT_JSON_PREVIEW_PROPS = { defaultActiveTab: ${JSON.stringify(defaultActiveTab)} };
        </script>
        <script src="/standalone-preview.min.js"></script>
      </body>
    </html>
  `
}
