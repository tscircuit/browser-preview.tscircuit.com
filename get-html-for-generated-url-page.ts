export const getHtmlForGeneratedUrlPage = async (code: string) => {
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
          window.CIRCUIT_JSON_PREVIEW_PROPS = { defaultActiveTab: "cad" };
        </script>
        <script src="/standalone-preview.min.js"></script>
      </body>
    </html>
  `
}