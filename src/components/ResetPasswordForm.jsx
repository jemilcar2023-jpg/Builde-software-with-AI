import { useState } from 'react'
import { requestPasswordReset } from '../services/auth'

// Asks for the account email and has Back4App send a password reset link.
export default function ResetPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="form">
        <p className="success">
          If an account uses <strong>{email.trim()}</strong>, we've sent it a link to reset the
          password. Check your inbox (and spam folder).
        </p>
        <button type="button" className="btn primary" onClick={onBack}>
          Back to log in
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="form-title">Reset your password</h2>
      <p className="muted small">
        Enter the email you signed up with and we'll send you a reset link.
      </p>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
      <button type="button" className="link-btn" onClick={onBack}>
        ← Back to log in
      </button>
    </form>
  )
}
