import {useEffect, useState} from 'react'
import {supabase} from '../lib/supabase'
import {Link} from 'react-router-dom'

export default function StrokesLeaderboard() {
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [period, setPeriod] = useState('day') 
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      const {data, error} = await supabase
        .from('courses')
        .select('id, name')
        .order('name', {ascending:true})
      if (error)setErr(error.message)
      else setCourses(data || [])
    })()
  }, [])

  async function fetchBoard(cid, per) {
    if (!cid) return
    setErr('')
    setLoading(true)
    const {data, error} = await supabase.rpc('strokes_leaderboard',{
      p_course_id: Number(cid),
      p_period: per
    })
    if(error) setErr(error.message)
    else setRows(data || [])
    setLoading(false)
  }

  useEffect(() => {fetchBoard(courseId, period)}, [courseId, period])

  return (
    <main className="home">
      <section className="home__card" style={{maxWidth: 720}}>
        <h2 style={{margin: 0}}>Leaderboard — Lowest Strokes</h2>
        <div className="form" style={{marginTop:12}}>
          <div className="field">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              style={{height: 42, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text)' }}>
              <option value="">Select course…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="period">Period</label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{height: 42, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text)'}}>
              <option value="day">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {err && <p className="form__error" style={{marginTop: 8}}>{err}</p>}
        {loading && !err && <p className="form__meta" style={{ marginTop: 8 }}>Loading…</p>}
        <ol style={{padding: 0, margin: 12, listStyle: 'none'}}>
          {rows.map((r, i) => (
            <li key={r.user_id} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto auto',
              gap: 10,
              alignItems: 'center',
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: 8
            }}>
              <div style={{width: 28, textAlign: 'right'}}>{i + 1}.</div>
              <div><strong>{r.display_name}</strong></div>
              <div className="form__meta">Rounds: {r.rounds_in_period}</div>
              <div style={{fontWeight: 700}}>{r.best_strokes}</div>
            </li>
          ))}
          {!loading && !err && courseId && rows.length === 0 && (
            <li className="form__meta" style={{padding: '8px 12px'}}>No rounds in this period.</li>
          )}
        </ol>
        <div className="home__actions" style={{marginTop: 8}}>
          <Link to="/leaderboard" className="btn btn--ghost">Handicap Board</Link>
          <Link to="/dashboard" className="btn btn--ghost">Back to Dashboard</Link>
        </div>
      </section>
    </main>
  )
}
