import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
      setErr('Network Issue — try again')
    } finally {
      setLoading(false)
    }
  }
  const canSubmit = userId && courseId && playedOn && strokes
}