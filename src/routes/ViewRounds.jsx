import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {supabase} from '../lib/supabase'
const pages = 10

export default function Rounds() {
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const[loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    (async() => {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) {nav('/signin'); return}

      setErr('')
      setLoading(true)
      const start = 0
      const end = pages-1
      const {data, error,count} = await supabase
        .from('scores')
        .select('id, played_on, strokes, courses (name, par)', {count: 'exact'})
        .order('played_on',{ascending:false})
        .range(start,end)

       if(error){
        setErr(error.message)
       } else{
        setRows(data ||[])
        setTotal(count ?? null)
        setPage(0)
       }
       setLoading(false)
      })()
    },[nav])

    async function loadMore(){
      try{
      setLoadingMore(true)
      const nextPage = page + 1
      const start = nextPage * pages
      const end = start + pages-1

      const{data, error} = await supabase
      .from('scores')
      .select('id, played_on, strokes, courses (name, par)')
      .order('played_on', {ascending: false})
      .range(start, end)

      if(error){
        setErr(error.message)
        return
      }
      setRows(prev => [...prev, ...(data || [])])
      setPage(nextPage)
  } finally {
    setLoadingMore(false)
  }
}

  const more = total == null ? true: rows.length < total

 return (
    <main className="home">
      <section className="home__card" style={{maxWidth: 720}}>
        <h2 style={{margin: 0}}>My Rounds</h2>
        {err && <p className="form__error" style={{marginTop: 8}}>{err}</p>}
        {loading && !err && <p className="form__meta" style={{marginTop: 8}}>Loading…</p>}
        {!loading && !rows.length &&!err && (
          <p className="form__meta" style={{marginTop: 8}}>
            No rounds yet. <Link to="/record">Record your first round</Link>.
          </p>
        )}
        <ul style={{listStyle: 'none', padding: 0,margin: 12}}>
          {rows.map((r) => {
            const courseName = r.courses?.name ?? 'Course'
            const par = r.courses?.par ?? null
            const toPar = par != null ? r.strokes - par : null
            const dateStr = r.played_on
            return (
              <li
                key={r.id}
                style={{
                  padding: '10px 12px',
                  border:'1px solid var(--border)',
                  borderRadius: 10,
                  marginBottom:8,
                  display: 'grid',
                  gap: 4,
                }} >
                <div style={{display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center'}}>
                  <strong>{courseName}</strong>
                  <span className="form__meta">{dateStr}</span>
                  <Link
                    to={`/rounds/${r.id}/edit`}
                    className="btn btn--ghost"
                    style={{height: 32, padding: '0 10px'}}
                  >
                    Edit
                  </Link>
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

        {!loading && more && (
          <div className="form__actions" style={{marginTop: 8}}>
            <button className="btn btn--ghost" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading...': 'Load more'}
            </button>
            {total != null && (
              <p className="form__meta">Showing {rows.length} of {total}</p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
