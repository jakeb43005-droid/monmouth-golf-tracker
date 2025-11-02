import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {supabase} from '../lib/supabase'

export default function RecordRound() {
  const nav = useNavigate()
  const [userId, setUserId] = useState(null)
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [playedOn, setPlayedOn] = useState('')
  const [strokes, setStrokes] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
     (async () => {
      const {data:{user}} = await supabase.auth.getUser()
      if (!user){nav('/signin'); return}
      setUserId(user.id)

      const {data, error} = await supabase
        .from('courses')
        .select('id, name, par')
        .order('name', {ascending: true})
      if (error) setErr(error.message)
      else setCourses(data || [])
    })()
  })

  const selectedCourse = useState(
    () => courses.find(c => String(c.id) === String(courseId)) || null,
    [courses, courseId]
  )

  async function onSubmit(e) {
    e.preventDefault()
    if (!userId || !courseId || !playedOn || !strokes) {
      setErr('Please select a course, pick a date, and enter strokes.')
      return
    }
    setErr(''); setLoading(true)
    try {
      const {error} = await supabase.from('scores').insert([{
        user_id: userId,
        course_id: Number(courseId),
        played_on: playedOn,        
        strokes:Number(strokes),
      }])
      if (error) {setErr(error.message);return}
      nav('/dashboard')
    } catch {
      setErr('Network Issue. Try Again')
    } finally{
      setLoading(false)
    }
  }
  const canSubmit = userId && courseId && playedOn && strokes
  return (
     <main className="home">
      <section className="home__card" style={{maxWidth: 560}}>
        <h2 style={{ margin: 0}}>Record Round</h2>

        {selectedCourse && (
          <p className="form__meta" style={{ marginTop: 6 }}>
            Course: <strong>{selectedCourse.name}</strong> · Par <strong>{selectedCourse.par}</strong>
            {strokes && selectedCourse.par != null ? (
              <> · To Par: <strong>{Number(strokes) - Number(selectedCourse.par)}</strong></>
            ) : null}
          </p>
        )}

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              disabled={loading || !courses.length}
            >
              <option value="">{courses.length ? 'Select course…' : 'Loading courses…'}</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Par {c.par})</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="played_on">Date</label>
            <input
              id="played_on"
              type="date"
              value={playedOn}
              onChange={(e) => setPlayedOn(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="strokes">Strokes</label>
            <input
              id="strokes"
              type="number"
              inputMode="numeric"
              min="40"
              max="200"
              placeholder="85"
              value={strokes}
              onChange={(e) => setStrokes(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {err && <p className="form__error">{err}</p>}

          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={loading || !canSubmit}>
              {loading ? 'Saving…' : 'Save Round'}
            </button>
            <p className="form__meta">or <Link to="/dashboard">cancel</Link></p>
          </div>
        </form>
      </section>
    </main>
  )
}