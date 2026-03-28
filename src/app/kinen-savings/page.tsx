'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../libs/supabase'
import styles from './page.module.css'

export default function KinenSavingsPage() {
  const [days, setDays] = useState<number | null>(null)
  const [savings, setSavings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState("")

  const DAILY_COST = 1200 
  const ANNUAL_GOAL_DAYS = 365;

  // 日数に応じたフェーズ判定
  const getKinenStatus = (d: number) => {
    if (d <= 1) return { phase: "離脱症状：極大", msg: "脳がパニック中。深呼吸で凌げ！", color: "#ff4444" };
    if (d <= 3) return { phase: "最大の山場", msg: "ここを越えればニコチンが体から抜ける！", color: "#ff8800" };
    if (d <= 7) return { phase: "身体的離脱の終焉", msg: "味覚が復活。肺が掃除を開始したぞ。", color: "#ffcc00" };
    if (d <= 14) return { phase: "習慣との戦い", msg: "「吸いたい」は脳の嘘。水で誤魔化せ。", color: "#00ccff" };
    if (d <= 30) return { phase: "血管の修復", msg: "血流が劇的に改善。肌のツヤが出る頃だ。", color: "#00ffaa" };
    return { phase: "鉄の意志", msg: "もはや非喫煙者。自由を謳歌しよう。", color: "#ffffff" };
  };

  const calculateData = useCallback((quitAt: string) => {
    const quitDate = new Date(quitAt)
    const now = new Date()
    const startDate = new Date(quitDate.getFullYear(), quitDate.getMonth(), quitDate.getDate())
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const diffTime = today.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const displayDays = diffDays + 1
    
    setDays(displayDays)
    setSavings(displayDays * DAILY_COST)

    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const totalMsInDay = 24 * 60 * 60 * 1000
    const msUntilTomorrow = tomorrow.getTime() - now.getTime()
    const progress = ((totalMsInDay - msUntilTomorrow) / totalMsInDay) * 100
    setUpdateProgress(progress)
    
    const hours = Math.floor(msUntilTomorrow / (1000 * 60 * 60))
    const minutes = Math.floor((msUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60))
    setTimeLeft(`${hours}時間${minutes}分`)
  }, [DAILY_COST])

  useEffect(() => {
    let quitAtCache = ""
    const fetchKinenData = async () => {
      try {
        const { data, error } = await supabase.from('smoke_logs').select('quit_at').eq('is_active', true).limit(1)
        if (error) throw error
        if (data && data.length > 0) {
          quitAtCache = data[0].quit_at
          calculateData(quitAtCache)
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchKinenData()
    const timer = setInterval(() => { if (quitAtCache) calculateData(quitAtCache) }, 60000)
    return () => clearInterval(timer)
  }, [calculateData])

  if (loading) return null;
  const status = days ? getKinenStatus(days) : { phase: "分析中", msg: "Loading...", color: "#666" };
  const breathQuality = days ? Math.min(Math.floor((days / 7) * 100), 100) : 0
  const annualProgress = days ? Math.min((days / ANNUAL_GOAL_DAYS) * 100, 100) : 0;
  const daysLeft = days ? Math.max(ANNUAL_GOAL_DAYS - days, 0) : ANNUAL_GOAL_DAYS;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.header}>BIO-MONITOR // CORELINKS</h1>
        
        <div className={styles.updateBarContainer} style={{ marginBottom: '20px' }}>
           <p style={{ color: '#666', fontSize: '0.65rem', textAlign: 'right', marginBottom: '4px' }}>
             NEXT DATA SYNC: {timeLeft}
           </p>
           <div className={styles.progressBarTrack} style={{ height: '2px', background: '#111' }}>
             <div className={styles.progressBarFill} style={{ width: `${updateProgress}%`, background: '#555' }}></div>
           </div>
        </div>

        {days !== null ? (
          <>
            {/* 🆕 フェーズモニター */}
            <div className={styles.card} style={{ borderLeft: `4px solid ${status.color}`, textAlign: 'left' }}>
              <p className={styles.phaseLabel} style={{ color: status.color }}>CURRENT PHASE: {status.phase}</p>
              <p className={styles.phaseMsg}>{status.msg}</p>
              <div className={styles.successBadge}>
                {Array.from({ length: Math.min(days, 7) }).map((_, i) => (
                  <span key={i} className={styles.checkIcon}>✔</span>
                ))}
                <span className={styles.todayTarget}> MISSION ACTIVE</span>
              </div>
            </div>

            <div className={styles.card}>
              <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                1年完遂ロード (残り {daysLeft} 日)
              </p>
              <div className={styles.walkingArea}>
                <span className={styles.progressLabelStart}>START</span>
                <div className={styles.walkingPerson} style={{ left: `calc(${annualProgress}% - 1rem)` }}>
                  {annualProgress < 100 ? '🏃‍♂️' : '👑'} 
                </div>
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
                <p className={styles.statLabel}>浮いたお金</p>
                <p className={styles.statValue} style={{ color: '#ffd700' }}>¥{savings.toLocaleString()}</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}