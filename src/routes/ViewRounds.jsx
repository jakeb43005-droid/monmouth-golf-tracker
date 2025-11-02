import {useEffect, useState} from 'react'
import {Routes, useNavigate} from 'react-router-dom'
import {supabase} from '../lib/supabase'

export default function Rounds() {
  const nav = useNavigate()
  const [past, setPast] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    (async() => {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) {nav('/signin'); return}

      const {data, error} = await supabase
        .from('scores')
        .select('id, played_on, strokes, courses (name, par)')
        .order('played_on',{ascending:false})
        .limit(10)
       if(error) {setErr(error.message); return}

      setPast((data || []).map(uid => ({
        id: uid.id,
        date: uid.played_on,
        course: uid.courses?.name ?? '—',
        par: uid.courses?.par ?? '—',
        strokes: uid.strokes
      })))})()
    },[nav])

  return (
    <main className="home">
      <section className="home__card" style={{maxWidth: 420}}>
        <h2 style={{margin: 0}}>View Rounds TEST</h2>
        {err && <p className="form__error">{err}</p>}
        {!past.length && !err && (
          <p className="form__meta" style={{marginTop: 8}}>No rounds yet.</p>
        )}
        <ul style={{listStyle:'none', padding: 0, margin: 12}}>
          {past.map(row => (
            <li key={Routes.id} style={{
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: 8
            }}>
              <strong>{row.course}</strong> — {row.strokes} on {new Date(row.date).toLocaleDateString()}
              {'·'}Par {row.par}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
