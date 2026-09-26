import { useState } from "react";
import { testExternalApi } from "../api/performanceApi";
import type {
  ExternalApiTestResponse,
} from "../types/performance";

export default function ApiTester() {
  const [method, setMethod] = useState("GET");

  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  const [headers, setHeaders] = useState("");

  const [body, setBody] = useState("");

  const [result, setResult] =
    useState<ExternalApiTestResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      let parsedHeaders: Record<string, string> = {};

      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }

      const response = await testExternalApi({
        method,
        url,
        headers: parsedHeaders,
        body: body || undefined,
      });

      setResult(response);
    } catch (err) {
      console.error(err);

      setError(
        "Request failed. Check the URL, headers, or request body."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="api-tester">
      <h2>External API Tester</h2>

      <div className="api-request-row">
        <select
          value={method}
          onChange={(event) =>
            setMethod(event.target.value)
          }
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(event) =>
            setUrl(event.target.value)
          }
          placeholder="Enter API URL"
        />

        <button
          onClick={handleSend}
          disabled={loading || !url.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <label>Headers (JSON)</label>

      <textarea
        value={headers}
        onChange={(event) =>
          setHeaders(event.target.value)
        }
        placeholder='{"Accept": "application/json"}'
        rows={4}
      />

      <label>Request Body</label>

      <textarea
        value={body}
        onChange={(event) =>
          setBody(event.target.value)
        }
        placeholder='{"name": "TraceLite"}'
        rows={6}
      />

      {error && (
        <div className="api-error">
          {error}
        </div>
      )}

      {result && (
        <div className="api-response">
          <div className="response-header">
            <h3>Response</h3>

            <span>
              Status: {result.statusCode}
            </span>

            <span>
              Duration: {result.durationMs} ms
            </span>
          </div>

          <p>{result.reasonPhrase}</p>

          <pre>{result.responseBody}</pre>
        </div>
      )}
    </div>
  );
}