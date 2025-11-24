import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'

export default function Leaderboard() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const {data, error} = await supabase
        .from('profiles')
        .select('display_name, handicap_index, rounds_count')
        .not('handicap_index', 'is', null)
        .order('handicap_index', {ascending: true})
        .order('rounds_count', {ascending: false})
        .limit(50)

      if (error) setErr(error.message)
      else setRows(data || [])
      setLoading(false)
    })()
  },[])

  return (
    <main className="home">
      <section className="home__card" style={{maxWidth: 720}}>
        <h2 style={{ margin:0}}>Leaderboard (Handicap)</h2>
        {err && <p className="form__error" style={{marginTop: 8}}>{err}</p>}
        {loading && !err && <p className="form__meta" style={{marginTop: 8}}>Loading…</p>}

        <ol style={{padding: 0, margin:12, listStyle: 'none'}}>
          {rows.map((r, i) => (
            <li key={i} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: 8
            }}>
              <div style={{width: 28, textAlign: 'right'}}>{i+1}.</div>
              <div>
                <strong>{r.display_name}</strong>
                <div className="form__meta">Rounds: {r.rounds_count ?? 0}</div>
              </div>
              <div style={{fontWeight: 700}}>
                {r.handicap_index?.toFixed?.(1) ?? '—'}
              </div>
            </li>
          ))}
        </ol>
        <div className="home__actions" style={{marginTop:8}}>
          <Link to="/dashboard" className="btn btn--ghost">Back to Dashboard</Link>
        </div>
      </section>
    </main>
  )
}
