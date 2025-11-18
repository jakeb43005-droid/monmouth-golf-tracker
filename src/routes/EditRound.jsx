import {useEffect, useState} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'

export default function EditRound() {
  const {id} = useParams()
  const nav = useNavigate()
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [playedOn, setPlayedOn] = useState('')
  const [strokes, setStrokes] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      const {data: {user}} = await supabase.auth.getUser()
      if(!user){nav('/signin'); return}

      const {data:crs, error: cErr} = await supabase
        .from('courses')
        .select('id, name, par')
        .order('name', {ascending: true})
      if(cErr) {setErr(cErr.message); setLoading(false);return}
      setCourses(crs || [])

      const {data: rows, error: sErr} = await supabase
        .from('scores')
        .select('id, course_id, played_on, strokes, courses(name)')
        .eq('id', id)
        .limit(1)
      if(sErr) {setErr(sErr.message); setLoading(false);return}
      const row = rows?.[0]
      if(!row) {setErr('Round not found.'); setLoading(false);return}

      setCourseId(String(row.course_id))
      setPlayedOn(row.played_on)
      setStrokes(String(row.strokes))
      setLoading(false)
    })()
  },[id, nav])

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setSaving(true)
    const { error} = await supabase
      .from('scores')
      .update({
        course_id: Number(courseId),
        played_on: playedOn,
        strokes: Number(strokes),
      })
    .eq('id', id)
    setSaving(false)
    if (error) {setErr(error.message); return}
    nav('/rounds')
  }

  if(loading) return <div style={{padding: 24}}>Loading…</div>

  return (
    <main className="home">
      <section className="home__card" style={{maxWidth: 520}}>
        <h2 style={{margin: 0}}>Edit Round</h2>
        {err && <p className="form__error" style={{marginTop:8}}>{err}</p>}

        <form onSubmit={onSubmit} className="form" style={{marginTop: 12}}>
          <div className="field">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="input"
              style={{height: 42, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text)'}}
              required
              disabled={saving}
            >
              <option value="" disabled>Select course…</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Par {c.par})</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={playedOn}
              onChange={(e) => setPlayedOn(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          <div className="field">
            <label htmlFor="strokes">Strokes</label>
            <input
              id="strokes"
              type="number"
              min="40" max="200" step="1"
              value={strokes}
              onChange={(e) => setStrokes(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          <div className="form__actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving?'Saving…' : 'Save Changes'}
            </button>
            <Link to="/rounds" className="btn btn--ghost">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  )
}
