import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import API from "../utils/api";

export default function RequestForm() {
  const [form, setForm] = useState({
    url: "",
    method: "GET",
    headers: '{\n  "Authorization": "Bearer token"\n}',
    body: "{}",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const parseJson = (text) => {
    try {
      return JSON.parse(text || "{}");
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const parsedHeaders = parseJson(form.headers);
    const parsedBody = parseJson(form.body);

    if (!parsedHeaders) {
      setError("Invalid JSON in Headers");
      setLoading(false);
      return;
    }

    if (!parsedBody) {
      setError("Invalid JSON in Body");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/requests/execute", {
        url: form.url,
        method: form.method,
        headers: parsedHeaders,
        body: parsedBody,
      });

      setResponse({
        status: res.data.status ?? res.status,
        statusText: res.data.statusText ?? res.statusText,
        headers: res.data.headers ?? {},
        data: res.data.data ?? res.data,
      });
    } catch (err) {
      if (err.response) {
        setResponse({
          status: err.response.data?.status ?? err.response.status,
          statusText: err.response.data?.statusText ?? err.response.statusText,
          headers: err.response.data?.headers ?? err.response.headers,
          data: err.response.data?.data ?? err.response.data,
        });
      } else {
        // unexpected error
        setResponse({
          error: err.message || "Unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const previewData = {
    url: form.url,
    method: form.method,
    headers: parseJson(form.headers) || "❌ Invalid JSON",
    body: parseJson(form.body) || "❌ Invalid JSON",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Request URL
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 shadow-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
          placeholder="https://api.example.com/users"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          HTTP Method
        </label>
        <select
          className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm bg-white"
          value={form.method}
          onChange={(e) => setForm({ ...form, method: e.target.value })}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Headers (JSON only)
        </label>
        <CodeMirror
          value={form.headers}
          height="100px"
          extensions={[json()]}
          theme="light"
          onChange={(value) => setForm({ ...form, headers: value })}
          className="rounded-md border border-gray-300 shadow-xl text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Body (JSON only)
        </label>
        <CodeMirror
          value={form.body}
          height="120px"
          extensions={[json()]}
          theme="light"
          onChange={(value) => setForm({ ...form, body: value })}
          className="rounded-md border border-gray-300 shadow-xl text-sm"
        />
      </div>

      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

      <div className="flex justify-evenly items-center space-x-16 mb-0">
        <div>
          <button
            type="button"
            onClick={() =>
              setForm({
                url: "",
                method: "GET",
                headers: '{\n  "Authorization": "Bearer token"\n}',
                body: "{}",
              })
            }
            className="w-full sm:w-auto px-6 py-2 rounded-md border border-gray-400 cursor-pointer shadow-md"
          >
            Reset
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full sm:w-auto text-sm px-6 py-3 rounded-md font-semibold border border-gray-300 bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-md"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showPreview ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-inner">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            Preview Request
          </h3>
          <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap font-mono">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className={`w-full py-3 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </div>

      {response && (
        <div className="mt-6 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-100 to-purple-100">
            <h3 className="text-md font-bold text-gray-800">API Response</h3>
          </div>

          {/* Status */}
          {response.status && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-700">Status</h4>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    response.status >= 200 && response.status < 300
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {response.status} {response.statusText || ""}
                </span>
              </div>
            </div>
          )}

          {/* Headers */}
          {response.headers && (
            <div className="px-4 py-3 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Headers
              </h4>
              <div className="bg-gray-50 p-3 rounded border text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-60 overflow-auto">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-4 border-b border-dashed border-gray-200 py-1"
                  >
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-right break-all text-gray-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data */}
          {response.data && (
            <div className="px-4 py-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Data</h4>
              <div className="bg-gray-50 p-3 rounded border text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-[500px] overflow-auto">
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Error */}
          {response.error && (
            <div className="px-4 py-3">
              <h4 className="text-sm font-semibold text-red-600 mb-1">Error</h4>
              <div className="bg-red-50 p-3 rounded border border-red-200 text-sm text-red-800">
                {response.error}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

// Fake API simulation — replace with real API call
// async function fakeAPI(data) {
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       resolve({
//         status: 200,
//         message: "This is a mock response from your API testing app!",
//         request: data,
//       });
//     }, 1000)
//   );
// }

// Sample apis
// https://dummyjson.com/users/1
