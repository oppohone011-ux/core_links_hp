'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../libs/supabase'
import styles from './page.module.css'

export default function KinenSavingsPage() {
  const [days, setDays] = useState<number | null>(null)
  const [savings, setSavings] = useState(0)
  const [loading, setLoading] = useState(true)
  const DAILY_COST = 600 
  const ANNUAL_GOAL_DAYS = 365;

  useEffect(() => {
    const fetchKinenData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('smoke_logs')
          .select('quit_at')
          .eq('is_active', true)
          .limit(1)

        if (error) throw error

        if (data && data.length > 0) {
          const quitDate = new Date(data[0].quit_at)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24))
          const displayDays = diffDays < 0 ? 0 : diffDays + 1
          
          setDays(displayDays)
          setSavings(displayDays * DAILY_COST)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchKinenData()
  }, [])

  // 読み込み中は何も表示せず、背景（黒）のみにする
  if (loading) return null;

  const breathQuality = days ? Math.min(Math.floor((days / 7) * 100), 100) : 0
  const annualProgress = days ? Math.min((days / ANNUAL_GOAL_DAYS) * 100, 100) : 0;
  const daysLeft = days ? Math.max(ANNUAL_GOAL_DAYS - days, 0) : ANNUAL_GOAL_DAYS;

  const getBreathStatus = (p: number) => {
    if (p >= 100) return "完全クリア（無臭）"
    if (p >= 70) return "ほぼ消失"
    if (p >= 40) return "改善傾向"
    if (p >= 10) return "ヤニ臭残存"
    return "測定不能（タバコ臭）"
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.header}>BIO-MONITOR // CORELINKS</h1>
        
        {days !== null ? (
          <>
            <div className={styles.card}>
              <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                1年完遂ロード (残り {daysLeft} 日)
              </p>
              <div className={styles.walkingArea}>
                <span className={styles.progressLabelStart}>START</span>
                
                {/* 進行度に合わせてアイコンが進化 */}
                <div className={styles.walkingPerson} style={{ left: `calc(${annualProgress}% - 1rem)` }}>
                  {annualProgress === 0 ? '💤' : 
                   annualProgress < 5   ? '🚶‍♂️' : // 最初は徒歩
                   annualProgress < 15  ? '🏃‍♂️' : // 慣れたらダッシュ
                   annualProgress < 40  ? '🚲' : // 順調
                   annualProgress < 80  ? '🚙💨' : // 愛車 X-Trailで爆走
                   annualProgress < 100 ? '🚀' : // 完遂目前
                   '👑'} 
                </div>

                {/* ゴールアイコンを金貨に変更 */}
                <span className={styles.progressLabelEnd}>💰</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div className={styles.progressBarFill} style={{ width: `${annualProgress}%` }}></div>
              </div>
            </div>

            <div className={styles.card} style={{ padding: '2.5rem 1.5rem' }}>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>口臭回復パラメーター</p>
              <div className={styles.paramValueContainer}>
                <span className={styles.paramValue}>{breathQuality}</span>
                <span className={styles.paramUnit}>%</span>
              </div>
              <p className={styles.statusText}>{getBreathStatus(breathQuality)}</p>
              <div className={styles.progressBarTrack} style={{ height: '10px', marginTop: '20px' }}>
                <div className={styles.progressBarFill} style={{ width: `${breathQuality}%`, background: '#00ffaa' }}></div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>継続日数</p>
                <p className={styles.statValue}>{days}日目</p>
              </div>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>節約合計</p>
                <p className={styles.statValue} style={{ color: '#ffd700' }}>¥{savings.toLocaleString()}</p>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.card}><p>NO DATA AVAILABLE</p></div>
        )}

        <button className={styles.refreshBtn} onClick={() => window.location.reload()}>
          データを同期
        </button>
      </div>
    </div>
  )
}