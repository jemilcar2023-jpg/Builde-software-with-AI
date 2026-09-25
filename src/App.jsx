import { useState } from 'react'
import { getCurrentUser, logout } from './services/auth'
import AuthForm from './components/AuthForm'
import Header from './components/Header'
import RecipesPage from './components/RecipesPage'

export default function App() {
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
