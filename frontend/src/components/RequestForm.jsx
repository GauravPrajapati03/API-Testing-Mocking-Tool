import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

// import API from '../utils/api' — enable when backend is ready

export default function RequestForm() {
  const [form, setForm] = useState({
    url: "",
    method: "GET",
    headers: '{\n  "Authorization": "Bearer token"\n}',
    body: '{\n  "name": "John Doe"\n}',
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fakeAPI(form);
      setResponse(res);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
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
          {/* <option>PATCH</option>
          <option>DELETE</option> */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Headers (JSON)
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
          Body (JSON)
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
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Response</h3>
          <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap font-mono">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}

// Fake API simulation — replace with real API call
async function fakeAPI(data) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        status: 200,
        message: "This is a mock response from your API testing app!",
        request: data,
      });
    }, 1000)
  );
}
