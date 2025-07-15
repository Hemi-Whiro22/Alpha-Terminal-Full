import { API_BASE } from './config'

export const callApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
