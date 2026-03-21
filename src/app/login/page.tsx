'use client'

import { useState } from 'react'
import { supabase } from '../../libs/supabase'
import { useRouter } from 'next/navigation'
import styles from './Login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError('メールアドレスまたはパスワードが正しくありません。')
        setLoading(false)
      } else {
        // --- 修正箇所：遷移先をダッシュボードに変更 ---
        router.push('/dashboard')
        // Next.jsの仕様で、たまに画面遷移が遅れることがあるので
        // 念のためloadingを戻さずそのままにします
      }
    } catch (err) {
      setError('予期せぬエラーが発生しました。')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.logoText}>COALINX <span className={styles.logoSub}>ADMIN</span></h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className={styles.input} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className={styles.input} 
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? '認証中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}