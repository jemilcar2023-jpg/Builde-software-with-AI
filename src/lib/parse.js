// Connects the app to our Back4App (Parse) backend.
// Keys come from .env locally and from Netlify environment variables in production.
import Parse from 'parse'

const appId = import.meta.env.VITE_PARSE_APP_ID
const jsKey = import.meta.env.VITE_PARSE_JS_KEY
const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com'

export const isConfigured = Boolean(appId && jsKey)

if (isConfigured) {
  Parse.initialize(appId, jsKey)
  Parse.serverURL = serverURL
} else {
  console.error('Missing Back4App keys. Copy .env.example to .env and fill them in.')
}

export default Parse
