'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../libs/supabase'
import { useRouter } from 'next/navigation'

export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        await fetchTasks()
      }
    }
    init()
  }, [router, fetchTasks])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div style={{padding: '2rem', textAlign: 'center'}}>読み込み中...</div>

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>COALINX TASKS</h1>
        <button onClick={handleLogout} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>ログアウト</button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
            {task.title}
          </div>
        ))}
      </div>
    </div>
  )
}