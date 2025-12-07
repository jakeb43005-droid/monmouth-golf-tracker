import {useEffect, useState, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {supabase} from '../lib/supabase'

function makeDefaultName(email) {
  const base = (email?.split('@')[0] || 'golfer')
    .replace(/[^a-z0-9_]/gi, '')
    .slice(0, 20)
  return base || 'golfer'
}

function validate(name){
  if (!name) return 'Display name is required.'
  if (name.length < 3) return 'Must be at least 3 characters.'
  if (name.length > 20) return 'Must be 20 characters or fewer.'
  if (!/^[a-z0-9_]+$/i.test(name)) return 'Use letters, numbers, or underscore only.'
  return ''
}

export default function Profile() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const errorRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      const{data: {user}} = await supabase.auth.getUser()
      if (!user) {nav('/signin'); return}

      setEmail(user.email ?? '')
      const {data: profile, error} = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        setErr(error.message)
        setLoading(false)
        return
      }

      if (!profile) {
        const fallback = makeDefaultName(user.email)
        const {error: insErr} = await supabase.from('profiles').insert({
          user_id: user.id,
          display_name: fallback
        })
        if (insErr) {
          setErr(insErr.message)
          setLoading(false)
          return
        }
        setDisplayName(fallback)
      } else {
        setDisplayName(profile.display_name || makeDefaultName(user.email))
      }

      setLoading(false)
    })()
  }, [nav])

  async function onSubmit(e) {
  e.preventDefault()
  setErr('')

  const name = displayName.trim()
  if (!name || name.length < 3 || name.length > 20 || !/^[a-z0-9_]+$/i.test(name)) {
    setErr('3–20 chars, letters/numbers/_ only.')
    return
  }

  setSaving(true)
  try {
    const {data: {user}} = await supabase.auth.getUser()
    if (!user) {nav('/signin'); return}

    const {error} = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          display_name: name,
          updated_at: new Date().toISOString(),
        },
        {onConflict: 'user_id'})

    if (error) {
      if (error.code === '23505') setErr('That name is taken. Try another.')
      else setErr(error.message)
      return
    }

    const {data: prof} = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .maybeSingle()

    if (prof?.display_name) setDisplayName(prof.display_name)

    nav('/dashboard') 
  } finally {
    setSaving(false)
  }
}

  if (loading) return <div style={{padding: 24}}>Loading…</div>
return(
    <main className="home">
      <section className="home__card" style={{maxWidth: 520}}>
        <h2 style={{margin: 0}}>Edit Profile</h2>
        <p className="form__meta"style={{marginTop: 6}}>Signed in as <strong>{email}</strong></p>
        {err &&(
          <p ref={errorRef} tabIndex={-1} className="form__error" style={{marginTop: 8}} aria-live="assertive">
            {err}
          </p>
        )}
        <form onSubmit={onSubmit} className="form" style={{marginTop: 12}}>
          <div className="field">
            <label htmlFor="display_name">Display name</label>
            <input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="your_name"
              disabled={saving}
              required
              aria-invalid={!!validate(displayName)}
            />
            <p className="form__meta">3–20 chars, letters/numbers/_ only. Public on leaderboards.</p>
          </div>
          <div className="form__actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving?'Saving…':'Save'}
            </button>
            <Link to="/dashboard" className="btn btn--ghost">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  )
}