// API Configuration Helper for MCP CONSULTANTS
// If VITE_API_URL is set in environment (e.g. production decoupled hosting), uses that.
// Otherwise falls back to relative paths (''), which Vite proxies to http://localhost:3000 in dev.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function apiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
}
