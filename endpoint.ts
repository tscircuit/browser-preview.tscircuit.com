import { getUncompressedSnippetString } from "@tscircuit/create-snippet-url"
import { CircuitRunner } from "@tscircuit/eval/eval"
import { circuitJsonPreviewHtml } from "./circuit-json-preview-html"
import { getHtmlForGeneratedUrlPage } from "./get-html-for-generated-url-page"
import { getIndexPageHtml } from "./get-index-page-html"
import { getErrorSvg } from "./getErrorSvg"

type Result<T, E = Error> = [T, null] | [null, E]

async function unwrapPromise<T>(promise: Promise<T>): Promise<Result<T>> {
  return promise
    .then<[T, null]>((data) => [data, null])
    .catch<[null, Error]>((err) => [null, err])
}

function unwrapSyncError<T>(fn: () => T): Result<T> {
  try {
    return [fn(), null]
  } catch (err) {
    return [null, err as Error]
  }
}


export default async (req: Request) => {
  const url = new URL(req.url.replace("/api", "/"))
  const host = `${url.protocol}//${url.host}`

  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ ok: true }))
  }

  if (url.pathname === "/generate_url") {
    const code = url.searchParams.get("code")
    return new Response(await getHtmlForGeneratedUrlPage(code!, host), {
      headers: { "Content-Type": "text/html" },
    })
  }

  if (url.pathname === "/" && !url.searchParams.get("code")) {
    return new Response(getIndexPageHtml(), {
      headers: { "Content-Type": "text/html" },
    })
  }

  const rawCode = url.searchParams.get("code")
  if (!rawCode) {
    return new Response(
      JSON.stringify({ ok: false, error: "No code parameter provided" }),
      { status: 400 },
    )
  }

  const gzipPrefix = "data:application/gzip;base64,"

  const normalizedCode = rawCode.startsWith(gzipPrefix)
    ? rawCode
    : gzipPrefix + rawCode

  const [userCode, userCodeErr] = unwrapSyncError(() =>
    getUncompressedSnippetString(normalizedCode),
  )
  if (userCodeErr) {
    return errorResponse(userCodeErr)
  }

  const worker = new CircuitRunner()

  const [, executeError] = await unwrapPromise(
    worker.executeWithFsMap({
      fsMap: {
        "entrypoint.tsx": `
          import * as UserComponents from "./UserCode.tsx";
          
          const hasBoard = ${userCode.includes("<board").toString()};
          const ComponentToRender = Object.entries(UserComponents)
            .filter(([name]) => !name.startsWith("use"))
            .map(([_, component]) => component)[0] || (() => null);

          circuit.add(
            hasBoard ? (
              <ComponentToRender />
            ) : (
              <board width="10mm" height="10mm">
                <ComponentToRender name="U1" />
              </board>
            )
          );
        `,
        "UserCode.tsx": userCode,
      },
      entrypoint: "entrypoint.tsx",
    }),
  )

  if (executeError) return errorResponse(executeError)

  const [, renderError] = await unwrapPromise(worker.renderUntilSettled())
  if (renderError) return errorResponse(renderError)

  const [circuitJson, jsonError] = await unwrapPromise(worker.getCircuitJson())
  if (jsonError) return errorResponse(jsonError)

  if (circuitJson) {
    const html = await circuitJsonPreviewHtml(circuitJson as any)
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    })
  }
}

function errorResponse(err: Error) {
  return new Response(getErrorSvg(err.message), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
