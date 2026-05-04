export const backendUrl =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') ??
  'http://localhost:3333'

export function getFrontendUrl() {
  return (
    import.meta.env.VITE_FRONTEND_URL?.replace(/\/$/, '') ??
    window.location.origin
  )
}
