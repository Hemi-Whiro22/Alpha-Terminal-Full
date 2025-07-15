// Call your Codex backend URL
export const callApi = async (url, opts = {}) => {
  const headers = opts.isForm ? {} : { "Content-Type": "application/json" }
  const res = await fetch(`http://localhost:8000${url}`, {
    method: opts.method || "GET",
    headers,
    body: opts.isForm ? opts.body : JSON.stringify(opts.body),
  })
  return res.json()
}
