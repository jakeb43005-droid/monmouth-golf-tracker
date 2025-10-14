import {useEffect, useState} from 'react'
import {supabase} from '../lib/supabase'
import {Link, useNavigate} from 'react-router-dom'
export default function Dashboard() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
   (async () => {
    const {data: {user}}  = await supabase.auth.getUser()
    if(!user) {
      nav('/signin')
      return
    }
    setEmail(user.email ??'')
    setLoading(false)
   })()
  })

  async function signOut() {
    await supabase.auth.signOut()
    nav('/signin')
  }

  if(loading) return <div style={{padding:24}}>Loading...</div>
  return(
    <div style={{padding: 24, display: 'grid', gap: 10 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {email}</p>
      <nav style={{display:'grid', gap:10, maxWidth:300}}>
        <Link to="/record">Record New Round</Link>
        <Link to="/rounds">View Past Rounds</Link>
      </nav>
      <button onClick={signOut} style={{marginTop: 10, width: 150}}>Sign out</button>
    </div>
  )
}
