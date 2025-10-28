import {useEffect, useState} from 'react'
import {supabase} from '../lib/supabase'
import {Link, useNavigate} from 'react-router-dom'
export default function Dashboard() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [check, setCheck] = useState(false)
  useEffect(() => {
   (async () => {
    const {data: {user}}  = await supabase.auth.getUser()
    if(!user) {
      nav('/signin')
      return
    }
    setEmail(user.email ??'')
    setCheck(true)
   })()
  })


async function testInsert() {
  const {data:{user}} = await supabase.auth.getUser()
  if (!user){alert('Not signed in');return}
  const COURSE_ID = 1; 
  const today = new Date().toISOString().slice(0,10)
  const {error} = await supabase.from('scores').insert([{
    user_id: user.id,
    course_id: COURSE_ID,
    played_on: today,
    strokes: 85
  }])
  if (error) alert(error.message)
  else alert(' Test round saved')
}



  if(!check) return null
  return (
    <main className="home">
      <section className="home__card dash__card">
        <header className="dash__header">
          <div className="dash__logo" aria-hidden>⛳️</div>
            <div>
          <h2 className="dash__title">Welcome To Your Dashboard</h2>
          <p className="dash__subtitle">Signed in as: <strong>{email}</strong></p>
          </div>
        </header>
        <div className="home__actions" style={{marginTop: 12}}>
          <Link to="/record" className="btn btn--primary">Record Round</Link>
          <Link to="/rounds" className="btn btn--ghost">View My Rounds</Link>
        </div>
        <section className="dash__stats">
          <div className="dash__stat">
            <span className="dash__stat-label">Rounds</span>
            <span className="dash__stat-value">N/A</span>
          </div>
          <div className="dash__stat">
            <span className="dash__stat-label">Current HDCAP</span>
            <span className="dash__stat-value">N/A</span>
          </div>
          <div className="dash__stat">
            <span className="dash__stat-label">Last Course</span>
            <span className="dash__stat-value"> N/A</span>
          </div>
        </section>
         <div style={{marginTop: 120, display:'grid'}}>
          <button
            className="btn btn--signoutbold"
            onClick={async () => {await supabase.auth.signOut(); nav('/signin')}} 
            > Sign Out </button>
            <button type="button" className="btn btn--ghost" onClick={testInsert}>
             Run Test Insert </button>
        </div>
        </section>
        </main>
  )
}
