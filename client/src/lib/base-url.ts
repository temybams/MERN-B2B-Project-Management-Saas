// Keep OAuth on the frontend host in production so it also uses the Vercel
// proxy and receives a first-party session cookie.
export const baseURL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "/api";
