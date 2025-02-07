export const getIndexPageHtml = () => {
  return `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>3d-viewer-svg.tscircuit.com</h1>
      <p>
        Turn your tscircuit code into 3d models automatically.
      </p>
      <p>
        To do this programmatically see the <a href="https://github.com/tscircuit/create-snippet-url">create-snippet-url</a> package.
      </p>
      <form action="/start_runframe" method="GET">
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
    </body>
  </html>
  `
}
