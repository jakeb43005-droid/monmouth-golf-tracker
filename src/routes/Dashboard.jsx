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
         <div style={{marginTop: 12, display:'grid'}}>
          <button
            className="btn btn--signoutbold"
            onClick={async () => {await supabase.auth.signOut(); nav('/signin')}} 
            Sign Out
            ></button>
        </div>
        </section>
        </main>
  )
}
