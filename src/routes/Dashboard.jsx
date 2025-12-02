import {useEffect, useState} from 'react'
import {supabase} from '../lib/supabase'
import {Link, useNavigate} from 'react-router-dom'
import {toDifferential, computeIndex} from '../lib/handicap'
export default function Dashboard() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [rounds, setRounds] = useState(0)
  const [lastCourse, setLastCourse] = useState('N/A')
  const [indexVal, setIndexVal] = useState(null)

  useEffect(() => {
   (async () => {
    const {data: {user}}  = await supabase.auth.getUser()
    if(!user) {
      nav('/signin')
      return
    }
    setEmail(user.email ??'')
    setLoading(true)
    const { data: rows, error} = await supabase
    .from('scores')
    .select('played_on, strokes, courses (name, course_rating, course_slope)')
    .order('played_on', {ascending: false})
    .limit(20)

    if(error){
      setRounds(0)
      setLastCourse('N/A')
      setIndexVal(null)
      setLoading(false)
      return
    }

    const {count} = await supabase
      .from('scores')
      .select('id',{count: 'exact', head: true})

    setRounds(count ?? (rows?.length ?? 0))
    if (rows && rows.length) setLastCourse(rows[0].courses?.name ?? 'N/A')

    const diffs = (rows || []).map(e => toDifferential(e.strokes, e.courses?.course_rating, e.courses?.course_slope))
    const index = computeIndex(diffs)        
    setIndexVal(index)
    const display =
      (user.email?.split('@')[0] || 'golfer')
        .replace(/[^a-z0-9_]/gi, '')
        .slice(0, 20) || 'golfer'

    await supabase.from('profiles').upsert({
        user_id: user.id,
        display_name: display,
        handicap_index: index,                         
        rounds_count: count ?? (rows?.length ?? 0),
        updated_at: new Date().toISOString(),
      }, {onConflict: 'user_id'})
    setLoading(false)
   })()})
  return (
    <main className="home">
      <section className="home__card dash__card">
        <header className="dash__header">
          <div className="dash__logo" aria-hidden>⛳️</div>
            <div>
          <h2 className="dash__title">Welcome To Your Dashboard</h2>
          <p className="dash__subtitle">Signed in as: <strong>{email}</strong></p>
          </div></header>
        <div className="home__actions" style={{marginTop: 12}}>
          <Link to="/record" className="btn btn--primary">Record Round</Link>
          <Link to="/rounds" className="btn btn--ghost">View My Rounds</Link>
          <Link to="/leaderboard" className="btn btn--ghost">HDCAP Leaderboard</Link>
          <Link to="/strokes_leaderboard" className="btn btn--ghost">Strokes Leaderboard</Link>
          <Link to="/profile" className="btn btn--ghost">Profile</Link>
        </div>
        <section className="dash__stats">
          <div className="dash__stat">
            <span className="dash__stat-label">Total Rounds:  </span>
            <span className="dash__stat-value">{rounds}</span>
          </div>
          <div className="dash__stat">
            <span className="dash__stat-label">Current HDCAP: </span>
            <span className="dash__stat-value">{indexVal == null ? '-' : indexVal.toFixed(1)}</span>
          </div>
          <div className="dash__stat">
            <span className="dash__stat-label">Last Course: </span>
            <span className="dash__stat-value">{lastCourse}</span>
          </div>
        </section>
         <div style={{marginTop: 120, display:'grid', placeItems:'center'}}>
          <button
            className="btn btn--signoutbold"
            onClick={async () => {await supabase.auth.signOut(); nav('/signin')}} 
            > Sign Out </button>
        </div> </section> </main>
  )
}
