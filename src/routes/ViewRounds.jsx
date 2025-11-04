import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {supabase} from '../lib/supabase'

export default function Rounds() {
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const[loading, setLoading] = useState(true)

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
      <section className="home__card" style={{ maxWidth: 720 }}>
        <h2 style={{ margin: 0 }}>My Rounds</h2>
        {err && <p className="form__error" style={{ marginTop: 8 }}>{err}</p>}
        {loading && !err && <p className="form__meta" style={{ marginTop: 8 }}>Loading…</p>}
        {!loading && !rows.length && !err && (
          <p className="form__meta" style={{ marginTop: 8 }}>
            No rounds yet. <Link to="/record">Record your first round</Link>.
          </p>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: 12 }}>
          {rows.map((r) => {
            const courseName = r.courses?.name ?? 'Course'
            const par = r.courses?.par ?? null
            const toPar = par != null ? r.strokes - par : null
            const dateStr = new Date(r.played_on).toLocaleDateString()
            return (
              <li
                key={r.id}
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  marginBottom:8,
                  display: 'grid',
                  gap: 4,
                }} >
                <div style={{display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center'}}>
                  <strong>{courseName}</strong>
                  <span className="form__meta">{dateStr}</span>
                </div>
                <div className="form__meta">
                  Par <strong>{par ?? '—'}</strong> · Strokes <strong>{r.strokes}</strong>
                  {toPar !== null && (<>
                      {' '}· To-Par <strong>{toPar > 0 ? `+${toPar}` : toPar}</strong></>
                  )} </div> </li>
            )})}</ul>
        <div className="home__actions" style={{marginTop: 8}}>
          <Link to="/record" className="btn btn--primary">Record Another</Link>
          <Link to="/dashboard" className="btn btn--ghost">Back to Dashboard</Link>
        </div>
      </section>
    </main>
  )
}
