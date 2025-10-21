import {useState, useRef} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'
import logo2 from '../assets/logo2.png'
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
      const {error} = await supabase.auth.signInWithPassword({
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
      setErrorMsg('Network issue... try again in a moment.')
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally {
      setLoading(false)
    }
  }
  
  const canSubmit =email.trim() && password 
  return (
   <main className="home">
      <section className="home__card logo__card">
         <img className="logo2__small" src={logo2} alt="Monmouth County Parks"/>
        <h2 style={{margin:0}}>Sign In</h2>
        <form onSubmit={onSubmit} className="form" noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="current-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}/>
          </div>
          {errorMsg && <p className="form__error">{errorMsg}</p>}
          <div className="form__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading || !canSubmit}>
              {loading ?'Signing in…' : 'Sign In'}
            </button>
            <p className="form__meta">
              Don’t have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
    )
}
