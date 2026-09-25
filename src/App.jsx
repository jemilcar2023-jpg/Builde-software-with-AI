import { useState } from 'react'
import { isConfigured } from './lib/parse'
import { getCurrentUser, logout } from './services/auth'
import AuthForm from './components/AuthForm'
import Header from './components/Header'
import RecipesPage from './components/RecipesPage'

export default function App() {
  if (!isConfigured) return <SetupMessage />
  return <RecipeApp />
}

// Shown instead of a blank page when the Back4App keys are missing from the build.
function SetupMessage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="brand">🍲 Recipe Box</h1>
        <p className="error">
          The app isn't connected to its database. Set VITE_PARSE_APP_ID and VITE_PARSE_JS_KEY
          (in .env locally, or in Netlify's environment variables) and rebuild.
        </p>
      </div>
    </div>
  )
}

function RecipeApp() {
  // Parse keeps the session in localStorage, so a returning user stays logged in.
  const [user, setUser] = useState(getCurrentUser())

  async function handleLogout() {
    try {
      await logout()
    } finally {
      setUser(null)
    }
  }

  if (!user) {
    return <AuthForm onAuthenticated={setUser} />
  }

  return (
    <>
      <Header username={user.get('username')} onLogout={handleLogout} />
      <main className="container">
        <RecipesPage onSessionExpired={handleLogout} />
      </main>
    </>
  )
}
