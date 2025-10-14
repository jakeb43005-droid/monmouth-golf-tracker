import {useState, useRef} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'

export default function SignUp() {
  const go = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const errorRef = useRef(null)

  async function onSubmit(e) {
    e.preventDefault()
    const emailClean = email.trim().toLowerCase()
    const passClean = password
    setErrorMsg('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: emailClean,
        password: passClean,
      })

      if (error) {
        setErrorMsg(error.message || 'Sign up failed')
        return
      }
      go('/dashboard')
    } catch {
      setErrorMsg('Network issue — try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = email.trim() && password

  return (
    <form
      onSubmit={onSubmit}
      style={{ padding: 20, display: 'grid', gap: 12, maxWidth: 360, margin: '0 auto' }}
      noValidate
    >
      <h2>Sign Up</h2>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        disabled={loading}
        aria-invalid={!!errorMsg}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="new-password"
        type="password"
        placeholder="******"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
        disabled={loading}
      />
      {errorMsg && (
        <p
          ref={errorRef}
          tabIndex={-1}
          style={{ color: 'red', marginTop: 4 }}
          aria-live="assertive">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        style={{ cursor: loading || !canSubmit ? 'not-allowed' : 'pointer'}}>
        {loading ? 'Creating…' : 'Create account'}
      </button>

      <p style={{ fontSize: 14, marginTop: 8 }}>
        Have an account? <Link to="/signin">Sign in</Link>
      </p>
    </form>
  )
}