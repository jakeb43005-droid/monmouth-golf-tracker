import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignIn() {
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
      const { error } = await supabase.auth.signInWithPassword({
        email: emailClean,
        password: passClean,
      })

      if (error) {
        setErrorMsg(error.message || 'Sign in failed')
        requestAnimationFrame(() => errorRef.current?.focus())
        return
      }

      go('/dashboard')
    } catch {
      setErrorMsg('Network issue — try again in a moment.')
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ padding: 20, display: 'grid', gap: 12, maxWidth: 360, margin: '0 auto' }}
      noValidate
    >
      <h2>Sign In</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {errorMsg && (
        <p
          ref={errorRef}
          tabIndex={-1}
          style={{ color: 'red', marginTop: 4 }}
          aria-live="assertive"
        >
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p style={{ fontSize: 14, marginTop: 8 }}>
        Don’t have an account? <Link to="/signup">Create one</Link>
      </p>
    </form>
  )
}
