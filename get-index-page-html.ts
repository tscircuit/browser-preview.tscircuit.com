export const getIndexPageHtml = () => {
  return `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>code-runner-preview.tscircuit.com</h1>
      <p>
        Turn your tscircuit code into a preview automatically.
      </p>
      <p>
        To do this programmatically see the <a href="https://github.com/tscircuit/create-snippet-url">create-snippet-url</a> package.
        <button onclick="loadExample()" style="margin-left: 10px;">paste example</button>
      </p>
      <form action="/generate_url" method="GET">
        <textarea 
          name="code" 
          id="code" 
          placeholder="Enter your tscircuit code here"
          style="width: 100%; height: 200px;"
        ></textarea>
        <button type="submit">Start Runframe</button>
      </form>
      <style>
        body {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: sans-serif;
        }
        textarea {
          margin: 20px 0;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
        }
      </style>
      <script>
        function loadExample() {
          const exampleCode = \`export default () => (
  <board width="10mm" height="10mm">
    <resistor
      resistance="2k"
      footprint="0402"
      name="R1"
      schX={4}
      pcbX={3}
    />
    <capacitor
      capacitance="4000pF"
      footprint="0402"
      name="C1"
      schX={-3}
      pcbX={-3}
    />
    <trace from=".R1 > .pin1" to=".C1 > .pin1" />
  </board>
);
\`;

          document.getElementById('code').value = exampleCode;
        }
      </script>
    </body>
  </html>
  `
}
